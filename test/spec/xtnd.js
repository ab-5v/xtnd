var expect = require('expect.js');

var xtnd = require('../../lib/xtnd.js');

describe('xtnd', function() {

    describe('extend', function() {

        beforeEach(function() {
            this.src = {a: 1};
        });

        it('should be a function in Object.prototype', function() {
            expect( Object.prototype.extend ).to.be.a(Function);
        });

        it('should extend object', function() {
            this.src.extend({b: 2, c: 3});

            expect( this.src ).to.eql( {a: 1, b: 2, c: 3 });
        });

        it('should overwrite value in object', function() {
            this.src.extend({a: 2});

            expect( this.src ).to.eql( {a: 2} );
        });

        it('should return extended object', function() {
            expect( this.src.extend({b: 2}) ).to.eql( {a: 1, b: 2 });
        });

        it('should extend empty object', function() {
            expect( ({}).extend({a: 1}) ).to.eql({a: 1});
        });

        it('should extend with array', function() {
            expect( this.src.extend(['a', 'b']) ).to.eql({a: 1, '0': 'a', '1': 'b'});
        });

        it('should extend with more than one object', function() {
            expect( this.src.extend({b: 2}, {c: 3}) ).to.eql({ a: 1, b: 2, c: 3 });
        });

        it('should overwrite values for more than one object', function() {
            expect( this.src.extend({b: 2}, {b: 3}) ).to.eql({ a: 1, b: 3 });
        });

        it('should ignore non-object values', function() {
            expect( this.src.extend(123, 'asd', null, undefined, {b: 2}) ).to.eql({ a: 1, b: 2 });
        });

    });

});
