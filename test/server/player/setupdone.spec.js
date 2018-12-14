const Player = require('../../../build/server/game/player.js');

function addCardsToHand(hand, number) {
    for(var i = 0; i < number; i++) {
        hand.push({});
    }
}

describe('Player', function() {
    describe('setupDone', function() {
        beforeEach(function() {
            this.game = jasmine.createSpyObj('game', ['getOtherPlayer', 'playerDecked', 'raiseEvent']);
            this.player = new Player('1', { username: 'Player 1', settings: {}}, true, this.game);
            this.player.deck = {};
            this.player.initialise();

            this.cardSpy = jasmine.createSpyObj('card', ['isUnique', 'addDuplicate']);
            this.findSpy = spyOn(this.player, 'findCardByName');

            spyOn(this.player, 'drawCardsToHand');

            this.findSpy.and.returnValue(undefined);

            this.cardSpy.facedown = true;
            this.cardSpy.name = 'Card';

            this.player.cardsInPlay.push(this.cardSpy);
            this.player.fate = 8;

            this.player.setupDone();
            addCardsToHand(this.player.hand, 3);
        });

        /* Don't have these steps in L5R setup
        describe('when the hand size is less than the starting hand size', function() {
            beforeEach(function() {
                addCardsToHand(this.player.hand, 3);

                this.player.setupDone();
            });

            it('should draw cards back up to the starting hand size', function() {
                expect(this.player.drawCardsToHand).toHaveBeenCalledWith(1);
            });
        });

        describe('when the hand size is greater than the starting hand size', function() {
            beforeEach(function() {
                this.player.drawCardsToHand.calls.reset();

                addCardsToHand(this.player.hand, 8);

                this.player.setupDone();
            });

            it('should not draw any cards', function() {
                expect(this.player.drawCardsToHand).not.toHaveBeenCalled();
            });
        });

        describe('when the hand size is equal to the starting hand size', function() {
            beforeEach(function() {
                this.player.drawCardsToHand.calls.reset();

                addCardsToHand(this.player.hand, 4);

                this.player.setupDone();
            });

            it('should not draw any cards', function() {
                expect(this.player.drawCardsToHand).not.toHaveBeenCalled();
            });
        });

        it('should turn all cards faceup', function() {
            expect(_.any(this.player.cardsInPlay, card => {
                return card.facedown;
            })).toBe(false);
        });

        it('should return unspent setup fate', function() {
            expect(this.player.fate).toBe(0);
        });
        */

    });
});
