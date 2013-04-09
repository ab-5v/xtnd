
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

        switch ( Object.prototype.toString.call(val) ) {
            case '[object Array]': return val;
            case '[object Arguments]': return Array.prototype.slice.call(val);
            case '[object Undefined]': return [];
            default: return [ val ];
        }
    }
};

module.exports = xtnd;
