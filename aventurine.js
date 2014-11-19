module.exports = Aventurine

function Model() {
  this.list = []
}

var mpro = Model.prototype
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
  = new Model()
  this.root.parent = this
}

Aventurine.Model
Aventurine.prototype.length = null
Aventurine.prototype.max = null
Aventurine.prototype.root = null
Aventurine.prototype.cursor = null
Aventurine.prototype.first = null
Aventurine.prototype.iterator = null
Aventurine.prototype.iteratorIndex = null

function addInheritance(model, parent) {
  model.parent = parent
  model.index = parent.list.length
  parent.list.push(model)
  parent.length += 1
}

function resolveNext(av, model, parent, max, prev) {
  if (model.length < max) return model

  if (parent && !parent.root) {
    if (parent.length === max)
      return resolveNext(av, parent, parent.parent, max, prev)
  } else {
    parent = new Model()
    av.root = parent
    parent.count = model.count
    parent.parent = av
    addInheritance(model, parent)
  }

  var list = parent.list
  var child = list[list.length - 1]

  if (child.length < max) return child

  child = new Model()
  addInheritance(child, parent)

  child.prev = prev
  prev.next = child
  return child
}

//function recursiveIncrement(model) {
//  var parent = model.parent
//  model.count += 1
//
//  if (parent && !parent.root)
//    recursiveIncrement(model.parent)
//}

function recurseUpTree(model, cb) {
  var parent = model.parent
  cb(model)

  if (parent && !parent.root)
    recurseUpTree(model.parent, cb)
}

function increment(model) {
  model.count += 1
}

function recursiveIncrement(model) {
  recurseUpTree(model, increment)
}

function decrement(model) {
  model.count -= 1
}

function recursiveDecrement(model) {
  recurseUpTree(model, decrement)
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

function call(fn, ctx, arg1, arg2) {
  if (isNullOrUndefined(ctx)) fn(arg1, arg2)
  else fn.call(ctx, arg1, arg2)
}

Aventurine.prototype.forEach = function (fn, ctx) {
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

function find(av, model, index, lower, cb) {
  var list = model.list
  var l = list.length
  var upper = 0
  var total

  // grab first item and check if it is
  // a Model
  var item = list[0]

  if (!(item instanceof Model)) {
    item = list[index]
    cb(av, model, list, item, index)
    
    return !isNullOrUndefined(item) 
      ? item
      : null
  }

  upper = item.count
  for (var i = 0; i < l; i++) {
    if (index >= lower && index < upper) {
      index -= lower
      return find(av, item, index, lower, cb)
    }

    total = item.count
    item = list[i + 1]
    if (item)  {
      lower += total
      upper += item.count
    } else {
      break
    }
  }

  return null
}

Aventurine.prototype.get = function (index) {
  return find(this, this.root, index, 0, noop)
}

function del(av, model, list, item, index) {
  var parent
  var removed
  var next
  var prev
  
  if (index >= av.length) return null
  
  if (list.length > 1) {
    removed = list.splice(index, 1)
    recursiveDecrement(model)
    model.length -= 1
  } else {
    removed = list[0]
    list.length = 0
    recursiveDecrement(model)
    
    parent = model.parent
    if (!parent.root) {
      parent.list.splice(model.index, 1)
      parent.length -= 1
    }
  
    next = model.next || null
    prev = model.prev || null

    if (prev) prev.next = next
    if (next) next.prev = prev
    

    if (model === av.cursor)
      av.cursor = prev

    if (model === av.iterator)
      av.iterator = next
  }
  
  av.length -= 1
}

Aventurine.prototype.del = function (index) {
  return find(this, this.root, index, 0, del)
}
