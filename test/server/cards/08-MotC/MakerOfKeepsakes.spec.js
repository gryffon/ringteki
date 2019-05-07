describe('Maker of Keepsakes', function() {
    integration(function() {
        describe('Maker of Keepsake\'s constant ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['maker-of-keepsakes', 'doji-whisperer'],
                        hand: ['way-of-the-crane']
                    },
                    player2: {
                        hand: ['mark-of-shame']
                    }
                });

                this.makerOfKeepsakes = this.player1.findCardByName('maker-of-keepsakes');
                this.dojiWhisperer = this.player1.findCardByName('doji-whisperer');
                this.wayOfTheCrane = this.player1.findCardByName('way-of-the-crane');

                this.markOfShame = this.player2.findCardByName('mark-of-shame');
            });

            it('should prevent it from receiving dishonor status tokens (become dishonored)', function() {
                this.player1.pass();
                this.player2.clickCard(this.markOfShame);
                this.player2.clickCard(this.makerOfKeepsakes);
                expect(this.player2).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.makerOfKeepsakes.isDishonored).toBe(false);
            });

            it('should allow it to go from honored to ordinary (be dishonored), but not become dishonored', function() {
                this.player1.clickCard(this.wayOfTheCrane);
                this.player1.clickCard(this.makerOfKeepsakes);
                expect(this.makerOfKeepsakes.isHonored).toBe(true);
                this.player2.clickCard(this.markOfShame);
                this.player2.clickCard(this.makerOfKeepsakes);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.markOfShame);
                this.player2.clickCard(this.markOfShame);
                expect(this.makerOfKeepsakes.isHonored).toBe(false);
                expect(this.makerOfKeepsakes.isDishonored).toBe(false);
                expect(this.player1).toHavePrompt('Action Window');
            });
        });
    });
});
