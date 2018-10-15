describe('Seppun Truthseeker', function() {
    integration(function() {
        describe('Seppun Truthseeker\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['seppun-truthseeker'],
                        hand: ['ornate-fan','fine-katana']
                    },
                    player2: {
                        inPlay: [],
                        hand: ['assassination']
                    }
                });
                this.ts = this.player1.findCardByName('seppun-truthseeker');
            });

            it('should correctly draw 2 cards when leaving play', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.ts],
                    defenders: []
                });
                this.game.checkGameState(true);
                expect(this.player1.hand.length).toBe(2);
                expect(this.player2.hand.length).toBe(1);
                this.player2.clickCard('assassination');
                expect(this.player2).toBeAbleToSelect(this.ts);
                this.player2.clickCard(this.ts);
                expect(this.ts.location).toBe('dynasty discard pile');
                expect(this.player1.hand.length).toBe(4);
                expect(this.player2.hand.length).toBe(2);
            });
        });
    });
});
