describe('Ide Ryoma', function() {
    integration(function() {
        describe('Ide Ryoma\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['ide-ryoma', 'kudaka','shinjo-shono']
                    },
                    player2: {
                        inPlay: ['venerable-historian']
                    }
                });

                this.ryoma = this.player1.findCardByName('ide-ryoma');
                this.kudaka = this.player1.findCardByName('kudaka');
                this.shono = this.player1.findCardByName('shinjo-shono');

                this.historian = this.player2.findCardByName('venerable-historian');

                this.kudaka.bowed = true;

                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.ryoma],
                    defenders: [this.historian]
                });
            });

            it('should correctly target characters', function() {
                this.player2.pass();
                this.player1.clickCard(this.ryoma);
                expect(this.player1).toHavePrompt('choose one character to bow and one to ready');
                expect(this.player1).not.toBeAbleToSelect(this.kudaka);
                expect(this.player1).not.toBeAbleToSelect(this.historian);
                expect(this.player1).toBeAbleToSelect(this.shono);
                expect(this.player1).toBeAbleToSelect(this.ryoma);
            });

            it('should bow the selected character and ready the other', function() {
                this.player2.pass();
                this.player1.clickCard(this.ryoma);
                this.player1.clickCard(this.kudaka);
                this.player1.clickCard(this.shono);
                expect(this.kudaka.bowed).toBe(false);
                expect(this.shono.bowed).toBe(true);
            });
        });
    });
});
