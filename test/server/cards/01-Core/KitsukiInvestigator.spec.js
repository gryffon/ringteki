describe('Togashi Yokuni', function() {
    integration(function() {
        describe('Togashi Yokuni and max abilities', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['kitsuki-investigator']
                    },
                    player2: {
                        hand: ['banzai', 'banzai', 'banzai', 'assassination', 'fine-katana'],
                        dynastyDiscard: ['chukan-nobue']
                    }
                });
                this.kitsukiInvestigator = this.player1.findCardByName('kitsuki-investigator');
                this.katana = this.player2.findCardByName('fine-katana');
                this.nobue = this.player2.findCardByName('chukan-nobue');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.kitsukiInvestigator],
                    defenders: []
                });
            });

            it('should pay a fate to a ring to discard a card', function() {
                this.player2.pass();
                this.player1.clickCard(this.kitsukiInvestigator);
                this.player1.clickRing('fire');
                expect(this.player1).toHavePromptButton('Banzai! (3)');
                expect(this.player1).toHavePromptButton('Assassination');
                expect(this.player1).toHavePromptButton('Fine Katana');
                this.player1.clickPrompt('Fine Katana');
                expect(this.katana.location).toBe('conflict discard pile');
                expect(this.game.rings.fire.fate).toBe(1);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should work with nobue', function() {
                this.player2.moveCard(this.nobue, 'play area');
                this.player2.pass();
                this.player1.clickCard(this.kitsukiInvestigator);
                this.player1.clickRing('fire');
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.game.rings.fire.fate).toBe(1);
                expect(this.getChatLogs(3)).toContain('Kitsuki Investigator sees Assassination, Banzai!, Banzai!, Banzai! and Fine Katana');
            });
        });
    });
});
