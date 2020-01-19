describe('Political Sanction', function() {
    integration(function() {
        describe('Politcal Sanction\'', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['isawa-ujina'],
                        hand: ['political-sanction']
                    },
                    player2: {
                        inPlay: ['shiba-tetsu', 'adept-of-the-waves', 'shrine-maiden'],
                        hand: ['against-the-waves', 'ornate-fan']
                    }
                });

                this.ujina = this.player1.findCardByName('isawa-ujina');
                this.adept = this.player2.findCardByName('adept-of-the-waves');
                this.tetsu = this.player2.findCardByName('shiba-tetsu');
                this.maiden = this.player2.findCardByName('shrine-maiden');

                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.ujina],
                    defenders: [this.tetsu, this.adept]
                });
            });

            it('should stop actions if you have more pol skill', function() {
                this.player2.pass();
                this.player1.playAttachment('political-sanction', this.adept);
                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.player2.clickCard(this.adept);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should stop reactions', function() {
                this.player2.pass();
                this.player1.playAttachment('political-sanction', this.tetsu);
                this.player2.clickCard('against-the-waves');
                this.player2.clickCard(this.adept);
                expect(this.player2).not.toBeAbleToSelect(this.tetsu);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not work if you have lower pol skill', function() {
                this.player2.playAttachment('ornate-fan', this.tetsu);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard('political-sanction');
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not be able to be attached to character outside the conflict', function() {
                this.player2.pass();
                this.player1.clickCard('political-sanction');
                expect(this.player1).not.toBeAbleToSelect(this.maiden);
                expect(this.player1).toHavePrompt('Political Sanction');
            });

            it('should still stop actions after the conflict', function() {
                this.player2.pass();
                this.player1.playAttachment('political-sanction', this.adept);
                this.noMoreActions();
                this.player1.clickPrompt('Gain 2 Honor');
                this.player1.pass();
                expect(this.player2).toHavePrompt('Action Window');
                this.player2.clickCard(this.adept);
                expect(this.player2).toHavePrompt('Action Window');
            });
        });
    });
});
