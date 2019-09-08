describe('Warden of the Damned', function() {
    integration(function() {
        describe('Warden of the Damned\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['warden-of-the-damned']
                    },
                    player2: {
                        inPlay: ['solemn-scholar']
                    }
                });

                this.wardenOfTheDamned = this.player1.findCardByName('warden-of-the-damned');

                this.solemnScholar = this.player2.findCardByName('solemn-scholar');

                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();
                this.player2.passConflict();
                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();
                this.player2.passConflict();
            });

            it('should trigger at the end of the conflict phase', function() {
                this.wardenOfTheDamned.dishonor();
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Choose a character to sacrifice');
            });

            it('should not trigger if there are no targets', function() {
                this.noMoreActions();
                expect(this.player1).not.toHavePrompt('Choose a character to sacrifice');
                expect(this.player2).not.toHavePrompt('Choose a character to sacrifice');
                expect(this.player1).toHavePrompt('Fate Phase');
            });

            it('should sacrifice the chosen characters', function() {
                this.wardenOfTheDamned.dishonor();
                this.solemnScholar.dishonor();
                this.noMoreActions();
                this.player1.clickCard(this.wardenOfTheDamned);
                this.player2.clickCard(this.solemnScholar);
                expect(this.wardenOfTheDamned.location).toBe('conflict discard pile');
                expect(this.solemnScholar.location).toBe('dynasty discard pile');
            });

            it('should only prompt players with an appropriate target', function() {
                this.wardenOfTheDamned.dishonor();
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Choose a character to sacrifice');
                this.player1.clickCard(this.wardenOfTheDamned);
                expect(this.player2).not.toHavePrompt('Choose a character to sacrifice');
                expect(this.player2).toHavePrompt('Fate Phase');
            });
        });
    });
});
