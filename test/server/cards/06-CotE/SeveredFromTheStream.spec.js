describe('Severed From the Stream', function() {
    integration(function() {
        describe('Severed From the Stream\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['adept-of-the-waves'],
                        hand: ['severed-from-the-stream','against-the-waves']
                    },
                    player2: {
                        inPlay: ['doji-challenger'],
                        dynastyDiscard: ['the-imperial-palace']
                    }
                });
                this.adeptOfTheWaves = this.player1.findCardByName('adept-of-the-waves');
                this.againstTheWaves = this.player1.findCardByName('against-the-waves');
                this.severedFromTheStream = this.player1.findCardByName('severed-from-the-stream');

                this.dojiChallenger = this.player2.findCardByName('doji-challenger');
                this.theImperialPalace = this.player2.findCardByName('the-imperial-palace');

                this.player1.claimRing('air');
                this.player1.claimRing('fire');
                this.player2.claimRing('void');
            });

            it('should return all rings from the player with the lowest glory count', function() {
                expect(this.player1.player.getGloryCount()).toBe(2 + 2);
                expect(this.player2.player.getGloryCount()).toBe(2 + 1);
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.severedFromTheStream);
                expect(this.player2).toHavePrompt('Action Window');
                expect(this.game.rings.air.claimedBy).toBe(this.player1.player.name);
                expect(this.game.rings.fire.claimedBy).toBe(this.player1.player.name);
                expect(this.game.rings.void.claimed).toBe(false);
            });

            it('should not count bowed characters in the glory count', function() {
                this.player1.clickCard(this.againstTheWaves);
                this.player1.clickCard(this.adeptOfTheWaves);
                this.player2.pass();
                expect(this.player1.player.getGloryCount()).toBe(2);
                expect(this.player2.player.getGloryCount()).toBe(2 + 1);
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.severedFromTheStream);
                expect(this.player2).toHavePrompt('Action Window');
                expect(this.game.rings.air.claimed).toBe(false);
                expect(this.game.rings.fire.claimed).toBe(false);
                expect(this.game.rings.void.claimedBy).toBe(this.player2.player.name);
            });

            it('should count the imperial palace in the glory count', function() {
                this.player2.placeCardInProvince(this.theImperialPalace, 'province 1');
                expect(this.player1.player.getGloryCount()).toBe(2 + 2);
                expect(this.player2.player.getGloryCount()).toBe(2 + 1 + 3);
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.severedFromTheStream);
                expect(this.player2).toHavePrompt('Action Window');
                expect(this.game.rings.air.claimed).toBe(false);
                expect(this.game.rings.fire.claimed).toBe(false);
                expect(this.game.rings.void.claimedBy).toBe(this.player2.player.name);
            });

            it('should still trigger if player\'s glory counts are equal, doing a glory count is a change in gamestate', function() {
                this.player2.claimRing('water');
                expect(this.player1.player.getGloryCount()).toBe(2 + 2);
                expect(this.player2.player.getGloryCount()).toBe(2 + 2);
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.severedFromTheStream);
                expect(this.player2).toHavePrompt('Action Window');
                expect(this.game.rings.air.claimedBy).toBe(this.player1.player.name);
                expect(this.game.rings.fire.claimedBy).toBe(this.player1.player.name);
                expect(this.game.rings.void.claimedBy).toBe(this.player2.player.name);
                expect(this.game.rings.water.claimedBy).toBe(this.player2.player.name);
            });
        });
    });
});
