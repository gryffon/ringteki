const AbilityResolver = require('../../../build/server/game/gamesteps/abilityresolver.js');

describe('AbilityResolver', function() {
    beforeEach(function() {
        this.game = jasmine.createSpyObj('game', ['getPlayers', 'markActionAsTaken', 'popAbilityContext', 'pushAbilityContext', 'getEvent', 'raiseEvent', 'reportError', 'openEventWindow', 'queueStep']);
        this.game.raiseEvent.and.callFake((name, params, handler) => {
            if(handler) {
                handler(params);
            }
        });
        this.game.getEvent.and.callFake((name, params, handler) => {
            if(handler) {
                handler(params);
            }
            return { setWindow: () => true };
        });

        this.ability = jasmine.createSpyObj('ability', [
            'isAction', 'isTriggeredAbility', 'isCardAbility', 'displayMessage', 'resolveCosts',
            'resolveTargets', 'executeHandler', 'hasLegalTargets', 'checkAllTargets', 'isCardPlayed'
        ]);
        this.ability.isTriggeredAbility.and.returnValue(false);
        this.ability.isCardAbility.and.returnValue(false);
        this.ability.hasLegalTargets.and.returnValue(true);
        this.ability.resolveTargets.and.returnValue({});
        this.source = jasmine.createSpyObj('source', ['createSnapshot', 'getType']);
        this.costEvent = jasmine.createSpyObj('costEvent', ['getResolutionEvent']);
        this.costEvent.getResolutionEvent.and.returnValue({ cancelled: false });
        this.player = { player: 1 };
        this.game.getPlayers.and.returnValue([this.player]);
        this.context = { foo: 'bar', player: this.player, source: this.source, ability: this.ability, targets: {}, selects: {}, rings: {} };
        this.resolver = new AbilityResolver(this.game, this.context);
    });

    describe('continue()', function() {
        describe('when the ability comes from a character', function() {
            beforeEach(function() {
                this.source.getType.and.returnValue('character');
                this.resolver.continue();
            });

            it('should create a snapshot of the character', function() {
                expect(this.source.createSnapshot).toHaveBeenCalled();
            });
        });

        xdescribe('when the ability is an action', function() {
            beforeEach(function() {
                this.ability.isAction.and.returnValue(true);
                this.ability.resolveCosts.and.returnValue([{ resolved: true, value: true }, { resolved: true, value: true }]);
                this.resolver.continue();
            });

            it('should mark that an action is being taken', function() {
                expect(this.game.markActionAsTaken).toHaveBeenCalled();
            });
        });

        describe('when all costs can be paid', function() {
            beforeEach(function() {
                this.ability.resolveCosts.and.returnValue([{ resolved: true, value: true }, { resolved: true, value: true }]);
                this.resolver.continue();
            });

            it('should execute the handler', function() {
                expect(this.ability.executeHandler).toHaveBeenCalledWith(this.context);
            });

            it('should not raise the onCardPlayed event', function() {
                expect(this.game.raiseEvent).not.toHaveBeenCalledWith('onCardPlayed', jasmine.any(Object));
            });
        });

        describe('when the ability is a card ability', function() {
            beforeEach(function() {
                this.ability.resolveCosts.and.returnValue([{ resolved: true, value: true }, { resolved: true, value: true }]);
                this.ability.isTriggeredAbility.and.returnValue(true);
                this.resolver.continue();
            });

            it('should raise the InitiateAbility event', function() {
                expect(this.game.openEventWindow).toHaveBeenCalledWith(jasmine.any(Object));
            });
        });

        describe('when the ability is not a card ability', function() {
            beforeEach(function() {
                this.ability.resolveCosts.and.returnValue([{ resolved: true, value: true }, { resolved: true, value: true }]);
                this.ability.isTriggeredAbility.and.returnValue(false);
                this.resolver.continue();
            });

            it('should not raise the onInitiateAbilityEffects event', function() {
                expect(this.game.raiseEvent).not.toHaveBeenCalledWith('onInitiateAbilityEffects', jasmine.any(Object), jasmine.any(Function));
            });
        });

        describe('when not all costs can be paid', function() {
            beforeEach(function() {
                this.resolver.canPayResults = { cancelled: true };
                this.resolver.costEvents = [this.costEvent];
                this.resolver.payCosts();
            });

            it('should not pay the costs', function() {
                expect(this.game.raiseEvent).not.toHaveBeenCalled();
            });

            it('should not execute the handler', function() {
                expect(this.ability.executeHandler).not.toHaveBeenCalled();
            });
        });

        describe('when the costs have resolved', function() {
            beforeEach(function() {
                this.canPayResult = { resolved: true };
                this.ability.resolveCosts.and.returnValue([this.canPayResult]);
            });

            describe('and the cost could be paid', function() {
                beforeEach(function() {
                    this.canPayResult.value = true;
                    this.resolver.continue();
                });

                it('should execute the handler', function() {
                    expect(this.ability.executeHandler).toHaveBeenCalledWith(this.context);
                });
            });

            describe('and the cost could not be paid', function() {
                beforeEach(function() {
                    this.resolver.canPayResults = { cancelled: true };
                    this.resolver.payCosts();
                });

                it('should not execute the handler', function() {
                    expect(this.ability.executeHandler).not.toHaveBeenCalled();
                });
            });
        });

        describe('when an exception occurs', function() {
            beforeEach(function() {
                this.error = new Error('something bad');
                this.ability.resolveCosts.and.callFake(() => {
                    throw this.error;
                });
            });

            it('should not propogate the error', function() {
                expect(() => this.resolver.continue()).not.toThrow();
            });

            it('should return true to complete the resolver pipeline', function() {
                expect(this.resolver.continue()).toBe(true);
            });

            it('should report the error', function() {
                this.resolver.continue();
                expect(this.game.reportError).toHaveBeenCalledWith(jasmine.any(Error));
            });

            xdescribe('when the current ability context is for this ability', function() {
                beforeEach(function() {
                    this.game.currentAbilityContext = { source: 'card', card: this.context.source };
                });

                it('should pop the current context', function() {
                    this.resolver.continue();
                    expect(this.game.popAbilityContext).toHaveBeenCalled();
                });
            });
        });
    });
});
