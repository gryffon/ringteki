describe('Brothers Gift Dojo', function() {
    integration(function() {
        describe('Brothers Gift Dojo\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['bayushi-liar'],
                        provinces: ['brother-s-gift-dojo'],
                        dynastyDiscard: ['favorable-ground'],
                        honor: 9
                    },
                    player2: {
                        inPlay: ['akodo-toturi']
                    }
                });
                this.bgd = this.player1.findCardByName('brother-s-gift-dojo');
                this.bgd.facedown = false;
                this.fg = this.player1.placeCardInProvince('favorable-ground','province 3');
                this.liar = this.player1.findCardByName('bayushi-liar');

                this.noMoreActions();
            });

            it('should correctly make the player lose 1 honor', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.liar],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.bgd);
                expect(this.player1).toBeAbleToSelect(this.liar);
                this.player1.clickCard(this.liar);
                expect(this.player1.honor).toBe(8);
                expect(this.liar.inConflict).toBe(false);
            });

            it('should be able to trigger twice a round', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.liar],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.bgd);
                this.player1.clickCard(this.liar);
                expect(this.player1.honor).toBe(8);
                expect(this.liar.inConflict).toBe(false);
                this.player2.pass();
                this.player1.clickCard(this.fg);
                this.player1.clickCard(this.liar);
                expect(this.liar.inConflict).toBe(true);
                this.player2.pass();
                this.player1.clickCard(this.bgd);
                expect(this.player1).toBeAbleToSelect(this.liar);
                this.player1.clickCard(this.liar);
                expect(this.liar.inConflict).toBe(false);
                expect(this.player1.honor).toBe(7);
            });
        });
    });
});
