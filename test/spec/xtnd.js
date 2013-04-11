var sinon = require('sinon');
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
            expect( this.src.extend(123, 'asd', null, undefined, function() {}, {b: 2}) )
                .to.eql({ a: 1, b: 2 });
        });

    });

    describe('keys', function() {

        it('should return keys of object', function() {
            expect( xtnd.keys({a: 1, b: 2}) ).to.eql(['a', 'b']);
        });

        it('should return keys of array', function() {
            expect( xtnd.keys(['a', 'b']) ).to.eql(['0', '1']);
        });

        it('should return empty array for null', function() {
            expect( xtnd.keys(null) ).to.eql( [] );
        });

        it('should return empty array for non-object values', function() {
            expect( xtnd.keys('123') ).to.eql( [] );
            expect( xtnd.keys(undefined) ).to.eql( [] );
            expect( xtnd.keys(1234) ).to.eql( [] );
            expect( xtnd.keys(function() {}) ).to.eql( [] );
        });

    });

    describe('hash', function() {

        it('should return hash by array', function() {
            expect( xtnd.hash( [{a: 'k1', b: 2}, {a: 'k2', c: 3}], 'a' ) )
                .to.eql( { k1: {a: 'k1', b: 2}, k2: {a: 'k2', c: 3} } )
        });

        it('should skip objects without key', function() {
            expect( xtnd.hash( [{a: 'k1', b: 2}, {a: 'k2', c: 3}, {c: 4}], 'a' ) )
                .to.eql( { k1: {a: 'k1', b: 2}, k2: {a: 'k2', c: 3} } )
        });

        it('should skip non-object arrays', function() {
            expect( xtnd.hash([null, undefined, 1, 'asd', function() {}], 'a') )
                .to.eql({});
        });
    });

    describe('array', function() {

        it('should path through array', function() {
            expect( xtnd.array([1, 2, 3]) ).to.eql([1, 2, 3]);
        });

        it('should return empty array on undefined', function() {
            expect( xtnd.array(undefined) ).to.eql( [] );
        });

        it('should make array from arguments', function() {
            (function() {
                expect( xtnd.array(arguments) ).to.eql([1, 2])
            })(1, 2);
        });

        it('should make array from object', function() {
            expect( xtnd.array({a: 1}) ).to.eql( [{a: 1}] );
        });

        it('should make array from null', function() {
            expect( xtnd.array(null) ).to.eql( [null] );
        });

        it('should make array from function', function() {
            var f = function() {};
            expect( xtnd.array(f) ).to.eql( [f] );
        });

        it('should make array from primitive', function() {
            expect( xtnd.array(1234) ).to.eql( [1234] );
            expect( xtnd.array('as') ).to.eql( ['as'] );
        });
    });

    describe('each', function() {

        beforeEach(function() {
            this.spy = sinon.spy();
        });

        it('should iterate through array', function() {
            xtnd.each([1, 2, 3], this.spy);

            expect( this.spy.args )
                .to.eql( [ [ 1, 0, [1, 2, 3] ], [ 2, 1, [1, 2, 3] ], [ 3, 2, [1, 2, 3] ] ] );
        });

        it('should return iterated array', function() {
            expect( xtnd.each([1, 2, 3], this.spy) ).to.eql( [1, 2, 3] );
        });

        it('should iterate through object', function() {
            xtnd.each({a: 1, b: 2}, this.spy);

            expect( this.spy.args )
                .to.eql( [ [ 1, 'a', {a: 1, b: 2} ], [ 2, 'b', {a: 1, b: 2} ] ] );
        });

        it('should return iterated array', function() {
            expect( xtnd.each({a: 1, b: 2}, this.spy) ).to.eql( {a: 1, b: 2} );
        });

        it('should use xtnd.array while iterating through non objects', function() {
            sinon.spy(xtnd, 'array');

            xtnd.each(123, this.spy);
            xtnd.each('asd', this.spy);
            xtnd.each(null, this.spy);
            xtnd.each(undefined, this.spy);
            xtnd.each(function() {}, this.spy);

            expect( xtnd.array.callCount ).to.eql(5);

            xtnd.array.restore();
        });

        it('should return primitives', function() {
            expect( xtnd.each(123, this.spy) ).to.eql( 123 );
            expect( xtnd.each('asd', this.spy) ).to.eql( 'asd' );
            expect( xtnd.each(null, this.spy) ).to.eql( null );
            expect( xtnd.each(undefined, this.spy) ).to.eql( undefined );
            expect( xtnd.each(function() {}, this.spy) ).to.be.a(Function);
        });

    });

    describe('map', function() {

        it('should map array to array by default', function() {
            expect( xtnd.map([1,2,3], function(a) { return a+1; }) )
                .to.eql([2,3,4]);
        });

        /*
        it('should map array to array forced', function() {
            expect( xtnd.map([1,2,3], function(a) { return a+1; }, []) )
                .to.eql([2,3,4]);
        });

        it('should map array to object forced', function() {
            expect( xtnd.map([1,2,3], function(a) { return a+1; }, {}) )
                .to.eql( {'0': 2, '1': 3, '2': 4} );
        });

        it('should map object to object by default', function() {
            expect( xtnd.map({a: 1, b: 2}, function(a) { return a+1; }) )
                .to.eql( {a: 2, b: 3} );
        });

        it('should map object to object forced', function() {
            expect( xtnd.map({a: 1, b: 2}, function(a) { return a+1; }, {}) )
                .to.eql( {a: 2, b: 3} );
        });

        it('should map object to array forced', function() {
            expect( xtnd.map({a: 1, b: 2}, function(a) { return a+1; }, []) )
                .to.eql( [2, 3] );
        });

        it('should map array and modify forced array', function() {
            var forced = [];
            xtnd.map([1,2,3], function(a) { return a+1; }, forced);

            expect( forced ).to.eql([2,3,4]);
        });

        it('should map array and modify forced object', function() {
            var forced = {};
            xtnd.map([1,2,3], function(a) { return a+1; }, forced);

            expect( forced ).to.eql( {'0': 2, '1': 3, '2': 4} );
        });

        it('should map object and modify forced', function() {
            var forced = {};
            xtnd.map({a: 1, b: 2}, function(a) { return a+1; }, forced);

            expect( forced ).to.eql( {a: 2, b: 3} );
        });

        it('should map object and modify forced', function() {
            var forced = [];
            xtnd.map({a: 1, b: 2}, function(a) { return a+1; }, forced);

            expect( forced ).to.eql( [2, 3] );
        });
        */

        it('should not modify original array', function() {
            var arr = [1, 2, 3];
            xtnd.map(arr, function(a) { return a+1; });

            expect(arr).to.eql([1,2,3]);

        });

        it('should filter values from array by undefined', function() {

            expect( xtnd.map([1,2,3], function(a) { if (a != 2) return a+1; }) )
                .to.eql( [2,4] );
        });

        /*
        it('should not modify original object', function() {
        });
        */

    });

    describe('prod', function() {

        beforeEach(function() {
            this.spy = sinon.spy();
        });

        it('should iterate through product', function() {
            xtnd.prod([1,2,3], [1,2], this.spy);

            expect( this.spy.args )
                .to.eql( [ [ 1, 1 ], [ 1, 2 ], [ 2, 1 ], [ 2, 2 ], [ 3, 1 ], [3, 2] ] );
        });

    });

});
