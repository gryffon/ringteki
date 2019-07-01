describe('Aggressive Moto', function() {
    integration(function() {
        describe('Aggressive Moto', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['aggressive-moto']
                    },
                    player2: {
                        inPlay: ['togashi-yokuni']
                    }
                });
                this.aggressiveMoto = this.player1.findCardByName('aggressive-moto');
                this.togashiYokuni = this.player2.findCardByName('togashi-yokuni');
                this.noMoreActions();
            });

            it('should not be able to be declared as a defender', function() {
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.togashiYokuni]
                });
                expect(this.player1).toHavePrompt('Choose defenders');
                this.player1.clickCard(this.aggressiveMoto);
                expect(this.game.currentConflict.defenders).not.toContain(this.aggressiveMoto);
            });

            it('should be able to be declared as an attacker', function() {
                expect(this.player1).toHavePrompt('Initiate Conflict');
                this.player1.clickCard(this.aggressiveMoto);
                expect(this.game.currentConflict.attackers).toContain(this.aggressiveMoto);
            });
        });
    });
});
