describe('Ignoble Enforcers', function() {
    integration(function() {
        describe('Ignoble Enforcers\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        honor: 10,
                        dynastyDiscard: ['ignoble-enforcers']
                    },
                    player2: {
                        inPlay: []
                    }
                });
                this.ignobleEnforcers = this.player1.placeCardInProvince('ignoble-enforcers');
            });

            it('should trigger when Ignoble Enforcers is played', function() {
                this.player1.clickCard(this.ignobleEnforcers);
                this.player1.clickPrompt('1');
                expect(this.ignobleEnforcers.location).toBe('play area');
                expect(this.ignobleEnforcers.fate).toBe(1);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.ignobleEnforcers);
                this.player1.clickCard(this.ignobleEnforcers);
                expect(this.player1).toHavePrompt('Ignoble Enforcers');
                expect(this.player1).not.toHavePromptButton('0');
                expect(this.player1).toHavePromptButton('1');
                expect(this.player1).toHavePromptButton('2');
                expect(this.player1).toHavePromptButton('3');
                expect(this.player1).toHavePromptButton('Cancel');
                this.player1.clickPrompt('Cancel');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.ignobleEnforcers);
                this.player1.clickCard(this.ignobleEnforcers);
                this.player1.clickPrompt('2');
                expect(this.player1.honor).toBe(8);
                expect(this.ignobleEnforcers.fate).toBe(3);
            });
        });
    });
});
