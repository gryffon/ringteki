const Costs = require('../../../build/server/game/costs.js');

describe('Costs.payReduceableFateCost', function() {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['addMessage']);
        this.playerSpy = jasmine.createSpyObj('player', ['getDuplicateInPlay', 'getMinimumCost', 'getReducedCost', 'markUsedReducers', 'checkRestrictions']);
        this.playerSpy.checkRestrictions.and.returnValue(true);
        this.cardSpy = { card: 1, allowGameAction: () => true };
        this.context = {
            costs: {},
            game: this.gameSpy,
            player: this.playerSpy,
            source: this.cardSpy
        };
        this.cost = Costs.payReduceableFateCost('playing-type');
    });

    describe('canPay()', function() {
        beforeEach(function() {
            this.playerSpy.fate = 4;
            this.playerSpy.getMinimumCost.and.returnValue(4);
        });

        it('should return true when all criteria are met', function() {
            expect(this.cost.canPay(this.context)).toBe(true);
        });

        it('should check the cost properly', function() {
            this.cost.canPay(this.context);
            expect(this.playerSpy.getMinimumCost).toHaveBeenCalledWith('playing-type', this.context);
        });

        describe('when there is not enough fate', function() {
            beforeEach(function() {
                this.playerSpy.fate = 3;
            });

            it('should return false', function() {
                expect(this.cost.canPay(this.context)).toBe(false);
            });
        });
    });

    xdescribe('pay()', function() {
        beforeEach(function() {
            this.playerSpy.fate = 4;
            this.playerSpy.getReducedCost.and.returnValue(3);
        });

        describe('when there is no duplicate in play', function() {
            beforeEach(function() {
                this.cost.pay(this.context);
            });

            it('should mark the fate cost as the reduced cost', function() {
                expect(this.context.costs.spentFate).toBe(3);
            });

            it('should spend the players fate', function() {
                expect(this.playerSpy.fate).toBe(1);
            });

            it('should mark any reducers as used', function() {
                expect(this.playerSpy.markUsedReducers).toHaveBeenCalledWith('playing-type', this.cardSpy);
            });
        });
    });
});
