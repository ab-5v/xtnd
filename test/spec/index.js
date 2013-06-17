if (typeof require === 'function') {
    sinon = require('sinon');
    expect = require('expect.js');

    xtnd = require('../../');
}

describe('xtnd', function() {

    describe('extend', function() {

        beforeEach(function() {
            this.src = {a: 1};
        });

        it('should extend object', function() {
            xtnd(this.src, {b: 2, c: 3});

            expect( this.src ).to.eql( {a: 1, b: 2, c: 3 });
        });

        it('should overwrite value in object', function() {
            xtnd(this.src, {a: 2});

            expect( this.src ).to.eql( {a: 2} );
        });

        it('should return extended object', function() {
            expect( xtnd(this.src, {b: 2}) ).to.eql( {a: 1, b: 2 });
        });

        it('should extend empty object', function() {
            expect( xtnd({}, {a: 1}) ).to.eql({a: 1});
        });

        it('should extend with array', function() {
            expect( xtnd(this.src, ['a', 'b']) ).to.eql({a: 1, '0': 'a', '1': 'b'});
        });

        it('should extend with more than one object', function() {
            expect( xtnd(this.src, {b: 2}, {c: 3}) ).to.eql({ a: 1, b: 2, c: 3 });
        });

        it('should overwrite values for more than one object', function() {
            expect( xtnd(this.src, {b: 2}, {b: 3}) ).to.eql({ a: 1, b: 3 });
        });

        it('should ignore non-object values', function() {
            expect( xtnd(this.src, 123, 'asd', null, undefined, function() {}, {b: 2}) )
                .to.eql({ a: 1, b: 2 });
        });

        it('should extend function', function() {
            var f1 = function() {};
            xtnd(f1, {a: 1});

            expect( f1.a ).to.eql( 1 );
        });

        it('should extend static methods', function() {
            var f1 = xtnd(function() {}, {a: 1, b: 2});
            var f2 = xtnd(function() {}, f1);

            expect( f2.b ).to.eql(2);
        });

    });

    describe('type', function() {

        it('should return type for object', function() {
            expect( xtnd.type({}) ).to.eql( xtnd.TYPE.OBJECT );
        });

        it('should return type for array', function() {
            expect( xtnd.type([]) ).to.eql( xtnd.TYPE.ARRAY );
        });

        it('should return type for null', function() {
            expect( xtnd.type(null) ).to.eql( xtnd.TYPE.NULL );
        });

        it('should return type for undefined', function() {
            expect( xtnd.type(undefined) ).to.eql( xtnd.TYPE.UNDEFINED );
        });

        it('should return type for arguments', function() {
            expect( xtnd.type(arguments) ).to.eql( xtnd.TYPE.ARGUMENTS );
        });

        it('should return type for function', function() {
            expect( xtnd.type(function() {}) ).to.eql( xtnd.TYPE.FUNCTION );
        });

    });

    describe('is', function() {

        it('isObject should detect objects', function() {
            expect( xtnd.isObject({}) ).to.eql(true);
        });

        it('isObject should ignore other types', function() {
            [ [], 1, 'af', arguments, null, undefined, false, true ]
                .forEach(function(obj) {
                    expect( xtnd.isObject(obj) ).to.eql(false);
                });
        });

        it('isArray should detect arrays', function() {
            expect( xtnd.isArray([]) ).to.eql(true);
        });
        it('isFunction should detect functions', function() {
            expect( xtnd.isFunction(function() {}) ).to.eql(true);
        });
        it('isArguments should detect arguments object', function() {
            expect( xtnd.isArguments(arguments) ).to.eql(true);
        });
        it('isNull should detect nulls', function() {
            expect( xtnd.isNull(null) ).to.eql(true);
        });
        it('isUndefined should detect undefined', function() {
            expect( xtnd.isUndefined(undefined) ).to.eql(true);
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

    describe('values', function() {

        it('should return values of object', function() {
            expect( xtnd.values({a: 1, b: 2}) ).to.eql( [1, 2] );
        });

        it('should return array itself', function() {
            expect( xtnd.values([1, 2, 3]) ).to.eql( [1, 2, 3] );
        });

    });

    describe('hash', function() {

        it('should return hash by array', function() {
            expect( xtnd.hash( [{a: 'k1', b: 2}, {a: 'k2', c: 3}], 'a' ) )
                .to.eql( { k1: {a: 'k1', b: 2}, k2: {a: 'k2', c: 3} } );
        });

        it('should skip objects without key', function() {
            expect( xtnd.hash( [{a: 'k1', b: 2}, {a: 'k2', c: 3}, {c: 4}], 'a' ) )
                .to.eql( { k1: {a: 'k1', b: 2}, k2: {a: 'k2', c: 3} } );
        });

        it('should skip non-object arrays', function() {
            expect( xtnd.hash([null, undefined, 1, 'asd', function() {}], 'a') )
                .to.eql({});
        });

        it('shoud return hash of array values w/o key', function() {
            expect( xtnd.hash(['foo', 'bar', 'lolo']) )
                .to.eql( {'foo': 1, 'bar': 1, 'lolo': 1} );
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
                expect( xtnd.array(arguments) ).to.eql([1, 2]);
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

        it('should stop iteraing if callback returned false', function() {
            var spy = sinon.spy(function(v) { return v !== 3; });

            xtnd.each([1, 3, 5], spy);

            expect(spy.callCount).to.eql(2);
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

        it('should map array to array', function() {
            expect( xtnd.map([1,2,3], function(a) { return a+1; }) )
                .to.eql([2,3,4]);
        });

        it('should map object to object', function() {
            expect( xtnd.map({a: 1, b: 2}, function(a) { return a+1; }) )
                .to.eql( {a: 2, b: 3} );
        });

        it('should map complex object', function() {
            expect( xtnd.map({a: {v: 1}, b: {v: 2}, c: {v: 3}}, function(a) { a.e = 'a'; return a; }) )
                .to.eql( {a: {v: 1, e: 'a'}, b: {v: 2, e: 'a'}, c: {v: 3, e: 'a'}} );
        });

        it('should not modify original array', function() {
            var arr = [1, 2, 3];
            xtnd.map(arr, function(a) { return a+1; });

            expect(arr).to.eql([1,2,3]);

        });

        it('should not modify original object structure', function() {
            var obj = {a: 1, b: 2, c: 3};
            xtnd.map(obj, function(a) { return a+1; });

            expect(obj).to.eql({a: 1, b: 2, c: 3});

        });

        it('should filter values from array by undefined', function() {

            expect( xtnd.map([1,2,3], function(a) { if (a != 2) return a+1; }) )
                .to.eql( [2,4] );
        });

        it('should filter values from object by undefined', function() {

            expect( xtnd.map({a: 1, b: 2, c: 3}, function(a) { if (a != 2) return a+1; }) )
                .to.eql( {a: 2, c: 4} );
        });

    });

    describe('filter', function() {

        it('should filter array', function() {
            var arr = [1, 2, 3];

            expect( xtnd.filter(arr, function(v) {return v%2;}) ).to.eql( [1,3] );
        });

        it('should filter object', function() {
            var obj = {a: 1, b: 2, c: 3};

            expect( xtnd.filter(obj, function(v) {return v%2;}) ).to.eql( {a: 1, c: 3} );
        });

        it('should filter complex object', function() {
            var obj = {a: {v: 1}, b: {v: 2}, c: {v: 3}};

            expect( xtnd.filter(obj, function(v) {return v.v%2;}) ).to.eql( {a: {v:1}, c: {v:3}} );
        });

        it('should filter non arrays', function() {
            var filter = function(a) { return a; };

            expect( xtnd.filter(null, filter) ).to.eql([]);
            expect( xtnd.filter(undefined, filter) ).to.eql([]);
            expect( xtnd.filter(filter, filter) ).to.eql([filter]);
            expect( xtnd.filter(123, filter) ).to.eql([123]);
            expect( xtnd.filter(0, filter) ).to.eql([]);
            expect( xtnd.filter('abc', filter) ).to.eql(['abc']);
            expect( xtnd.filter('', filter) ).to.eql([]);
            expect( xtnd.filter(true, filter) ).to.eql([true]);
            expect( xtnd.filter(false, filter) ).to.eql([]);
        });

    });

    describe('find', function() {

        it('should return first matched element', function() {
            expect( xtnd.find([1,2,3,2], function(val) { return val === 2; }) ).to.eql( 2 );
        });

        it('should not iterate through all array', function() {
            var spy = sinon.spy(function(v) { return v !== 4; });
            xtnd.find([4,5,6,7], spy);

            expect( spy.callCount ).to.eql( 2 );
        });

        it('should return undefined, when no elements find', function() {
            expect( xtnd.find([4,5,6], function(v) { return v === 3; }) ).to.eql( undefined );
        });

        it('should return undefined when no callback provided', function() {
            expect( xtnd.find([4,5,6]) ).to.eql( undefined );
        });

    });

});
