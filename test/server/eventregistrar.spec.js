const EventRegistrar = require('../../build/server/game/eventregistrar.js');

describe('EventRegistrar', function () {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['on', 'removeListener']);
        this.context = {
            method: function() {},
            anotherMethod: function() {},
            finalMethod: function() {}
        };
        this.boundHandler = {};
        spyOn(this.context.method, 'bind').and.returnValue(this.boundHandler);
        this.events = new EventRegistrar(this.gameSpy, this.context);
    });

    describe('register()', function () {
        it('should throw when a handler method does not exist on the given context', function() {
            expect(() => {
                this.events.register(['thisMethodDoesNotExist']);
            }).toThrow();
        });

        it('should bind the event with the given context', function() {
            this.events.register(['method']);
            expect(this.context.method.bind).toHaveBeenCalledWith(this.context);
        });

        it('should register the event with the game', function() {
            this.events.register(['method']);
            expect(this.gameSpy.on).toHaveBeenCalledWith('method', this.boundHandler);
        });

        it('should handle multiple events', function() {
            this.events.register(['method', 'anotherMethod']);
            expect(this.gameSpy.on).toHaveBeenCalledWith('method', this.boundHandler);
            expect(this.gameSpy.on).toHaveBeenCalledWith('anotherMethod', jasmine.any(Function));
        });

        it('should accept an event-to-method mapping', function() {
            this.events.register(['anotherMethod', { 'foo': 'method', 'bar': 'finalMethod' }]);
            expect(this.gameSpy.on).toHaveBeenCalledWith('foo', this.boundHandler);
            expect(this.gameSpy.on).toHaveBeenCalledWith('bar', jasmine.any(Function));
            expect(this.gameSpy.on).toHaveBeenCalledWith('anotherMethod', jasmine.any(Function));
        });
    });

    describe('unregisterAll()', function() {
        beforeEach(function() {
            this.events.register(['method', 'anotherMethod']);
        });

        it('should remove the listeners from the game', function() {
            this.events.unregisterAll();
            expect(this.gameSpy.removeListener).toHaveBeenCalledWith('method', this.boundHandler);
            expect(this.gameSpy.removeListener).toHaveBeenCalledWith('anotherMethod', jasmine.any(Function));
        });

        it('should not unregister multiple times', function() {
            this.events.unregisterAll();
            this.gameSpy.removeListener.calls.reset();
            this.events.unregisterAll();
            expect(this.gameSpy.removeListener.calls.count()).toBe(0);
        });
    });
});
