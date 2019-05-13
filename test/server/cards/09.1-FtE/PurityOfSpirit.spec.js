describe('Purity of Spirit', function() {
    integration(function() {
        describe('Puritiy of spirit\'s effect', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shiba-tsukune'],
                        hand: ['purity-of-spirit']
                    },
                    player2: {
                        hand: ['court-games']
                    }
                });
                this.tsukune = this.player1.findCardByName('shiba-tsukune');
                this.purity = this.player1.findCardByName('purity-of-spirit');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.tsukune],
                    defenders: []
                });
            });

            it('it should honor tsukune if she is ordinary', function() {
                this.player2.pass();
                this.player1.clickCard(this.purity);
                expect(this.player1).toBeAbleToSelect(this.tsukune);
                expect(this.player1).toHavePrompt('Purity Of Spirit');
                this.player1.clickCard(this.tsukune);
                expect(this.tsukune.isHonored).toBe(true);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should remove the honor token after the conflict', function() {
                this.player2.pass();
                this.player1.clickCard(this.purity);
                this.player1.clickCard(this.tsukune);
                this.noMoreActions();
                this.player1.clickPrompt('Yes');
                this.player1.clickPrompt('Gain 2 Honor');
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.tsukune.isHonored).toBe(false);
            });

            it('check that the correct message is been display for discarding the status token', function() {
                this.player2.pass();
                this.player1.clickCard(this.purity);
                this.player1.clickCard(this.tsukune);
                this.noMoreActions();
                this.player1.clickPrompt('Yes');
                this.player1.clickPrompt('Gain 2 Honor');
                expect(this.getChatLogs(5)).toContain('the status token has been removed from Shiba Tsukune due to the delayed effect of Purity of Spirit')
            });

            it('should discard a dishonor token at the end of the conflict if the character is dishonored during the conflict', function() {
                this.tsukune.dishonor();
                this.player2.pass();
                this.player1.clickCard(this.purity);
                this.player1.clickCard(this.tsukune);
                this.player2.clickCard('court-games');
                this.player2.clickPrompt('Dishonor an opposing character');
                this.player1.clickCard(this.tsukune);
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.tsukune.isDishonored).toBe(false);
            });
        });
    });
});
