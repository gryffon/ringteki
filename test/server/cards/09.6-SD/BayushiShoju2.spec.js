describe('Bayushi Shoju 2', function() {
    integration(function() {
        describe('Bayushi Shoju 2\'s triggered ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'draw',
                    player1: {
                        honor: 10,
                        inPlay: ['bayushi-shoju-2']
                    },
                    player2: {
                        honor: 10
                    }
                });

                this.bayushiShoju = this.player1.findCardByName('bayushi-shoju-2');

                // select bid for both players
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
            });

            it('should trigger at the start of the conflict phase', function() {
                let p1Hand = this.player1.hand.length;
                let p2Hand = this.player2.hand.length;

                let p1Honor = this.player1.honor;
                let p2Honor = this.player2.honor;

                this.noMoreActions();
                expect(this.game.currentPhase).toBe('conflict');

                expect(this.player1.honor).toBe(p1Honor - 1);
                expect(this.player2.honor).toBe(p2Honor - 1);
                expect(this.player1.hand.length).toBe(p1Hand + 2);
                expect(this.player2.hand.length).toBe(p2Hand + 2);

                expect(this.getChatLogs(1)).toContain('player1 uses Bayushi Shoju to have each player loses an honor and draw two cards');
            });

            it('should let player 1 win if both are at 1 honor', function() {
                let p1Hand = this.player1.hand.length;
                let p2Hand = this.player2.hand.length;

                this.player1.honor = 1;
                this.player2.honor = 1;

                let p1Honor = this.player1.honor;
                let p2Honor = this.player2.honor;

                this.noMoreActions();
                expect(this.game.currentPhase).toBe('conflict');

                expect(this.player1.honor).toBe(p1Honor - 1);
                expect(this.player2.honor).toBe(p2Honor - 1);
                expect(this.player1.hand.length).toBe(p1Hand + 2);
                expect(this.player2.hand.length).toBe(p2Hand + 2);

                expect(this.getChatLogs(1)).toContain('player1 has won the game');
            });
        });

        describe('Bayushi Shoju 2\'s constant ability (gaining favor)', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['bayushi-shoju-2', 'eager-scout'],
                        hand: ['way-of-the-crab']
                    },
                    player2: {
                        inPlay: ['fawning-diplomat']
                    }
                });

                this.bayushiShoju = this.player1.findCardByName('bayushi-shoju-2');
                this.diplomat = this.player2.findCardByName('fawning-diplomat');
                this.scout = this.player1.findCardByName('eager-scout');
                this.wayOfTheCrab = this.player1.findCardByName('way-of-the-crab');
                this.player1.player.imperialFavor = 'military';
                this.game.checkGameState(true); //lock in the favor
            });

            it('should prevent your opponent from keeping the favor', function() {
                expect(this.player1.player.imperialFavor).toBe('military');
                expect(this.player2.player.imperialFavor).toBe('');

                this.player1.clickCard(this.wayOfTheCrab);
                this.player1.clickCard(this.scout);
                this.player2.clickCard(this.diplomat);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                this.player2.clickCard(this.diplomat);
                this.player2.clickPrompt('Military');
                expect(this.getChatLogs(2)).toContain('player2 claims the Emperor\'s military favor!');
                expect(this.getChatLogs(1)).toContain('The imperial favor is discarded as player2 cannot have it');

                expect(this.player1.player.imperialFavor).toBe('');
                expect(this.player2.player.imperialFavor).toBe('');
            });
        });

        describe('Bayushi Shoju 2\'s constant ability (having favor before buying shoju)', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        dynastyDeck: ['bayushi-shoju-2']
                    },
                    player2: {
                    }
                });

                this.bayushiShoju = this.player1.findCardByName('bayushi-shoju-2');
                this.player1.placeCardInProvince(this.bayushiShoju, 'province 1');
            });

            it('should prevent your opponent from keeping the favor', function() {
                this.player2.player.imperialFavor = 'military';
                this.game.checkGameState(true); //lock in the favor
                expect(this.player1.player.imperialFavor).toBe('');
                expect(this.player2.player.imperialFavor).toBe('military');

                this.player1.clickCard(this.bayushiShoju);
                this.player1.clickPrompt('0');

                expect(this.getChatLogs(1)).toContain('The imperial favor is discarded as player2 cannot have it');

                expect(this.player1.player.imperialFavor).toBe('');
                expect(this.player2.player.imperialFavor).toBe('');
            });

            it('should let you keep the favor', function() {
                this.player1.player.imperialFavor = 'military';
                this.game.checkGameState(true); //lock in the favor
                expect(this.player1.player.imperialFavor).toBe('military');
                expect(this.player2.player.imperialFavor).toBe('');

                this.player1.clickCard(this.bayushiShoju);
                this.player1.clickPrompt('0');

                expect(this.getChatLogs(1)).not.toContain('The imperial favor is discarded as player1 cannot have it');

                expect(this.player1.player.imperialFavor).toBe('military');
                expect(this.player2.player.imperialFavor).toBe('');
            });
        });
    });
});
