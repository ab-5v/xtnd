[![build status](https://secure.travis-ci.org/artjock/xtnd.png)](http://travis-ci.org/artjock/xtnd)

xtnd
====
Extra methods for underscore and lodash

### Installation

```js
npm install xtnd
```
```js
bower install xtnd
```

### Usage

```js
var xtnd = require('xtnd');
```
```html
<script src="./xtnd/index.js"></script>
```

### Api

* [xtnd](#xtnd)
* [xtnd.keys](#keys)
* [xtnd.values](#values)
* [xtnd.array](#array)
* [xtnd.hash](#hash)
* [xtnd.each](#each)
* [xtnd.map](#map)
* [xtnd.filter](#filter)
* [xtnd.clone](#clone)
* [xtnd.find](#find)
* [xtnd.param](#param)
* [xtnd.is&lt;Type&gt;](#is)


<a name="xtnd"></a>
#### xtnd(dest, src, ...)
Extends any object with `src`
```js
var a = xtnd({}, {a: 1});  // {a: 1}
```

<a name="keys"></a>
#### xtnd.keys(any)
Returns all object's keys
```js
function f() {}
f.a = 1; f.b = 2;
xtnd.keys(f);               // ['a', 'b']
xtnd.keys({a: 1, b: 2});    // ['a', 'b']
xtnd.keys([1, 2]);          // []
```

<a name="values"></a>
#### xtnd.values(any)
Returns all object's values
```js
xtnd.values([1, 2]);         // [1, 2]
xtnd.values({a: 1, b: 2});   // [1, 2]
```

<a name="array"></a>
#### xtnd.array(any)
Makes array from `any` value.
```js
xtnd.array([1]);        // [1]
xtnd.array({a: 1});     // [{a: 1}]
xtnd.array(arguments);  // converts to array
xtnd.array(undefined);  // []
xtnd.array(null);       // [null]
xtnd.array(123);        // [123]
xtnd.array('a');        // ['a']
```

<a name="hash"></a>
#### xtnd.hash(array, key)
Creates object from `array` of objects. Skips objects withou `key`. 
```js
xtnd.hash([{a: 1, b: 2}, {a: 3, b: 4}], 'a');   // {1: {a: 1, b: 2}, 3: {a: 3, b: 4}}
```

<a name="each"></a>
#### xtnd.each(list, function(val, i, orig) {})
Like any other `each` can iterate through arrays and objects. You can return `false` from callback and it will stop iteration.
```js
xtnd.each(list, function(val, i, orig) {
  return false;
});
```

<a name="map"></a>
#### xtnd.map(list, function(val, i, orig) {})
Can map not only arrays but also objects. You can return `undefined` from callback to skip `val`.
```js
var src = {a: 1, b: 2, c: 3};
var res = xtnd.map(src, function(val, i, orig) {
  if (val % 2) {
    return val + 4;
  }
});
// res === {a: 5, c: 7}
```

<a name="filter"></a>
#### xtnd.filter(list, function(val, i, orig) {})
Like a map, looks through each value in the list, returning a list of all the values that pass a callback truth test.

<a name="clone"></a>
#### xtnd.clone(src)
Creates a deep copy of the `src`.

<a name="find"></a>
#### xtnd.find(list, function(val, i, orig) {})
For array or object returns first matched (truthy-value returned) by callback `val` or `undefined`. It stops iterating after `val` returned.
```js
var res = xtnd.find([2, 3, 4, 5], function(val, i, orig) {
  return val % 2;  
});
// res === 3
```

<a name="param"></a>
#### xtnd.param(str, eq, sp)
Converts URL params into object
```js
xtnd.param('a=1&b=2')               // {a: '1', b: '1'}
xtnd.param('a:1|b:2', ':', '|')     // {a: '1', b: '2'}
```


<a name="is"></a>
#### xtnd.is&lt;Type&gt;
Strong type checkers.

```js
xtnd.isNull(null);            // true
xtnd.isNull({});              // false

xtnd.isArray([1, 2]);         // true
xtnd.isObject([1, 2]);        // false

xtnd.isObject({a: 1});        // true
xtnd.isArguments(arguments);  // true
xtnd.isUndefined(undefined);  // true
```
