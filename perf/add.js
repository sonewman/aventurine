#!/usr/bin/env node

var Av = require('../aventurine')
var noKeys = process.argv[2] || 100
var inspect = require('util').inspect

process.nextTick(function () {
  var st = +new Date()
  var ar = []
  for (var i = 0; i < 21; i++) ar.push('t' + i)
  +new Date()
  console.log('Speed Test')
  console.log('with %s keys', noKeys)
})

//process.nextTick(function () {
//  var st = +new Date()
//  var av = new Av()
//  for (var i = 0; i < 21; i++) av.push('t' + i)
//  +new Date()
//  console.log('with %s keys', noKeys)
//})

process.nextTick(function () {
  var st = +new Date()
  var ar = []
  for (var i = 0; i < noKeys; i++) ar.push('t' + i)
  console.log('Native Array: ' + ((+new Date()) - st) + 'ms')
})

process.nextTick(function () {
  var st = +new Date()
  var av = new Av()
  for (var i = 0; i < noKeys; i++) av.push('t' + i)
  console.log('Custom DB:    ' + ((+new Date()) - st) + 'ms')
//  console.log(inspect(av.root, {depth: Infinity}))
})
