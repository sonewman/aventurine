#!/usr/bin/env node

var Av = require('../aventurine')
var noKeys = process.argv[2] || 100

var nativeSt
var nativeEnd

var customSt
var customEnd

process.nextTick(function () {
  var ar = []
  for (var i = 0; i < 21; i++) ar.push('t' + i)
  +new Date()
  console.log('Speed Test')
})

process.nextTick(function () {
  var av = new Av()
  for (var i = 0; i < 21; i++) av.push('t' + i)
  +new Date()
  console.log('with %s keys', noKeys)
})

process.nextTick(function () {
  var ar = []
  for (var i = 0; i < noKeys; i++) ar.push('t' + i)
  nativeSt = +new Date()
  var c, d
  ar.forEach(function (key, i) {
    c = key
    d = i
  })
  nativeEnd = +new Date()
})

process.nextTick(function () {
  var av = new Av()
  for (var i = 0; i < noKeys; i++) av.push('t' + i)
  
  customSt = +new Date()
  var c, d
  av.forEach(function (key, i) {
    c = key
    d = i
  })
  customEnd = +new Date()
})


process.on('exit', function () {
  console.log('Native Array: ' + (nativeEnd - nativeSt) + 'ms')
  console.log('Custom DB:    ' + (customEnd - customSt) + 'ms')
})
