describe('Admit Defeat', function() {
    integration(function() {
        describe('Admit Defeat\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['brash-samurai'],
                        hand: ['admit-defeat']
                    },
                    player2: {
                        inPlay: ['togashi-yokuni', 'togashi-initiate']
                    }
                });
                this.brashSamurai = this.player1.findCardByName('brash-samurai');
                this.admitDefeat = this.player1.findCardByName('admit-defeat');
                this.togashiYokuni = this.player2.findCardByName('togashi-yokuni');
                this.togashiInitiate = this.player2.findCardByName('togashi-initiate');
                this.noMoreActions();
            });

            it('should bow the only defender', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.brashSamurai],
                    defenders: [this.togashiYokuni]
                });
                this.player2.pass();
                this.player1.clickCard(this.admitDefeat);
                expect(this.player1).toHavePrompt('Admit Defeat');
                expect(this.player1).toBeAbleToSelect(this.togashiYokuni);
                this.player1.clickCard(this.togashiYokuni);
                expect(this.togashiYokuni.bowed).toBe(true);
            });

            it('should not be able to trigger with more than 1 defender', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.brashSamurai],
                    defenders: [this.togashiYokuni, this.togashiInitiate]
                });
                this.player2.pass();
                this.player1.clickCard(this.admitDefeat);
                expect(this.player1).not.toHavePrompt('Admit Defeat');
            });

            it('should not work on an attacking character', function() {
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.togashiYokuni],
                    defenders: []
                });
                this.player1.clickCard(this.admitDefeat);
                expect(this.player1).not.toHavePrompt('Admit Defeat');
            });

            it('should work on your own defending character', function() {
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.togashiYokuni],
                    defenders: [this.brashSamurai]
                });
                this.player1.clickCard(this.admitDefeat);
                expect(this.player1).toHavePrompt('Admit Defeat');
                expect(this.player1).not.toBeAbleToSelect(this.togashiYokuni);
                expect(this.player1).toBeAbleToSelect(this.brashSamurai);
                this.player1.clickCard(this.brashSamurai);
                expect(this.brashSamurai.bowed).toBe(true);
            });
        });
    });
});
