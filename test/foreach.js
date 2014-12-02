#!/usr/bin/env node

var Av = require('../aventurine')
var desc = require('macchiato')


desc('#forEach()')
  .beforeEach(function () {
    this.av = new Av()
  })
  .it('Should return random value from 10 keys', function (t) {
    var noKeys = 10
    var count = 0

    for (var i = 0; i < noKeys; i++) this.av.push('t' + i)
    
    this.av.forEach(function (value, index, next) {
      next()
      t.equals(value, 't' + count)
      if (++count === 10) t.end()
    })
  })
  .it('Should return random value from 100 keys', function (t) {
    var noKeys = 100
    var count = 0

    for (var i = 0; i < noKeys; i++) this.av.push('t' + i)
    
    this.av.forEach(function (value, index, next) {
      next()
      console.log(value, index)
      t.equals(value, 't' + count)
      if (++count === 100) t.end()
    })
  })
//  .it('Should return random value from 100 keys', function (t) {
//    var index =  Math.floor(Math.random() * 100)
//    var noKeys = 100
//
//    for (var i = 0; i < noKeys; i++) this.av.push('t' + i)
//    
//    this.av.get(index, function (err, value) {
//      t.equals(value, 't' + index)
//      t.end()
//    })
//  })
//  .it('Should return all correct values from 100 keys', function (t) {
//    var noKeys = 100
//    var count = 0 
//
//    function get(index) {
//      t.av.get(index, function (err, value) {
//        t.equals(value, 't' + index)
//        t.end()
//      })
//
//      if (++count === noKeys) t.end()
//    }
//    for (var i = 0; i < noKeys; i++) this.av.push('t' + i)
//    for (i = 0; i < noKeys; i++) get(i)
//  })
//  .it('Should return random value from 1000 keys', function (t) {
//    var index =  Math.floor(Math.random() * 1000)
//    var noKeys = 1000
//
//    for (var i = 0; i < noKeys; i++) this.av.push('t' + i)
//    
//    this.av.get(index, function (err, value) {
//      t.equals(value, 't' + index)
//      t.end()
//    })
//  })
//  .it('Should return all correct values from 1000 keys', function (t) {
//    var noKeys = 1000
//    var count = 0 
//
//    function get(index) {
//      t.av.get(index, function (err, value) {
//        t.equals(value, 't' + index)
//        t.end()
//      })
//
//      if (++count === noKeys) t.end()
//    }
//    for (var i = 0; i < noKeys; i++) this.av.push('t' + i)
//    for (i = 0; i < noKeys; i++) get(i)
//  })
//  .it('Should return random value from 10000 keys', function (t) {
//    var index =  Math.floor(Math.random() * 10000)
//    var noKeys = 10000
//
//    for (var i = 0; i < noKeys; i++) this.av.push('t' + i)
//    
//    this.av.get(index, function (err, value) {
//      t.equals(value, 't' + index)
//      t.end()
//    })
//  })
//  .it('Should return random value from 100000 keys', function (t) {
//    var index =  Math.floor(Math.random() * 100000)
//    var noKeys = 100000
//
//    for (var i = 0; i < noKeys; i++) this.av.push('t' + i)
//    
//    this.av.get(index, function (err, value) {
//      t.equals(value, 't' + index)
//      t.end()
//    })
//  })
//  .it('Should return random value from 1000000 keys', function (t) {
//    var index =  Math.floor(Math.random() * 1000000)
//    var noKeys = 1000000
//
//    for (var i = 0; i < noKeys; i++) this.av.push('t' + i)
//    
//    this.av.get(index, function (err, value) {
//      t.equals(value, 't' + index)
//      t.end()
//    })
//  })
