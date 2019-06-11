const _ = require('underscore');

const BaseAbility = require('../../../build/server/game/baseability.js');
const { Stages } = require('../../../build/server/game/Constants.js');

describe('BaseAbility', function () {
    beforeEach(function () {
        this.gameSpy = jasmine.createSpyObj('game', ['promptForSelect', 'getEvent', 'queueSimpleStep']);
        this.gameSpy.queueSimpleStep.and.callFake((handler) => {
            handler();
        });
        this.allCardsSpy = jasmine.createSpyObj('allCards', ['toArray']);
        this.gameSpy.allCards = this.allCardsSpy;
        this.properties = { game: this.gameSpy };
    });

    describe('constructor', function() {
        describe('cost', function() {
            describe('when no cost is passed', function() {
                beforeEach(function() {
                    delete this.properties.cost;
                    this.ability = new BaseAbility(this.properties);
                });

                it('should set cost to be empty array', function() {
                    expect(this.ability.cost).toEqual([]);
                });
            });

            describe('when a single cost is passed', function() {
                beforeEach(function() {
                    this.cost = { cost: 1 };
                    this.properties.cost = this.cost;
                    this.ability = new BaseAbility(this.properties);
                });

                it('should set cost to be an array with the cost', function() {
                    expect(this.ability.cost).toEqual([this.cost]);
                });
            });

            describe('when multiple costs are passed', function() {
                beforeEach(function() {
                    this.cost1 = { cost: 1 };
                    this.cost2 = { cost: 2 };
                    this.properties.cost = [this.cost1, this.cost2];
                    this.ability = new BaseAbility(this.properties);
                });

                it('should set cost to be the array', function() {
                    expect(this.ability.cost).toEqual([this.cost1, this.cost2]);
                });
            });
        });

        describe('targets', function() {
            describe('when no target is passed', function() {
                beforeEach(function() {
                    delete this.properties.target;
                    delete this.properties.targets;
                    this.ability = new BaseAbility(this.properties);
                });

                it('should set cost to be empty object', function() {
                    expect(this.ability.targets).toEqual([]);
                });
            });

            describe('when a single target is passed using target', function() {
                beforeEach(function() {
                    this.target = { foo: 'bar' };
                    this.properties.target = this.target;
                    this.ability = new BaseAbility(this.properties);
                });

                it('should set the target sub-property of targets', function() {
                    expect(this.ability.targets).toEqual([jasmine.objectContaining({ name: 'target' })]);
                });
            });

            describe('when targets are passed using targets', function() {
                beforeEach(function() {
                    this.target1 = { foo: 'bar' };
                    this.target2 = { bar: 'baz' };
                    this.properties.targets = { toKill: this.target1, toSave: this.target2 };
                    this.ability = new BaseAbility(this.properties);
                });

                it('should set all targets', function() {
                    expect(this.ability.targets).toEqual([jasmine.objectContaining({ name: 'toKill' }), jasmine.objectContaining({ name: 'toSave' })]);
                });
            });
        });
    });

    describe('canPayCosts()', function() {
        beforeEach(function() {
            this.cost1 = jasmine.createSpyObj('cost1', ['canPay']);
            this.cost2 = jasmine.createSpyObj('cost1', ['canPay']);
            this.ability = new BaseAbility(this.properties);
            this.ability.cost = [this.cost1, this.cost2];
            this.context = { game: this.gameSpy, context: 1 };
            this.context.copy = () => this.context;
        });

        describe('when all costs can be paid', function() {
            beforeEach(function() {
                this.cost1.canPay.and.returnValue(true);
                this.cost2.canPay.and.returnValue(true);
            });

            it('should call canPay with the context object', function() {
                this.ability.canPayCosts(this.context);
                expect(this.cost1.canPay).toHaveBeenCalledWith(this.context);
                expect(this.cost2.canPay).toHaveBeenCalledWith(this.context);
            });

            it('should return true', function() {
                expect(this.ability.canPayCosts(this.context)).toBe(true);
            });
        });

        describe('when any cost cannot be paid', function() {
            beforeEach(function() {
                this.cost1.canPay.and.returnValue(true);
                this.cost2.canPay.and.returnValue(false);
            });

            it('should return false', function() {
                expect(this.ability.canPayCosts(this.context)).toBe(false);
            });
        });
    });

    describe('resolveCosts()', function() {
        beforeEach(function() {
            this.noResolveCost = jasmine.createSpyObj('cost1', ['canPay']);
            this.resolveCost = jasmine.createSpyObj('cost2', ['canPay', 'resolve']);
            this.ability = new BaseAbility(this.properties);

            this.context = { game: this.gameSpy, context: 1 };
            this.context.copy = () => this.context;
        });

        describe('when the cost has a resolve method', function() {
            beforeEach(function() {
                this.ability.cost = [this.resolveCost];

                this.results = this.ability.resolveCosts([], this.context, {});
            });

            it('should not call canPay on the cost', function() {
                expect(this.resolveCost.canPay).not.toHaveBeenCalled();
            });

            it('should call resolve on the cost', function() {
                expect(this.resolveCost.resolve).toHaveBeenCalledWith(this.context, {});
            });
        });
    });

    describe('canResolveTargets()', function() {
        beforeEach(function() {
            this.cardCondition = jasmine.createSpy('cardCondition');
            this.properties.target = { cardCondition: this.cardCondition, location: 'any' };
            this.ability = new BaseAbility(this.properties);

            this.card1 = jasmine.createSpyObj('card', ['checkRestrictions', 'getType']);
            this.card1.checkRestrictions.and.returnValue(true);
            this.card1.getType.and.returnValue('character');
            this.card2 = jasmine.createSpyObj('card', ['checkRestrictions', 'getType']);
            this.card2.checkRestrictions.and.returnValue(true);
            this.card2.getType.and.returnValue('holding');
            let game = { allCards: _([this.card1, this.card2]) };
            this.context = { game: game, stage: Stages.Target, targets: {} };
            this.context.copy = () => this.context;
        });

        describe('when there is a non-draw card', function() {
            beforeEach(function() {
                this.card1.getType.and.returnValue('plot');

                this.ability.canResolveTargets(this.context);
            });

            it('should not call card condition on that card', function() {
                expect(this.cardCondition).not.toHaveBeenCalledWith(this.card1, this.context);
                expect(this.cardCondition).toHaveBeenCalledWith(this.card2, this.context);
            });
        });

        describe('when there is at least 1 matching card', function() {
            beforeEach(function() {
                this.cardCondition.and.callFake(card => card === this.card2);
            });

            it('should return true', function() {
                expect(this.ability.canResolveTargets(this.context)).toBe(true);
            });
        });

        describe('when there are no matching cards', function() {
            beforeEach(function() {
                this.cardCondition.and.returnValue(false);
            });

            it('should return false', function() {
                expect(this.ability.canResolveTargets(this.context)).toBe(false);
            });
        });
    });

    describe('resolveTargets()', function() {
        beforeEach(function() {
            this.player = { player: 1 };
            this.source = { source: 1 };

            this.target1 = { target: 1, mode: 'single', location: 'any' };
            this.target2 = { target: 2, mode: 'single', location: 'any' };

            this.card1 = jasmine.createSpyObj('card1', ['checkRestrictions', 'getType', 'getEffects']);
            this.card1.checkRestrictions.and.returnValue(true);
            this.card1.getType.and.returnValue('character');
            this.card1.getEffects.and.returnValue([]);
            this.card2 = jasmine.createSpyObj('card1', ['checkRestrictions', 'getType', 'getEffects']);
            this.card2.checkRestrictions.and.returnValue(true);
            this.card2.getType.and.returnValue('character');
            this.card2.getEffects.and.returnValue([]);

            this.targetResults = {};

            this.properties.targets = { target1: this.target1, target2: this.target2 };
            this.ability = new BaseAbility(this.properties);

            this.context = { game: this.gameSpy, player: this.player, source: this.source, ability: this.ability, stage: 'target', targets: {} };
            this.context.copy = () => this.context;
            this.allCardsSpy.toArray.and.returnValue([this.card1, this.card2]);
        });

        it('should prompt the player to select each target', function() {
            this.ability.resolveTargets(this.context, this.targetResults);
            expect(this.gameSpy.promptForSelect).toHaveBeenCalledWith(this.player, { target: 1, onSelect: jasmine.any(Function), onCancel: jasmine.any(Function), selector: jasmine.any(Object), mustSelect: jasmine.any(Array), context: this.context, waitingPromptTitle: jasmine.any(String), buttons: jasmine.any(Array), onMenuCommand: jasmine.any(Function), mode: 'single', location: 'any', gameAction: [] });
            expect(this.gameSpy.promptForSelect).toHaveBeenCalledWith(this.player, { target: 2, onSelect: jasmine.any(Function), onCancel: jasmine.any(Function), selector: jasmine.any(Object), mustSelect: jasmine.any(Array), context: this.context, waitingPromptTitle: jasmine.any(String), buttons: jasmine.any(Array), onMenuCommand: jasmine.any(Function), mode: 'single', location: 'any', gameAction: [] });
        });
    });
});
