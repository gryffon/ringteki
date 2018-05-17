const CardAction = require('../../../server/game/cardaction.js');

describe('CardAction', function () {
    beforeEach(function () {
        this.gameSpy = jasmine.createSpyObj('game', ['on', 'removeListener', 'raiseEvent', 'queueSimpleStep']);
        this.gameSpy.currentPhase = 'dynasty';

        this.cardSpy = jasmine.createSpyObj('card', ['getType', 'isBlank', 'canTriggerAbilities']);
        this.cardSpy.canTriggerAbilities.and.returnValue(true);
        this.cardSpy.handler = function() {};
        this.cardSpy.abilities = { actions: [] };
        spyOn(this.cardSpy, 'handler').and.returnValue(true);

        this.limitSpy = jasmine.createSpyObj('limit', ['increment', 'isAtMax', 'registerEvents', 'unregisterEvents']);

        this.gameSpy.raiseEvent.and.callFake((name, params, handler) => {
            if(handler) {
                handler(params);
            }
        });

        this.properties = {
            title: 'Do the thing',
            handler: this.cardSpy.handler
        };
    });

    describe('constructor', function() {
        describe('handler', function() {
            beforeEach(function() {
                this.context = {
                    player: 'player',
                    arg: 'arg',
                    foo: 'bar'
                };
            });

            // method is deprecated
            xdescribe('when passed a method reference', function() {
                beforeEach(function() {
                    this.properties = {
                        title: 'Do the thing',
                        method: 'handler'
                    };
                    this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
                });

                it('should use the specified method on the card object', function() {
                    this.action.handler(this.context);
                    expect(this.cardSpy.handler).toHaveBeenCalledWith('player', 'arg', this.context);
                });
            });

            describe('when passed a handler directly', function() {
                beforeEach(function() {
                    this.properties = {
                        title: 'Do the thing',
                        handler: jasmine.createSpy('handler')
                    };
                    this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
                });

                it('should use the handler directly', function() {
                    this.action.handler(this.context);
                    expect(this.properties.handler).toHaveBeenCalledWith(this.context);
                });
            });
        });

        describe('location', function() {
            it('should use the location sent via properties', function() {
                this.properties.location = ['foo'];
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
                expect(this.action.location).toContain('foo');
            });
        });

        describe('cost', function() {
            describe('when the card type is event', function() {
                beforeEach(function() {
                    this.cardSpy.getType.and.returnValue('event');
                    this.properties.cost = ['foo'];
                    this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
                });

                it('should add the play event cost', function() {
                    expect(this.action.cost.length).toBe(4);
                });
            });
        });

        describe('when there is no limit', function() {
            beforeEach(function() {
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
            });

            it('should not register an event', function() {
                expect(this.limitSpy.registerEvents).not.toHaveBeenCalled();
            });
        });

        describe('when there is a limit', function() {
            beforeEach(function() {
                this.properties.limit = this.limitSpy;
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
            });

            it('should register events for the limit', function() {
                expect(this.limitSpy.registerEvents).toHaveBeenCalledWith(this.gameSpy);
            });
        });
    });

    // execute() is deprecated
    xdescribe('execute()', function() {
        beforeEach(function() {
            this.player = {canInitiateAction: true};
            this.cardSpy.controller = this.player;
            this.cardSpy.location = 'play area';
        });

        describe('when the action has limited uses', function() {
            beforeEach(function() {
                this.properties.limit = this.limitSpy;
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
            });

            describe('and the use count has reached the limit', function() {
                beforeEach(function() {
                    this.limitSpy.isAtMax.and.returnValue(true);

                    this.action.execute(this.player, 'arg');
                });

                it('should not queue the ability resolver', function() {
                    expect(this.gameSpy.resolveAbilityForContext).not.toHaveBeenCalled();
                });
            });

            describe('and the use count is below the limit', function() {
                beforeEach(function() {
                    this.action.execute(this.player, 'arg');
                });

                it('should queue the ability resolver', function() {
                    expect(this.gameSpy.resolveAbilityForContext).toHaveBeenCalled();
                });
            });
        });

        describe('when executed with a player other than the card controller', function() {
            beforeEach(function() {
                this.otherPlayer = {canInitiateAction: true};
            });

            describe('and the anyPlayer property is not set', function() {
                beforeEach(function() {
                    this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
                    this.action.execute(this.otherPlayer, 'arg');
                });

                it('should not queue the ability resolver', function() {
                    expect(this.gameSpy.resolveAbilityForContext).not.toHaveBeenCalled();
                });
            });

            describe('and the anyPlayer property is set', function() {
                beforeEach(function() {
                    this.properties.anyPlayer = true;
                    this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
                    this.action.execute(this.otherPlayer, 'arg');
                });

                it('should queue the ability resolver', function() {
                    expect(this.gameSpy.resolveAbilityForContext).toHaveBeenCalled();
                });
            });
        });

        describe('when the card is not in a location for the action', function() {
            beforeEach(function() {
                this.cardSpy.location = 'hand';
                this.cardSpy.canTriggerAbilities.and.returnValue(false);
                this.properties.location = ['play area'];
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
                this.action.execute(this.player, 'arg');
            });

            it('should not queue the ability resolver', function() {
                expect(this.gameSpy.resolveAbilityForContext).not.toHaveBeenCalled();
            });
        });

        describe('when the card is blank', function() {
            beforeEach(function() {
                this.cardSpy.isBlank.and.returnValue(true);
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
                this.action.execute(this.player, 'arg');
            });

            it('should not queue the ability resolver', function() {
                expect(this.gameSpy.resolveAbilityForContext).not.toHaveBeenCalled();
            });
        });

        describe('when only allowed in a certain phase', function() {
            beforeEach(function() {
                this.properties.phase = 'challenge';
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
            });

            describe('and it is not that phase', function() {
                beforeEach(function() {
                    this.gameSpy.currentPhase = 'dominance';
                    this.action.execute(this.player, 'arg');
                });

                it('should not queue the ability resolver', function() {
                    expect(this.gameSpy.resolveAbilityForContext).not.toHaveBeenCalled();
                });
            });

            describe('and it is the phase', function() {
                beforeEach(function() {
                    this.gameSpy.currentPhase = 'challenge';
                    this.action.execute(this.player, 'arg');
                });

                it('should queue the ability resolver', function() {
                    expect(this.gameSpy.resolveAbilityForContext).toHaveBeenCalled();
                });
            });
        });

        // this is unecessary as there are no action windows in setup
        xdescribe('when the current phase is setup', function() {
            beforeEach(function() {
                this.gameSpy.currentPhase = 'setup';
                this.properties.phase = 'any';
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
                this.action.execute(this.player, 'arg');
            });

            it('should not queue the ability resolver', function() {
                expect(this.gameSpy.resolveAbilityForContext).not.toHaveBeenCalled();
            });
        });

        describe('when a condition is provided', function() {
            beforeEach(function() {
                this.condition = jasmine.createSpy('condition');
                this.properties.condition = this.condition;
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
            });

            describe('and the condition returns true', function() {
                beforeEach(function() {
                    this.condition.and.returnValue(true);
                    this.action.execute(this.player, 'arg');
                });

                it('should queue the ability resolver', function() {
                    expect(this.gameSpy.resolveAbilityForContext).toHaveBeenCalled();
                });
            });

            describe('and the condition returns false', function() {
                beforeEach(function() {
                    this.condition.and.returnValue(false);
                    this.action.execute(this.player, 'arg');
                });

                it('should not queue the ability resolver', function() {
                    expect(this.gameSpy.resolveAbilityForContext).not.toHaveBeenCalled();
                });
            });
        });

        describe('when all conditions met', function() {
            beforeEach(function() {
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
                this.action.execute(this.player, 'arg');
            });

            it('should queue the ability resolver', function() {
                expect(this.gameSpy.resolveAbilityForContext).toHaveBeenCalled();
            });
        });
    });

    // clickToActivate is deprecated
    xdescribe('deactivate()', function() {
        beforeEach(function() {
            this.player = { player: 1 };
            this.cardSpy.controller = this.player;
            this.cardSpy.location = 'play area';
            this.costSpy = jasmine.createSpyObj('cost', ['canUnpay', 'unpay']);
            this.costSpy.canUnpay.and.returnValue(true);
            this.properties.cost = this.costSpy;
            this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
            this.bottomContext = { context: 'bottom', player: this.player };
            this.topContext = { context: 'top', player: this.player };
            this.action.activationContexts.push(this.bottomContext);
            this.action.activationContexts.push(this.topContext);
        });

        describe('when everything is normal', function() {
            beforeEach(function() {
                this.result = this.action.deactivate(this.player);
            });

            it('should unpay costs', function() {
                expect(this.costSpy.unpay).toHaveBeenCalledWith(this.topContext);
            });

            it('should deactivate the top context', function() {
                expect(this.bottomContext.abilityDeactivated).toBeFalsy();
                expect(this.topContext.abilityDeactivated).toBe(true);
            });

            it('should return true', function() {
                expect(this.result).toBe(true);
            });
        });

        describe('when there are no previous activation contexts', function() {
            beforeEach(function() {
                this.action.activationContexts = [];
                this.result = this.action.deactivate(this.player);
            });

            it('should not unpay costs', function() {
                expect(this.costSpy.unpay).not.toHaveBeenCalled();
            });

            it('should not deactivate the top context', function() {
                expect(this.topContext.abilityDeactivated).toBeFalsy();
            });

            it('should return false', function() {
                expect(this.result).toBe(false);
            });
        });

        describe('when the cost cannot be unpaid', function() {
            beforeEach(function() {
                this.costSpy.canUnpay.and.returnValue(false);
                this.result = this.action.deactivate(this.player);
            });

            it('should not unpay costs', function() {
                expect(this.costSpy.unpay).not.toHaveBeenCalled();
            });

            it('should not deactivate the top context', function() {
                expect(this.topContext.abilityDeactivated).toBeFalsy();
            });

            it('should return false', function() {
                expect(this.result).toBe(false);
            });
        });

        describe('when the player does not control the source card', function() {
            beforeEach(function() {
                this.result = this.action.deactivate({ player: 2 });
            });

            it('should not unpay costs', function() {
                expect(this.costSpy.unpay).not.toHaveBeenCalled();
            });

            it('should not deactivate the top context', function() {
                expect(this.topContext.abilityDeactivated).toBeFalsy();
            });

            it('should return false', function() {
                expect(this.result).toBe(false);
            });
        });
    });

    describe('executeHandler()', function() {
        beforeEach(function() {
            this.player = { player: true };
            this.context = {
                game: this.gameSpy,
                player: this.player,
                source: this.cardSpy,
                arg: 'arg'
            };
            this.handler = jasmine.createSpy('handler');
            this.properties.handler = this.handler;
        });

        describe('when the action has no limit', function() {
            beforeEach(function() {
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
                this.action.executeHandler(this.context);
            });

            it('should call the handler', function() {
                expect(this.handler).toHaveBeenCalledWith(this.context);
            });
        });

        describe('when the action has limited uses', function() {
            beforeEach(function() {
                this.properties.limit = this.limitSpy;
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
            });

            describe('and the handler returns false', function() {
                beforeEach(function() {
                    this.handler.and.returnValue(false);

                    this.action.executeHandler(this.context);
                });

                it('should call the handler', function() {
                    expect(this.handler).toHaveBeenCalledWith(this.context);
                });

                it('should not count towards the limit', function() {
                    expect(this.limitSpy.increment).not.toHaveBeenCalled();
                });
            });

            describe('and the handler returns undefined or a non-false value', function() {
                beforeEach(function() {
                    this.handler.and.returnValue(undefined);

                    this.action.executeHandler(this.context);
                });

                it('should call the handler', function() {
                    expect(this.handler).toHaveBeenCalledWith(this.context);
                });
            });
        });
    });
});
