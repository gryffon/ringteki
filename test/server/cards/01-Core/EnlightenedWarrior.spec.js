describe('Enlightened Warrior', function() {
    integration(function() {
        describe('Enlightened Warrior\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-whisperer']
                    },
                    player2: {
                        inPlay: ['enlightened-warrior']
                    }
                });

                this.dojiWhisperer = this.player1.findCardByName('doji-whisperer');
                this.enlightenedWarrior = this.player2.findCardByName('enlightened-warrior');

                this.game.rings.water.fate = 1;
            });

            it('should trigger when your opponent selects a ring with fate on it (during conflict declaration)', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.dojiWhisperer],
                    ring: 'water'
                });
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.enlightenedWarrior);
            });

            it('should not trigger when your opponent selects a ring with no fate on it (during conflict declaration)', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.dojiWhisperer],
                    ring: 'fire'
                });
                expect(this.player2).not.toHavePrompt('Triggered Abilities');
                expect(this.player2).toHavePrompt('Choose defenders');
            });

            it('should place 1 fate on Enlightened Warrior', function() {
                let fate = this.enlightenedWarrior.fate;
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.dojiWhisperer],
                    ring: 'water'
                });
                this.player2.clickCard(this.enlightenedWarrior);
                expect(this.enlightenedWarrior.fate).toBe(fate + 1);
            });
        });
    });
});
