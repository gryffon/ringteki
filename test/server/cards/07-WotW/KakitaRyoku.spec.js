describe('Kakita Ryoku', function() {
    integration(function() {
        describe('Kakita Ryoku\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'fate',
                    player1: {
                        inPlay: ['kakita-ryoku']
                    },
                    player2: {
                        inPlay: ['moto-youth']
                    }
                });
                this.player1.player.imperialFavor = 'political';

                this.kakitaRyoku = this.player1.findCardByName('kakita-ryoku');
                this.kakitaRyoku.fate = 1;
                this.motoYouth = this.player2.findCardByName('moto-youth');
            });

            it('should trigger at the start of any phase', function() {
                this.noMoreActions(); // fate phase
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');
                this.player2.clickPrompt('End Round');
                this.player1.clickPrompt('End Round');

                this.noMoreActions(); // dynasty phase
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.kakitaRyoku);
                this.player1.clickPrompt('Pass');

                this.noMoreActions();// draw phase
                expect(this.game.currentPhase).toBe('draw');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.kakitaRyoku);
                this.player1.clickPrompt('Pass');

                this.nextPhase(); // conflict phase
                expect(this.game.currentPhase).toBe('conflict');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.kakitaRyoku);
                this.player1.clickPrompt('Pass');

                this.nextPhase(); // fate phase
                expect(this.game.currentPhase).toBe('fate');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.kakitaRyoku);
                this.player1.clickPrompt('Pass');
                this.player2.clickPrompt('Done');
                this.noMoreActions();
                this.player2.clickPrompt('Done');
                this.player1.clickPrompt('Done');
                this.player1.clickPrompt('End Round');
                this.player2.clickPrompt('End Round');

                //Dynasty phase
                expect(this.game.currentPhase).toBe('dynasty');
                expect(this.kakitaRyoku.location).toBe('play area');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.kakitaRyoku);
            });

            it('should not trigger if you do not have favor', function() {
                this.player1.player.imperialFavor = '';
                expect(this.player1.player.imperialFavor).toBe('');
                this.noMoreActions(); // regroup phase
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');
                this.player2.clickPrompt('End Round');
                this.player1.clickPrompt('End Round');
                this.noMoreActions(); // dynasty phase
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
            });

            it('should honor chosen character', function() {
                this.noMoreActions(); // regroup phase
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');
                this.player2.clickPrompt('End Round');
                this.player1.clickPrompt('End Round');
                this.noMoreActions(); // dynasty phase
                expect(this.player1).toBeAbleToSelect(this.kakitaRyoku);
                this.player1.clickCard(this.kakitaRyoku);
                expect(this.player1).toBeAbleToSelect(this.kakitaRyoku);
                expect(this.player1).toBeAbleToSelect(this.motoYouth);
                this.player1.clickCard(this.motoYouth);
                expect(this.motoYouth.isHonored).toBe(true);
            });
        });
    });
});

