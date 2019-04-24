describe('Winter Court Hosts', function() {
    integration(function() {
        describe('Winter Court Hosts\' ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['winter-court-hosts'],
                        hand: []
                    },
                    player2: {
                        inPlay: ['shiba-tetsu'],
                        hand: ['fine-katana', 'shrine-maiden', 'banzai']
                    }
                });

                this.winterCourt = this.player1.findCardByName('winter-court-hosts');
                this.shrineMaiden = this.player2.findCardByName('shrine-maiden');
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
                expect(this.player1).toHavePrompt('Winter Court Hosts');
                this.player1.clickCard(this.winterCourt);
                expect(this.player1.hand.length).toBe(1);
            });

            it('should trigger for all card types and unlimited', function() {
                this.player2.playAttachment('fine-katana', this.tetsu);
                expect(this.player1).toHavePrompt('Winter Court Hosts');
                this.player1.clickCard(this.winterCourt);
                expect(this.player1.hand.length).toBe(1);
                
                this.player1.pass();
                this.player2.clickCard(this.shrineMaiden);
                this.player2.clickPrompt('0');
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
