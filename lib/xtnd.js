var a_slice = Array.prototype.slice;
var o_toString = Object.prototype.toString;

Object.defineProperty(Object.prototype, 'extend', {
    value: function() {
        var arg, keys;

        for (var i = 0, l = arguments.length; i < l; i++) {
            arg = arguments[i];
            keys = xtnd.keys(arguments[i]);

           for (var j = 0; j < keys.length; j++) {
               this[ keys[j] ] = arg[ keys[j] ];
           }
        }

        return this;
    }
});

var xtnd = {

    /**
     * Returns an array of a given object's own enumerable properties
     *
     * @param {Object} obj
     *
     * @returns Array
     */
    keys: function(obj) {
        return obj && typeof obj === 'object' ? Object.keys(obj) : [];
    },

    /**
     * Converts array of objects to hash by one of the object's key.
     * It skips objects, that doesn't has given key.
     *
     * @example
     *  xtnd.hash( [{a: 'k1', b: 2}, {a: 'k2', c: 3}, { c: 4 }], 'a' )
     *      -> { k1: {a: 'k1', b: 2}, k2: {a: 'k2', c: 3} }
     *
     * @param {Array} arr
     * @param {String} key
     *
     * @returns Object
     */
    hash: function(arr, key) {
        var res = {};
        arr.forEach(function(val) {
            if (val && typeof val === 'object' && key in val) {
                res[ val[key] ] = val;
            }
        });
        return res;
    },

    /**
     * Ensures returned value to be an array.
     * It passes throught arrays, converts arguments object to array,
     * ignores undefiend and wraps other values into array
     *
     * @param {Any} value
     *
     * @returns Array
     */
    array: function(val) {

        switch ( o_toString.call(val) ) {
            case '[object Array]': return val;
            case '[object Arguments]': return a_slice.call(val);
            case '[object Undefined]': return [];
            default: return [ val ];
        }
    },

    /**
     * Eterates through object and executes callback.
     * Returns passed value
     * @example
     *  xtnd.each({a: 1, b: 2}, function(val, key) {});
     *
     * @param {Object} val
     * @param {Function} cb
     *
     * @returns Object
     */
    each: function(val, cb) {

        if ( o_toString.call(val) === '[object Object]' ) {
            xtnd.keys(val).forEach(function(key) { cb(val[key], key, val); });
        } else {
            xtnd.array(val).forEach(cb);
        }

        return val;
    },

    /**
     * Produces a new object of values by mapping each value in list through a transformation cb
     * If cb returns undefined - value will be skipped
     *
     * @param {Array} list
     * @param {Function} cb
     */
    map: function(list, cb) {
        var dest = [];

        xtnd.each(xtnd.array(list), function(val, key, orig) {
            var result = cb(val, key, orig);
            if (result !== undefined) {
                dest.push(result);
            }
        });

        return dest;
    },

    /**
     * Iterates through cartesian product of given arrays and returns it
     * @example
     *  xtnd.prod(arr1, arr2, arr3, function(v1, v2, v3) {});
     *
     * @param {Array} val1
     * @param {Array} val2
     * ...
     * @param {Function} cb
     */
    prod: function() {
        var arrs = xtnd.array(arguments);
        var cb = arrs.pop();

        var curr = [];
        var last = arrs.length - 1;

        iterate( 0 );

        function iterate( n ) {
            var arr = arrs[n];
            var len = arr.length;

            if ( n === last ) {
                for (var i = 0; i < len ; i++) {
                    curr[ n ] = arr[ i ];
                    cb.apply(null, curr);
                }
            } else {
                for (var i = 0; i < len ; i++) {
                    curr[ n ] = arr[ i ];
                    iterate( n + 1 );
                }
            }
        }
    }
};

module.exports = xtnd;
