const DrawCard = require('../../../build/server/game/drawcard.js');

describe('DrawCard', function () {
    beforeEach(function () {
        this.testCard = { code: '111', label: 'test 1(some pack)', name: 'test 1' };
        this.gameSpy = jasmine.createSpyObj('game', ['emitEvent']);
        this.card = new DrawCard({ game: this.gameSpy }, this.testCard);
    });

    describe('moveTo()', function() {
        it('should set the location', function() {
            this.card.moveTo('hand');
            expect(this.card.location).toBe('hand');
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
