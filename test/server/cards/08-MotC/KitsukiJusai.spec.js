describe('Kitsuki Jusai', function() {
    integration(function() {
        describe('Kitsuki Jusai\'s Ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'draw',
                    player1: {
                        inPlay: ['kitsuki-jusai']
                    },
                    player2: {
                        fate: 2
                    }
                });
                this.kitsukiJusai = this.player1.findCardByName('kitsuki-jusai');
                this.player2.claimRing('water');
            });

            it('should trigger if honor dials are equal', function() {
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.kitsukiJusai);
            });

            it('should not trigger if honor dials are not equal', function() {
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('2');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
            });

            it('should prompt to choose an unclaimed ring', function() {
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                this.player1.clickCard(this.kitsukiJusai);
                expect(this.player1).toHavePrompt('Choose an unclaimed ring to move fate to');
                expect(this.player1).toBeAbleToSelectRing('air');
                expect(this.player1).toBeAbleToSelectRing('earth');
                expect(this.player1).toBeAbleToSelectRing('fire');
                expect(this.player1).toBeAbleToSelectRing('void');
                expect(this.player1).not.toBeAbleToSelectRing('water');
            });

            it('should move 1 fate from opponent\'s pool to chosen ring', function() {
                let airFate = this.game.rings.air.fate;
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                this.player1.clickCard(this.kitsukiJusai);
                this.player1.clickRing('air');
                expect(this.game.rings.air.fate).toBe(airFate + 1);
                expect(this.player2.fate).toBe(1);
            });

            it('should not trigger if opponent has no fate', function() {
                this.player2.player.fate = 0;
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
            });
        });
    });
});
