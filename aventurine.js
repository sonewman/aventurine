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

function Aventurine(maxLength) {
  this.max = maxLength || 10

  this.root
  = this.cursor
  = this.first
  = this.iterator
  = new Model()
}

Aventurine.Model
Aventurine.prototype.length = 0
Aventurine.prototype.max = null
Aventurine.prototype.root = null
Aventurine.prototype.cursor = null
Aventurine.prototype.first = null
Aventurine.prototype.iterator = null
Aventurine.prototype.iteratorIndex = 0

function addInheritance(model, parent) {
  model.parent = parent
  parent.list.push(model)
  parent.length += 1
}

function resolveNext(av, model, parent, max, prev) {
  if (model.length < max) return model
  
  if (parent) {
    if (parent.length === max) 
      return resolveNext(av, parent, parent.parent, max, prev)
  } else {
    parent = new Model()
    av.root = parent
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


Aventurine.prototype.push = function (item) {
  var c = this.cursor
  this.cursor = resolveNext(this, c, c.parent, this.max, c)
  this.cursor.list.push(item)
  this.cursor.length += 1
  this.length += 1
}

Aventurine.prototype.next = function () {
  var nextIndex = this.iteratorIndex
  var d = this.iterator.list
  var next = d[nextIndex]

  if (nextIndex < this.max && next) {
    this.iteratorIndex += 1
    return next
  } else {
    this.iteratorIndex = 0
    next = this.iterator.next
    if (next && next.length) {
      d = next.list
      this.iterator = next
      this.iteratorIndex += 1
      return d[0]
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
