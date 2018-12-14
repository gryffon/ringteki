const CardAbility = require('../../../server/game/CardAbility');
const GameChat = require('../../../server/game/gamechat');
const AbilityDsl = require('../../../server/game/abilitydsl');

describe('CardAbility displayMessage', function() {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['addMessage', 'on']);
        this.gameSpy.gameChat = new GameChat();
        this.player = {
            name: 'Player 1'
        };
        this.cardSpy = jasmine.createSpyObj('card', ['getType']);
        this.cardSpy.type = 'event';
    });

    describe('Assassinaton', function() {
        beforeEach(function() {
            this.ability = new CardAbility(this.gameSpy, this.cardSpy, {
                cost: AbilityDsl.costs.payHonor(3),
                target: {
                    cardType: 'character',
                    cardCondition: card => card.getCost() <= 2,
                    gameAction: AbilityDsl.actions.discardFromPlay()
                }
            });
            this.actionSpy = spyOn(this.ability.targets[0].properties.gameAction[0], 'canAffect');
            this.actionSpy.and.returnValue('true');
            this.target = { name: 'target' };
            this.ability.displayMessage({
                game: this.gameSpy,
                player: this.player,
                source: this.cardSpy,
                costs: {
                    loseHonor: this.player
                },
                targets: {
                    target: this.target
                },
                target: this.target
            });
            this.args = this.gameSpy.addMessage.calls.allArgs()[0];
        });

        it('should send a 6 part message', function() {
            expect(this.args[0]).toBe('{0}{1}{2}{3}{4}{5}{6}');
        });

        it('should have the player object as the first arg', function() {
            expect(this.args[1]).toBe(this.player);
        });

        it('should have \'plays\' as the second arg', function() {
            expect(this.args[2]).toBe(' plays ');
        });

        it('should have the source as the third arg', function() {
            expect(this.args[3]).toBe(this.cardSpy);
        });

        it('should have a comma as the fourth arg', function() {
            expect(this.args[4]).toBe(', ');
        });

        it('should have a cost term as the fifth arg', function() {
            expect(this.args[5][0].message[0]).toBe('losing');
            expect(this.args[5][0].message[1]).toBe(' ');
            expect(this.args[5][0].message[2]).toBe('3');
            expect(this.args[5][0].message[3]).toBe(' ');
            expect(this.args[5][0].message[4]).toBe('honor');
        });

        it('should have \'to\' as the sixth arg', function() {
            expect(this.args[6]).toBe(' to ');
        });

        it('should have an effect term as the seventh arg', function() {
            expect(this.args[7].message[0]).toBe('discard');
            expect(this.args[7].message[1]).toBe(' ');
            expect(this.args[7].message[2]).toBe(this.target);
        });
    });

    describe('Forged Edict', function() {
        beforeEach(function() {
            this.courtier = { name: 'courtier' };
            this.eventToCancel = { name: 'eventToCancel' };
            this.ability = new CardAbility(this.gameSpy, this.cardSpy, {
                cost: AbilityDsl.costs.dishonor(card => card.hasTrait('courtier')),
                effect: 'cancel {1}',
                effectArgs: context => context.event.card,
                handler: context => context.cancel()
            });
            this.ability.displayMessage({
                game: this.gameSpy,
                player: this.player,
                source: this.cardSpy,
                costs: {
                    dishonor: this.courtier
                },
                event: {
                    card: this.eventToCancel
                }
            });
            this.args = this.gameSpy.addMessage.calls.allArgs()[0];
        });

        it('should send a 6 part message', function() {
            expect(this.args[0]).toBe('{0}{1}{2}{3}{4}{5}{6}');
        });

        it('should have the player object as the first arg', function() {
            expect(this.args[1]).toBe(this.player);
        });

        it('should have \'plays\' as the second arg', function() {
            expect(this.args[2]).toBe(' plays ');
        });

        it('should have the source as the third arg', function() {
            expect(this.args[3]).toBe(this.cardSpy);
        });

        it('should have a comma as the fourth arg', function() {
            expect(this.args[4]).toBe(', ');
        });

        it('should have a cost term as the fifth arg', function() {
            expect(this.args[5][0].message[0]).toBe('dishonoring');
            expect(this.args[5][0].message[1]).toBe(' ');
            expect(this.args[5][0].message[2]).toBe(this.courtier);
        });

        it('should have \'to\' as the sixth arg', function() {
            expect(this.args[6]).toBe(' to ');
        });

        it('should have an effect term as the seventh arg', function() {
            expect(this.args[7].message[0]).toBe('cancel');
            expect(this.args[7].message[1]).toBe(' ');
            expect(this.args[7].message[2]).toBe(this.eventToCancel);
        });
    });

    describe('City of the Open Hand', function() {
        beforeEach(function() {
            class Player {
                constructor(name) {
                    this.name = name;
                    this.type = 'player';
                }

                checkRestrictions() {
                    return true;
                }
            }
            this.opponent = new Player('Player 2');
            this.opponent.opponent = this.player;
            this.player.opponent = this.opponent;
            this.cardSpy.type = 'stronghold';
            this.ability = new CardAbility(this.gameSpy, this.cardSpy, {
                cost: AbilityDsl.costs.bowSelf(),
                gameAction: AbilityDsl.actions.takeHonor()
            });
            this.ability.displayMessage({
                game: this.gameSpy,
                player: this.player,
                source: this.cardSpy,
                costs: {
                    bow: this.cardSpy
                }
            });
            this.args = this.gameSpy.addMessage.calls.allArgs()[0];
        });

        it('should send a 6 part message', function() {
            expect(this.args[0]).toBe('{0}{1}{2}{3}{4}{5}{6}');
        });

        it('should have the player object as the first arg', function() {
            expect(this.args[1]).toBe(this.player);
        });

        it('should have \'uses\' as the second arg', function() {
            expect(this.args[2]).toBe(' uses ');
        });

        it('should have the source as the third arg', function() {
            expect(this.args[3]).toBe(this.cardSpy);
        });

        it('should have a comma as the fourth arg', function() {
            expect(this.args[4]).toBe(', ');
        });

        it('should have a cost term as the fifth arg', function() {
            expect(this.args[5][0].message[0]).toBe('bowing');
            expect(this.args[5][0].message[1]).toBe(' ');
            expect(this.args[5][0].message[2]).toBe(this.cardSpy);
        });

        it('should have \'to\' as the sixth arg', function() {
            expect(this.args[6]).toBe(' to ');
        });

        it('should have an effect term as the seventh arg', function() {
            expect(this.args[7].message[0]).toBe('take');
            expect(this.args[7].message[1]).toBe(' ');
            expect(this.args[7].message[2]).toBe('1');
            expect(this.args[7].message[3]).toBe(' ');
            expect(this.args[7].message[4]).toBe('honor');
            expect(this.args[7].message[5]).toBe(' ');
            expect(this.args[7].message[6]).toBe('from');
            expect(this.args[7].message[7]).toBe(' ');
            expect(this.args[7].message[8]).toBe(this.opponent);
        });
    });

});
