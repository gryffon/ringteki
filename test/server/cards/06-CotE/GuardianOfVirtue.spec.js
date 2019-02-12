describe('Guardian Of Virtue', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['mirumoto-raitsugu']
                },
                player2: {
                    inPlay: ['guardian-of-virtue']
                }
            });

            this.guardian = this.player2.findCardByName('guardian-of-virtue');

            this.mirumotoRaitsugu = this.player1.findCardByName('mirumoto-raitsugu');

            this.player1.player.showBid = 1;
            this.player2.player.showBid = 3;

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.mirumotoRaitsugu],
                defenders: [this.guardian]
            });
        });

        it('should bow as a result of conflict resolution if player doesn\'t have composure', function() {
            this.player2.pass();
            expect(this.player2.player.hasComposure()).toBe(false);
            this.player1.pass();
            this.player1.clickPrompt('Don\'t resolve');
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.guardian.bowed).toBe(true);
        });

        it('should not bow as a result of conflict resolution if player has composure', function() {
            this.player2.pass();
            this.player1.player.showBid = 3;
            this.player2.player.showBid = 1;
            expect(this.player2.player.hasComposure()).toBe(true);
            this.player1.pass();
            this.player1.clickPrompt('Don\'t resolve');
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.guardian.bowed).toBe(false);
        });

        it('should bow as a result of conflict resolution if player looses composure during the conflict', function() {
            this.player2.pass();
            this.player1.player.showBid = 3;
            this.player2.player.showBid = 1;
            expect(this.player2.player.hasComposure()).toBe(true);
            this.player1.clickCard(this.mirumotoRaitsugu);
            this.player1.clickCard(this.guardian);
            this.player1.clickPrompt('1');
            this.player2.clickPrompt('3');
            expect(this.player2.player.hasComposure()).toBe(false);
            expect(this.mirumotoRaitsugu.location).toBe('dynasty discard pile');
            this.player2.pass();
            this.player1.pass();
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.guardian.bowed).toBe(true);
        });

        it('should bow if attacking with composure', function() {
            this.player2.pass();
            this.player1.player.showBid = 3;
            this.player2.player.showBid = 1;
            expect(this.player2.player.hasComposure()).toBe(true);
            this.player1.pass();
            this.player1.clickPrompt('Don\'t resolve');
            expect(this.guardian.bowed).toBe(false);
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.guardian],
                ring: 'fire',
                defenders: []
            });
            this.player1.pass();
            this.player2.pass();
            this.player2.clickPrompt('Don\'t resolve');
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.guardian.bowed).toBe(true);
        });
    });
});
