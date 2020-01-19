describe('Isawa Tadaka', function() {
    integration(function() {
        describe('Isawa Tadaka\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['seppun-guardsman', 'solemn-scholar'],
                        hand: ['against-the-waves', 'against-the-waves']
                    },
                    player2: {
                        inPlay: ['isawa-tadaka', 'serene-warrior']
                    }
                });
                this.isawaTadaka = this.player2.findCardByName('isawa-tadaka');
                this.scholar = this.player1.findCardByName('solemn-scholar');
                this.player1.clickCard('against-the-waves');
                this.player1.clickCard(this.scholar);
                this.againstTheWaves = this.player1.findCardByName('against-the-waves', 'hand');
                this.player2.pass();
            });

            it('should allow a player to play an event in their discard pile if they have the earth ring', function() {
                this.player1.claimRing('earth');
                expect(this.scholar.bowed).toBe(true);
                this.player1.clickCard(this.againstTheWaves);
                expect(this.player1).toHavePrompt('Against the Waves');
            });

            it('should not allow a player to play an event in their discard pile if they don\'t have the earth ring', function() {
                expect(this.scholar.bowed).toBe(true);
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.againstTheWaves);
                expect(this.player1).toHavePrompt('Action Window');
            });
        });
    });
});
