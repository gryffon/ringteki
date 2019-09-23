describe('Emissary of lies\'', function() {
    integration(function() {
        describe('Emissary of Lies\' ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['emissary-of-lies'],
                        hand: ['fine-katana']
                    },
                    player2: {
                        inPlay: ['otomo-courtier', 'shiba-tsukune']
                    }
                });

                this.emissary = this.player1.findCardByName('emissary-of-lies');

                this.tsukune = this.player2.findCardByName('shiba-tsukune');
                this.otomo = this.player2.findCardByName('otomo-courtier');

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.emissary],
                    defenders: [this.tsukune]
                });
                this.player2.pass();
            });

            it('should be able to target opponent\'s character in the conflict', function() {
                this.player1.clickCard(this.emissary);
                expect(this.player1).toHavePrompt('Emissary of Lies');
                expect(this.player1).toBeAbleToSelect(this.shibaTsukune);
                expect(this.player1).not.toBeAbleToSelect(this.otomo);
            });
        });
    });
});
