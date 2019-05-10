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
        });
    });
});
