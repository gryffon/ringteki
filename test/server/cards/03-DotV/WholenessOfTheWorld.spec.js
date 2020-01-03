describe('Wholeness of the World', function() {
    integration(function() {
        describe('Wholeness of the World\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'fate',
                    player1: {
                        hand: ['wholeness-of-the-world', 'wholeness-of-the-world']
                    }
                });
                let wholenessOfTheWorlds = this.player1.filterCardsByName('wholeness-of-the-world');
                this.wholenessOfTheWorld = wholenessOfTheWorlds[0];
                this.wholenessOfTheWorld2 = wholenessOfTheWorlds[1];
            });

            it('should trigger when rings are about to be returned', function() {
                this.player1.claimRing('air');
                this.noMoreActions();
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.wholenessOfTheWorld);
            });

            it('should prompt to select a ring', function() {
                this.player1.claimRing('air');
                this.player1.claimRing('fire');
                this.noMoreActions();
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');
                this.player1.clickCard(this.wholenessOfTheWorld);
                expect(this.player1).toHavePromptButton('returning the air ring');
                expect(this.player1).toHavePromptButton('returning the fire ring');
            });

            it('if you have no rings, should not prompt when rings are about to be returned', function() {
                this.noMoreActions();
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).not.toBeAbleToSelect(this.wholenessOfTheWorld);
                expect(this.player1).toHavePrompt('Waiting for opponent to end the round');
            });

            it('should leave the chosen ring claimed', function() {
                this.player1.claimRing('air');
                this.player1.claimRing('fire');
                this.noMoreActions();
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');
                this.player1.clickCard(this.wholenessOfTheWorld);
                this.player1.clickPrompt('returning the fire ring');
                expect(this.player1.claimedRings.includes('air')).toBe(false);
                expect(this.player1.claimedRings.includes('fire')).toBe(true);
            });

            it('should be max 1 per round', function() {
                this.player1.claimRing('air');
                this.player1.claimRing('fire');
                this.noMoreActions();
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');
                this.player1.clickCard(this.wholenessOfTheWorld);
                this.player1.clickPrompt('returning the fire ring');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).not.toBeAbleToSelect(this.wholenessOfTheWorld2);
            });
        });
    });
});
