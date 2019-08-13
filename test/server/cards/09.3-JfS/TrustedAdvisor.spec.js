describe('Trusted Advisor', function() {
    integration(function() {
        describe('Trusted Advisor\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['trusted-advisor'],
                        hand: ['court-games']
                    },
                    player2: {
                        inPlay: ['bayushi-shoju']
                    }
                });

                this.trustedAdvisor = this.player1.findCardByName('trusted-advisor');
                this.bayushiShoju = this.player2.findCardByName('bayushi-shoju');

                this.game.rings.air.fate = 1;
            });

            it('should trigger when you gain fate during a conflict in which Trusted Advisor is participating', function() {
                let handSize = this.player1.hand.length;

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.trustedAdvisor],
                    ring: 'air'
                });
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.trustedAdvisor);

                this.player1.clickCard(this.trustedAdvisor);
                expect(this.player1.hand.length).toBe(handSize + 1);
            });

            it('should not trigger when an opponent gains fate during a conflict in which Trusted Advisor is participating', function() {
                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.bayushiShoju],
                    defenders: [this.trustedAdvisor],
                    ring: 'air'
                });
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).not.toBeAbleToSelect(this.trustedAdvisor);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });
        });
    });
});

