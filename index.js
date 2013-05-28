;(function(root) {

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

var TYPE = {
    NULL:       '[object Null]',
    ARRAY:      '[object Array]',
    OBJECT:     '[object Object]',
    FUNCTION:   '[object Function]',
    UNDEFINED:  '[object Undefined]',
    ARGUMENTS:  '[object Arguments]'
};

var xtnd = {

    TYPE: TYPE,

    /**
     * Returns type of object
     *
     * @param {Object} obj
     *
     * @returns String
     */
    type: function(obj) {
        return o_toString.call(obj);
    },

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
     * It skips objects, that doesn't have given key.
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
            case TYPE.ARRAY:        return val;
            case TYPE.ARGUMENTS:    return a_slice.call(val);
            case TYPE.UNDEFINED:    return [];
            default:                return [ val ];
        }
    },

    /**
     * Eterates through object and executes callback.
     * Returns passed value
     * @example
     *  xtnd.each({a: 1, b: 2}, function(val, key) {});
     *
     * @param {Object} list
     * @param {Function} cb
     *
     * @returns Object
     */
    each: function(list, cb) {
        var i, l, val, key;
        var isObject = xtnd.isObject(list);
        var arr = isObject ? xtnd.keys(list) : xtnd.array(list);

        for (i = 0, l = arr.length; i < l; i++) {
            key = isObject ? arr[i] : i;
            val = isObject ? list[key] : arr[key];

            if (false === cb(val, key, list)) {
                break;
            }
        }

        return list;
    },

    /**
     * Produces a new object of values by mapping each value in list through a transformation cb
     * If cb returns undefined - value will be skipped
     *
     * @param {Object} list
     * @param {Function} cb
     */
    map: function(list, cb) {
        var isObject = xtnd.isObject(list);
        var result = isObject ? {} : [];

        xtnd.each(list, function(val, key, orig) {
            var ans = cb(val, key, orig);

            if (ans !== undefined) {
                if (isObject) {
                    result[key] = ans;
                } else {
                    result.push(ans);
                }
            }
        });

        return result;
    },

    /**
     * Looks through each value in the list,
     * returning a list of all the values that pass a truth test (cb).
     *
     * @param {Object} list
     * @param {Function} cb
     *
     * @returns Object
     */
    filter: function(list, cb) {

        return xtnd.map(list, function(val, key, orig) {
            return cb(val, key, orig) ? val : undefined;
        });
    },

    /**
     * Looks through each value in the list, returning the first one that passes a callback.
     *
     * @param {Array} arr
     * @param {Function} cb
     *
     * @returns Object
     */
    first: function(arr, cb) {
        var ans;

        if (typeof cb !== 'function') { return ans; }

        xtnd.each(arr, function(val, key, orig) {
            if ( cb(val, key, orig) ) {
                ans = val;
                return false;
            }
        });

        return ans;
    }
};

/**
 * Creating type detection functions
 *  isArray
 *  isObject
 *  isFunction
 *  isNull
 *  isArguments
 *  ...
 *
 * @param {Object} obj
 *
 * @returns Boolean
 */
Object.keys(TYPE).forEach(function(type) {
    var val = TYPE[type];

    type = type.charAt(0) + type.toLowerCase().substr(1);

    xtnd['is' + type] = function(obj) {
        return xtnd.type(obj) === val;
    };
});


if (typeof module === 'object' && module.exports) {
    module.exports = xtnd;
} else {
    root.xtnd = xtnd;
}

})(this);
