describe('Pacifist Philosopher', function() {
    integration(function() {
        describe('Pacifist Philosopher\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['pacifist-philosopher']
                    },
                    player2: {
                        inPlay: []
                    }
                });

                this.pacifistPhilosopher = this.player1.findCardByName('pacifist-philosopher');

            });

            it('should trigger when a player passes a conflict declaration', function() {
                this.noMoreActions();
                this.player1.clickPrompt('Pass Conflict');
                this.player1.clickPrompt('Yes');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.pacifistPhilosopher);
            });

            it('if triggered, should gain you 1 fate', function() {
                let fate = this.player1.player.fate;
                this.noMoreActions();
                this.player1.clickPrompt('Pass Conflict');
                this.player1.clickPrompt('Yes');
                this.player1.clickCard(this.pacifistPhilosopher);
                expect(this.player1.player.fate).toBe(fate + 1);
            });

            it('should be able to be triggered a maximum of 2 times per round', function() {
                this.noMoreActions();
                this.player1.clickPrompt('Pass Conflict');
                this.player1.clickPrompt('Yes');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.pacifistPhilosopher);
                this.player1.clickCard(this.pacifistPhilosopher);
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.pacifistPhilosopher);
                this.player1.clickCard(this.pacifistPhilosopher);
                this.noMoreActions();
                this.player1.clickPrompt('Pass Conflict');
                this.player1.clickPrompt('Yes');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).not.toBeAbleToSelect(this.pacifistPhilosopher);
            });
        });
    });
});
