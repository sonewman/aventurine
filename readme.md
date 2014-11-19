# Aventurine

```bash
npm install aventurine
```

Aventurine is an array like data store, it is a little different from an array in that it splits the data behind the scenes into lots of little arrays.

Due to further archetectual decisions it makes iteration over a high number of data items extremely fast.

Usage:
```javascript
var Aventurine = require('aventurine')
var store = new Aventurine()
```

At present the API is limited to the following:

### store.push(data)

### store.next()

### store.forEach(callback [, context])

### store.get(index)

### store.del(index)
