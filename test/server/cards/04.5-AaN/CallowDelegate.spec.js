describe('Callow Delegate', function() {
    integration(function() {
        describe('Callow Delegate\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['bayushi-shoju'],
                        hand: ['assassination']
                    },
                    player2: {
                        inPlay: ['callow-delegate', 'doji-challenger']
                    }
                });
                this.bayushiShoju = this.player1.findCardByName('bayushi-shoju');
                this.assassination = this.player1.findCardByName('assassination');

                this.callowDelegate = this.player2.findCardByName('callow-delegate');
                this.dojiChallenger = this.player2.findCardByName('doji-challenger');
            });

            it('should prompt to honor a character when leaving play', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.bayushiShoju],
                    defenders: [this.callowDelegate]
                });
                this.player2.pass();
                this.player1.clickCard(this.assassination);
                this.player1.clickCard(this.callowDelegate);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.callowDelegate);
                this.player2.clickCard(this.callowDelegate);
                expect(this.player2).toHavePrompt('Callow Delegate');
                expect(this.player2).toBeAbleToSelect(this.callowDelegate);
                expect(this.player2).toBeAbleToSelect(this.dojiChallenger);
                expect(this.player2).not.toBeAbleToSelect(this.bayushiShoju);
                this.player2.clickCard(this.dojiChallenger);
                expect(this.callowDelegate.location).toBe('dynasty discard pile');
                expect(this.dojiChallenger.isHonored).toBe(true);
            });
        });
    });
});
