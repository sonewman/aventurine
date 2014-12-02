module.exports = Aventurine

function Branch() {
  this.list = []
}

function isBranch(obj) {
  return obj instanceof Branch
}

var mpro = Branch.prototype
mpro.list = null
mpro.parent = null
mpro.prev = null
mpro.next = null
mpro.level = 0
mpro.length = 0
mpro.count = 0
mpro.index = 0

function Aventurine() {
  this.max = 10
  this.length = 0
  this.iteratorIndex = 0

  this.root
  = this.cursor
  = this.first
  = this.iterator
  = new Branch()
  this.root.parent = this
}

Aventurine.Branch
Aventurine.prototype.length = null
Aventurine.prototype.max = null
Aventurine.prototype.root = null
Aventurine.prototype.cursor = null
Aventurine.prototype.first = null
Aventurine.prototype.iterator = null
Aventurine.prototype.iteratorIndex = null

function addInheritance(branch, parent) {
  branch.parent = parent
  branch.index = parent.list.length
  parent.list.push(branch)
  parent.length += 1
}

function resolveNext(av, branch, parent, max, prev) {
  if (branch.length < max) return branch

  if (parent && !parent.root) {
    if (parent.length === max)
      return resolveNext(av, parent, parent.parent, max, prev)
  } else {
    parent = new Branch()
    av.root = parent
    parent.count = branch.count
    parent.parent = av
    addInheritance(branch, parent)
  }

  var list = parent.list
  var child = list[list.length - 1]

  if (child.length < max) return child

  child = new Branch()
  addInheritance(child, parent)

  child.prev = prev
  prev.next = child
  return child
}


//function recursiveIncrement(branch) {
//  var parent = branch.parent
//  branch.count += 1
//
//  if (parent && !parent.root)
//    recursiveIncrement(branch.parent)
//}

function recurseUpTree(branch, cb) {
  var parent = branch.parent
  cb(branch)

  if (parent && !parent.root)
    recurseUpTree(branch.parent, cb)
}

function increment(branch) {
  branch.count += 1
}

function recursiveIncrement(branch) {
  recurseUpTree(branch, increment)
}

function decrement(branch) {
  branch.count -= 1
}

function recursiveDecrement(branch) {
  recurseUpTree(branch, decrement)
}

function recursiveSubtract(branch, value) {
  function decrease(b) {
    b.count -= value
  }

  recurseUpTree(branch, decrease)
}


Aventurine.prototype.push = function (item) {
  var c = this.cursor

  this.cursor = resolveNext(this, c, c.parent, this.max, c)
  this.cursor.list.push(item)
  recursiveIncrement(this.cursor)
  this.cursor.length += 1
  this.length += 1
}

Aventurine.prototype.next = function () {
  var nextIndex = this.iteratorIndex
  var list = this.iterator.list
  var next = list[nextIndex]

  if (nextIndex < this.max && next) {
    this.iteratorIndex += 1
    return next
  } else {
    this.iteratorIndex = 0
    next = this.iterator.next
    if (next && next.length) {
      list = next.list
      this.iterator = next
      this.iteratorIndex += 1
      return list[0]
    }
  }
  return null
}

Aventurine.prototype.reset = function () {
  this.iterator = this.first
  this.iteratorIndex = 0
}

function isNullOrUndefined(val) {
  return val === null || val === undefined
}


var schedule = 'undefined' === typeof setImmediate
  ? setImmediate
  : process.nextTick

function callAsync(fn, ctx, arg1, arg2, arg3) {
  schedule(function () {
    call(fn, ctx, arg1, arg2, arg3)
  })
}

function call(fn, ctx, arg1, arg2, arg3) {
  if (isNullOrUndefined(ctx)) fn(arg1, arg2, arg3)
  else fn.call(ctx, arg1, arg2, arg3)
}

Aventurine.prototype.forEach = function forEach(fn, ctx) {
  var cursor = this.first
  var max = this.max
  var c = 0

  ;(function n(i) {
    function callNext() { n(i) }

    var next = cursor.list[i]
    if (!next) return

    if (i < max && next) {
      callAsync(fn, ctx, next, c++, callNext)
      i += 1
    } else {
      i = 0
      cursor = cursor.next

      if (cursor && cursor.length) {
        callAsync(fn, ctx, cursor.list[0], c++, callNext)
        i += 1
      }
    }
  }(0))
}

Aventurine.prototype.forEachSync = function (fn, ctx) {
  var cursor = this.first
  var l = this.length
  var max = this.max
  var i = 0
  var next

  for (var c = 0; c < l; c += 1) {
    next = cursor.list[i]

    if (i < max && next) {
      call(fn, ctx, next, c)
      i += 1
    } else {
      i = 0
      cursor = cursor.next

      if (cursor && cursor.length) {
        call(fn, ctx, cursor.list[0], c)
        i += 1
      }
    }
  }
}

function noop() {}

function noMatchErr(i) {
  return new Error('No Matching Item ' + i)
}


function find_(av, item, index, lower, cb) {
  process.nextTick(function () {
    find(av, item, index, lower, cb)
  })
}

function find(av, branch, index, lower, cb) {
  var list = branch.list
  var l = list.length
  var total = 0
  var upper = 0
  var item

  item = list[index - lower]
  if (item && !isBranch(item)) return cb(null, item)

  if (av.length < index) return cb(noMatchErr(index))
  
  // slower case or walking branches
  for (var i = 0; i < l; i++) {
    item = list[i]
    
    if (!item) break

    if (isBranch(item)) {
      lower += total
      total = item.count
      upper += total
      
      if (index >= lower && index < upper)
        return find_(av, item, index, lower, cb)
    }
  }
  
  cb(noMatchErr(index))
}

Aventurine.prototype.get = function (index, cb) {
  find(this, this.root, index, 0, cb)
}

function del(av, branch, list, item, index) {
  var parent
  var removed
  var next
  var prev

  if (list.length > 1) {
    removed = list.splice(index, 1)
    recursiveDecrement(branch)
    branch.length -= 1
  } else {
    removed = list[0]
    list.length = 0
    recursiveDecrement(branch)

    parent = branch.parent
    if (!parent.root) {
      parent.list.splice(branch.index, 1)
      parent.length -= 1
    }

    next = branch.next || null
    prev = branch.prev || null

    if (prev) prev.next = next
    if (next) next.prev = prev

    if (branch === av.cursor)
      av.cursor = prev

    if (branch === av.iterator)
      av.iterator = prev
  }

  av.length -= 1
}

Aventurine.prototype.del = function (index) {
  if (index >= this.length) return null
  return find(this, this.root, index, 0, del)
}

Aventurine.prototype.drop = function (index) {
  if (index < this.length && index > -1) 
    find(this, this.root, index, 0, drop)
  
  function drop(av, branch, list, item, index) {
    if ((av.length - 1) === index) {
      del(av, branch, list, item, index)
      return
    }
    
    var prevLen = list.length

    branch.length
    = list.length
    = index

    console.log(branch.count, branch.length, list.length)
    
    // fix `next`
    branch.next = null

    av.cursor = branch
    
    var diff = prevLen - index
    console.log(diff)
    recursiveSubtract(branch, diff)
    av.length -= diff

    var parent = branch.parent
    var branchIndex = branch.index
    var parentLen = parent.length
    
    function resolveRemove(m) {
//      console.log(m)
//      console.log()
//      var newTotal = m.index
//      var diff = m.list.length - newTotal
//      m.length = m.list.length = m.index + 1
//      av.length -= diff
    }

//    if (parent && !parent.root) {
//      for (var i = (branchIndex + 1); i < parentLen; i++)
//        recurseUpTree(parent.list[i], resolveRemove)
//    }
  }

}
