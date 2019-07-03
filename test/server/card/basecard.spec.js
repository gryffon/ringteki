const BaseCard = require('../../../build/server/game/basecard.js');

describe('BaseCard', function () {
    beforeEach(function () {
        this.testCard = { id: '111', label: 'test 1(some pack)', name: 'test 1' };
        this.limitedCard = { id: '1234', text: 'Limited.' };
        this.nonLimitedCard = { id: '2222', text: 'Covert.' };
        this.game = jasmine.createSpyObj('game', ['raiseEvent', 'getCurrentAbilityContext']);
        this.owner = jasmine.createSpyObj('owner', ['getCardSelectionState', 'allowGameAction', 'getShortSummary']);
        this.owner.getCardSelectionState.and.returnValue({});
        this.owner.allowGameAction.and.returnValue(true);
        this.owner.game = this.game;
        this.card = new BaseCard(this.owner, this.testCard);
    });

    describe('when new instance created', function() {
        it('should generate a new uuid', function() {
            expect(this.card.uuid).not.toBeUndefined();
        });
    });

    describe('getSummary', function() {
        describe('when is active player', function() {
            beforeEach(function () {
                this.summary = this.card.getSummary(this.owner);
            });

            describe('and card is faceup', function() {
                it('should return card data', function() {
                    // TODO: Come back and check that this.testCard.name shouldn't be this.testCard.label
                    expect(this.summary.uuid).toEqual(this.card.uuid);
                    expect(this.summary.name).toEqual(this.testCard.name);
                    expect(this.summary.code).toEqual(this.testCard.code);
                });

                it('should not return facedown', function() {
                    expect(this.summary.facedown).toBeFalsy();
                });
            });

            describe('and card is facedown', function() {
                beforeEach(function () {
                    this.card.facedown = true;
                    this.summary = this.card.getSummary(this.owner);
                });

                it('should return no card data', function () {
                    expect(this.summary.uuid).toBeUndefined();
                    expect(this.summary.name).toBeUndefined();
                });

                it('should return facedown', function() {
                    expect(this.summary.facedown).toBe(true);
                });
            });
        });

        describe('when is not active player', function() {
            beforeEach(function () {
                this.anotherPlayer = jasmine.createSpyObj('owner', ['getCardSelectionState']);
                this.anotherPlayer.getCardSelectionState.and.returnValue({});
                this.summary = this.card.getSummary(this.anotherPlayer);
            });

            describe('and card is faceup', function() {
                describe('and hiding facedown cards', function() {
                    beforeEach(function() {
                        this.summary = this.card.getSummary(this.anotherPlayer, true);
                    });

                    it('should return no card data', function () {
                        expect(this.summary.uuid).toBeUndefined();
                        expect(this.summary.name).toBeUndefined();
                        expect(this.summary.code).toBeUndefined();
                    });

                    it('should return facedown', function() {
                        expect(this.summary.facedown).toBe(true);
                    });
                });

                it('should return card data', function () {
                    expect(this.summary.uuid).toEqual(this.card.uuid);
                    expect(this.summary.name).toEqual(this.testCard.name);
                    expect(this.summary.code).toEqual(this.testCard.code);
                });

                it('should not return facedown', function() {
                    expect(this.summary.facedown).toBe(false);
                });
            });

            describe('and card is facedown', function() {
                beforeEach(function () {
                    this.card.facedown = true;
                    this.summary = this.card.getSummary(this.anotherPlayer);
                });

                it('should return no card data', function() {
                    expect(this.summary.uuid).toBeUndefined();
                    expect(this.summary.name).toBeUndefined();
                    expect(this.summary.code).toBeUndefined();
                });

                it('should return facedown', function() {
                    expect(this.summary.facedown).toBe(true);
                });
            });
        });
    });
});
