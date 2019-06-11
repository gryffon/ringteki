describe('Adept of Shadows', function() {
    integration(function() {
        describe('Adept of Shadow\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['adept-of-shadows']
                    },
                    player2: {
                        hand: ['blackmail']
                    }
                });
                this.adeptOfShadows = this.player1.findCardByName('adept-of-shadows');
                this.blackmail = this.player2.findCardByName('blackmail');

            });

            it('should return it to its owner\'s hand', function() {
                let honor = this.player1.honor;
                this.player1.clickCard(this.adeptOfShadows);
                expect(this.player1.honor).toBe(honor - 1);
                expect(this.adeptOfShadows.location).toBe('hand');
            });

            it('should return it to its owner\'s hand when controlled by the opponent', function() {
                this.player2.honor = 5;
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.adeptOfShadows],
                    defenders: []
                });
                this.player2.clickCard(this.blackmail);
                this.player2.clickCard(this.adeptOfShadows);
                expect(this.player1.player.hand.size()).toBe(0);
                expect(this.player2.player.hand.size()).toBe(0);
                this.player1.pass();
                this.player2.clickCard(this.adeptOfShadows);
                expect(this.player2.honor).toBe(4);
                expect(this.player1.player.hand.size()).toBe(1);
                expect(this.player2.player.hand.size()).toBe(0);
                expect(this.adeptOfShadows.location).toBe('hand');
            });
        });
    });
});
