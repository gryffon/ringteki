describe('Winter Court Hosts', function() {
    integration(function() {
        describe('Winter Court Hosts\' ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['winter-court-hosts'],
                        hand: [],
                        conflictDeck: ['for-shame', 'banzai', 'court-games'],
                        honor: 11
                    },
                    player2: {
                        inPlay: ['shiba-tetsu'],
                        hand: ['fine-katana', 'steward-of-law', 'banzai'],
                        honor: 7
                    }
                });

                this.winterCourt = this.player1.findCardByName('winter-court-hosts');
                this.steward = this.player2.findCardByName('steward-of-law');
                this.tetsu = this.player2.findCardByName('shiba-tetsu');

                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.winterCourt],
                    defenders: [this.tetsu]
                });
            });

            it('should trigger when your opponent plays a attachment', function() {
                this.player2.playAttachment('fine-katana', this.tetsu);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.clickCard(this.winterCourt);
                expect(this.player1.hand.length).toBe(1);
            });

            it('should trigger for all card types and unlimited', function() {
                this.player2.playAttachment('fine-katana', this.tetsu);
                this.player1.clickCard(this.winterCourt);
                expect(this.player1.hand.length).toBe(1);

                this.player1.pass();
                this.player2.clickCard(this.steward);
                this.player2.clickPrompt('0');
                this.player2.clickPrompt('Conflict');
                this.player1.clickCard(this.winterCourt);
                expect(this.player1.hand.length).toBe(2);

                this.player1.pass();
                this.player2.clickCard('banzai');
                this.player2.clickCard(this.tetsu);
                this.player2.clickPrompt('Done');
                this.player1.clickCard(this.winterCourt);
                expect(this.player1.hand.length).toBe(3);
            });
        });
    });
});
