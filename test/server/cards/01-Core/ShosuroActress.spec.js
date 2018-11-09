describe('Shosuro Actress', function() {
    integration(function() {
        describe('Shosuro Actress\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shosuro-actress']
                    },
                    player2: {
                        hand: ['steward-of-law', 'for-shame', 'for-shame', 'banzai'],
                        dynastyDiscard: ['doji-shigeru']
                    }
                });
                this.shosuroActress = this.player1.findCardByName('shosuro-actress');
                this.dojiShigeru = this.player2.findCardByName('doji-shigeru');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.shosuroActress],
                    defenders: []
                });
                this.player2.playCharacterFromHand('steward-of-law');
                this.player2.clickPrompt('Conflict');
                this.player1.pass();
                this.player2.clickCard('for-shame');
                this.player2.clickCard(this.shosuroActress);
            });

            it('should allow use of triggered abilities by the new character', function() {
                expect(this.shosuroActress.bowed).toBe(true);
                this.player1.clickCard(this.shosuroActress);
                expect(this.player1).toHavePrompt('Shosuro Actress');
                expect(this.player1).toBeAbleToSelect(this.dojiShigeru);
                this.player1.clickCard(this.dojiShigeru);
                expect(this.dojiShigeru.location).toBe('play area');
                expect(this.dojiShigeru.controller).toBe(this.player1.player);
                this.player2.clickCard('for-shame', 'hand');
                expect(this.player2).toHavePrompt('For Shame!');
                this.player2.clickCard(this.dojiShigeru);
                expect(this.player1).toHavePrompt('Triggered Abilities');
            });
        });
    });
});
