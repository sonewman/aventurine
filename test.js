var desc = require('macchiato')
var Av = require('./aventurine')
var inspect = require('util').inspect

desc('aventurine')
  .it('Should store 10 values', function (t) {
    var av = new Av()
    for (i = 0; i < 10; i++) av.push('t' + i)
    t.equals(av.length, 10)
    t.end()
  })
  .it('Should store 100 values', function (t) {
    var av = new Av()
    for (i = 0; i < 201; i++) av.push('t' + i)
  console.log(inspect(av.root, { depth: Infinity }))
    t.equals(av.length, 100)
    t.end()
  })

