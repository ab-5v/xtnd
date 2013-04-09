
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
    keys: function(obj) {
        return obj && typeof obj === 'object' ? Object.keys(obj) : [];
    }
};

module.exports = xtnd;
