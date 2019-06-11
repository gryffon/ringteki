const _ = require('underscore');
const cards = require('../../../build/server/game/cards');

describe('All Cards:', function() {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['on', 'removeListener', 'addPower', 'addMessage', 'addEffect']);
        this.gameSpy.rings = {
            air: {},
            earth: {},
            fire: {},
            void: {},
            water: {}
        };
        this.playerSpy = jasmine.createSpyObj('player', ['registerAbilityMax']);
        this.playerSpy.game = this.gameSpy;
    });

    _.each(cards, cardClass => {
        it('should be able to create \'' + cardClass.name + '\' and set it up', function() { //eslint-disable-line jasmine/missing-expect
            // No explicit assertion - if this throws an exception it will fail
            // and give us a better stacktrace than the expect().not.toThrow()
            // assertion.
            new cardClass(this.playerSpy, {});
        });
    });
});
