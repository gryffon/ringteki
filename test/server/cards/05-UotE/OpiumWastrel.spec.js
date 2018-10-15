describe('Opium Wastrel', function() {
    integration(function() {
        describe('Opium Wastrel\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 10,
                        hand: ['opium-wastrel'],
                        inPlay: ['bayushi-liar']
                    },
                    player2: {
                        honor: 11,
                        inPlay: ['radiant-orator']
                    }
                });

                this.radiantOrator = this.player2.findCardByName('radiant-orator');
            });

            it('should not be playable when both players have equal honor', function() {
                this.player1.honor = 11;
                this.player1.clickCard('opium-wastrel');
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should not be playable when his player has more honor', function() {
                this.player1.honor = 12;
                this.player1.clickCard('opium-wastrel');
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should not trigger when played outside a conflict', function() {
                this.player1.playCharacterFromHand('opium-wastrel');
                expect(this.player2).toHavePrompt('Action Window');
            });

            it('should reduce the targeted character\'s glory to 0', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: ['bayushi-liar'],
                    defenders: [this.radiantOrator]
                });
                this.player2.pass();
                this.player1.playCharacterFromHand('opium-wastrel');
                this.player1.clickPrompt('Conflict');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.clickCard('opium-wastrel');
                expect(this.player1).toHavePrompt('Opium Wastrel');
                expect(this.player1).toBeAbleToSelect('bayushi-liar');
                expect(this.player1).toBeAbleToSelect('opium-wastrel');
                expect(this.player1).toBeAbleToSelect(this.radiantOrator);
                this.player1.clickCard(this.radiantOrator);
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.radiantOrator.glory).toBe(0);
            });
        });
    });
});
