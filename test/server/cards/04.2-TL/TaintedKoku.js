describe('Tainted Koku', function() {
    integration(function() {
        describe('Tainted Koku\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['togashi-initiate','togashi-mendicant'],
                        hand: ['fine-katana','let-go']
                    },
                    player2: {
                        inPlay: ['bayushi-shoju'],
                        hand: ['tainted-koku']
                    }
                });
                this.initiate = this.player1.findCardByName('togashi-initiate');
                this.mendicant = this.player1.findCardByName('togashi-mendicant');

                this.koku = this.player2.findCardByName('tainted-koku');
                this.shoju = this.player2.findCardByName('bayushi-shoju');

            });

            it('should correctly be discarded by Let go ', function() {
                this.noMoreActions();
                this.player2.clickCard(this.koku);
                this.player2.clickCard(this.mendicant);
                this.player1.clickCard(this.letgo);
                this.player1.clickCard(this.mendicant);
                expect(this.koku.location).toBe('conflict discard pile');
            });
        });
    });
});
