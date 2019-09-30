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
                        inPlay: ['venerable-historian', 'iuchi-wayfinder']
                    }
                });

                this.ryoma = this.player1.findCardByName('ide-ryoma');
                this.kudaka = this.player1.findCardByName('kudaka');
                this.shono = this.player1.findCardByName('shinjo-shono');

                this.historian = this.player2.findCardByName('venerable-historian');
                this.wayfinder = this.player2.findCardByName('iuchi-wayfinder');

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
                expect(this.player1).toHavePrompt('Choose a unicorn character');
                expect(this.player1).toBeAbleToSelect(this.shono);
                expect(this.player1).toBeAbleToSelect(this.ryoma);
                this.player1.clickCard(this.shono);
                expect(this.player1).toHavePrompt('Choose a non-unicorn character');
                expect(this.player1).toBeAbleToSelect(this.kudaka);
                expect(this.player1).not.toBeAbleToSelect(this.ryoma);
                expect(this.player1).not.toBeAbleToSelect(this.historian);
                expect(this.player1).not.toBeAbleToSelect(this.wayfinder);
                this.player1.clickCard(this.kudaka);
                expect(this.player1).toHavePrompt('Choose a character to bow');
                expect(this.player1).toBeAbleToSelect(this.shono);
                expect(this.player1).not.toBeAbleToSelect(this.kudaka);
            });

            it('should bow the selected character and ready the other', function() {
                this.player2.pass();
                this.player1.clickCard(this.ryoma);
                this.player1.clickCard(this.shono);
                this.player1.clickCard(this.kudaka);
                this.player1.clickCard(this.shono);
                expect(this.kudaka.bowed).toBe(false);
                expect(this.shono.bowed).toBe(true);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should bow one of two readied characters', function() {
                this.player2.pass();
                expect(this.historian.bowed).toBe(false);
                expect(this.wayfinder.bowed).toBe(false);
                this.player1.clickCard(this.ryoma);
                this.player1.clickCard(this.wayfinder);
                this.player1.clickCard(this.historian);
                this.player1.clickCard(this.historian);
                expect(this.historian.bowed).toBe(true);
                expect(this.wayfinder.bowed).toBe(false);
            });

            it('should not be able to target two bow characters', function() {
                this.shono.bowed = true;
                this.player2.pass();
                this.player1.clickCard(this.ryoma);
                this.player1.clickCard(this.shono);
                expect(this.player1).not.toBeAbleToSelect(this.kudaka);
            });
        });
    });
});
