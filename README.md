[![build status](https://secure.travis-ci.org/artjock/xtnd.png)](http://travis-ci.org/artjock/xtnd)

xtnd
====
Extra methods for underscore and lodash

### Installation

```js
npm install xtnd
```

### Usage

```js
var xtnd = require('xtnd');

var a = ({}).extend({a: 1});  // {a: 1}

xtnd.array([1]);        // [1]
xtnd.array({a: 1});     // [{a: 1}]
xtnd.array(arguments);  // converts to array
xtnd.array(undefined);  // []
xtnd.array(null);       // null
xtnd.array(123);        // [123]
xtnd.array('a');        // ['a']

xtnd.hash([{a: 1, b: 2}, {a: 3, b: 4}], 'a');   // {1: {a: 1, b: 2}, 3: {a: 3, b: 4}}

xtnd.each(list, function(val, i, orig) {});
xtnd.map(list, function(val, i, orig) {});
xtnd.filter(list, function(val, i, orig) {});
xtnd.first(list, function(val, i, orig) {});

xtnd.isNull(null);            // true
xtnd.isArray([1, 2]);         // true
xtnd.isObject({a: 1});        // true
xtnd.isArguments(arguments);  // true
xtnd.isUndefined(undefined);  // true
```
