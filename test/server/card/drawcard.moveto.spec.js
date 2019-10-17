const DrawCard = require('../../../build/server/game/drawcard.js');

describe('DrawCard', function () {
    beforeEach(function () {
        this.testCard = { code: '111', label: 'test 1(some pack)', name: 'test 1' };
        this.gameSpy = jasmine.createSpyObj('game', ['emitEvent']);
        this.card = new DrawCard({ game: this.gameSpy }, this.testCard);
        spyOn(this.card, 'removeLastingEffects');
    });

    describe('moveTo()', function() {
        it('should set the location', function() {
            this.card.moveTo('hand');
            expect(this.card.location).toBe('hand');
        });

        it('should call removeLastingEffects if moved between out of play areas', function() {
            this.card.moveTo('dynasty discard pile');
            this.card.moveTo('hand');
            expect(this.card.removeLastingEffects.calls.count()).toBe(2);
        });

        it('should call removeLastingEffects if moved from out of play to play area', function() {
            this.card.moveTo('province 1');
            this.card.moveTo('play area');
            expect(this.card.removeLastingEffects.calls.count()).toBe(2);
        });

        it('should call removeLastingEffects if moved from play area to an out of play area', function() {
            this.card.moveTo('play area');
            this.card.moveTo('conflict discard pile');
            expect(this.card.removeLastingEffects.calls.count()).toBe(2);
        });

        it('should not call removeLastingEffects if moved between provinces', function() {
            this.card.moveTo('province 1');
            this.card.moveTo('province 2');
            expect(this.card.removeLastingEffects.calls.count()).toBe(1);
        });

        describe('when the card is facedown', function() {
            beforeEach(function() {
                this.card.facedown = true;
            });

            describe('when moved to the play area', function() {
                beforeEach(function() {
                    this.card.moveTo('play area');
                });

                it('should flip the card', function() {
                    expect(this.card.facedown).toBe(false);
                });
            });

            describe('when moved to somewhere other than the play area', function() {
                beforeEach(function() {
                    this.card.moveTo('hand');
                });

                it('should flip the card', function() {
                    expect(this.card.facedown).toBe(false);
                });
            });
        });
    });
});
