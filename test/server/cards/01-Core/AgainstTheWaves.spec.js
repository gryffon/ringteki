describe('Against the Waves', function() {
    integration(function() {
        describe('Against the Waves\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['kudaka'],
                        hand: ['against-the-waves']
                    },
                    player2: {
                        inPlay: ['togashi-yokuni', 'togashi-initiate']
                    }
                });
                this.kudaka = this.player1.findCardByName('kudaka');
                this.againstTheWaves = this.player1.findCardByName('against-the-waves');
                this.togashiYokuni = this.player2.findCardByName('togashi-yokuni');
                this.togashiInitiate = this.player2.findCardByName('togashi-initiate');
            });

            it('should work only on shugenja you control', function() {
                this.player1.clickCard(this.againstTheWaves);
                expect(this.player1).toHavePrompt('Against the Waves');
                expect(this.player1).not.toBeAbleToSelect(this.togashiYokuni);
                expect(this.player1).toBeAbleToSelect(this.kudaka);
                expect(this.player1).not.toBeAbleToSelect(this.togashiInitiate);
            });

            it('should ready a bowed character', function() {
                this.kudaka.bowed = true;
                this.player1.clickCard(this.againstTheWaves);
                this.player1.clickCard(this.kudaka);
                expect(this.kudaka.bowed).toBe(false);
            });

            it('should bow a ready character', function() {
                this.kudaka.bowed = false;
                this.player1.clickCard(this.againstTheWaves);
                this.player1.clickCard(this.kudaka);
                expect(this.kudaka.bowed).toBe(true);
            });
        });
    });
});
