describe('Restoration of Balance', function() {
    integration(function() {
        describe('Restoration of Balance\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['akodo-toturi'],
                        hand: [
                            'against-the-waves', 'fine-katana', 'ornate-fan', 'honored-blade',
                            'magnificent-kimono', 'assassination', 'banzai', 'charge'
                        ]
                    },
                    player2: {
                        provinces: ['restoration-of-balance']
                    }
                });
                this.akodoToturi = this.player1.findCardByName('akodo-toturi');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.akodoToturi],
                    defenders: []
                });
                this.noMoreActions();
                this.player2.clickCard('restoration-of-balance');
            });

            it('should prompt the opponent to discard down to four cards', function() {
                expect(this.player1).toHavePrompt('Choose 4 cards to discard');
                expect(this.player1).toBeAbleToSelect('assassination');
                expect(this.player1).toBeAbleToSelect('charge');
            });

            it('should discard the chosen cards', function() {
                this.assassination = this.player1.clickCard('assassination');
                this.fineKatana = this.player1.clickCard('fine-katana');
                this.charge = this.player1.clickCard('charge');
                this.banzai = this.player1.clickCard('banzai');
                this.player1.clickPrompt('Done');
                expect(this.player1.player.conflictDiscardPile.toArray()).toContain(this.assassination, this.fineKatana, this.charge, this.banzai);
            });
        });
    });
});
