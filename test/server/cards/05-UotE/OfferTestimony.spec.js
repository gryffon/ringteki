describe('Offer Testimony', function() {
    integration(function() {
        describe('Offer Testimony\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['adept-of-the-waves', 'wandering-ronin'],
                        hand: ['banzai', 'offer-testimony']
                    },
                    player2: {
                        inPlay: ['borderlands-defender', 'intimidating-hida'],
                        dynastyDiscard: ['favorable-ground'],
                        hand: ['way-of-the-crab', 'assassination']
                    }
                });
                this.favorableGround = this.player2.placeCardInProvince('favorable-ground');

                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: ['adept-of-the-waves'],
                    defenders: ['borderlands-defender', 'intimidating-hida']
                });
            });

            it('should prompt each player to choose a character', function() {
                this.player2.pass();
                this.player1.clickCard('offer-testimony');
                expect(this.player1).toHavePrompt('Offer Testimony');
                expect(this.player1).toBeAbleToSelect('adept-of-the-waves');
                expect(this.player1).not.toBeAbleToSelect('wandering-ronin');
                this.adeptOfTheWaves = this.player1.clickCard('adept-of-the-waves');
                expect(this.player2).toHavePrompt('Offer Testimony');
                expect(this.player2).toBeAbleToSelect('intimidating-hida');
                expect(this.player2).not.toBeAbleToSelect('borderlands-defender');
            });

            it('should bow the player who reveals a lower cost card', function() {
                this.player2.pass();
                this.player1.clickCard('offer-testimony');
                this.adeptOfTheWaves = this.player1.clickCard('adept-of-the-waves');
                this.intimidatingHida = this.player2.clickCard('intimidating-hida');
                expect(this.player1).toHavePrompt('Choose a card to reveal');
                this.player1.clickCard('banzai');
                expect(this.getChatLogs(5)).not.toContain('player1 reveals Banzai! due to Offer Testimony');
                expect(this.player2).toHavePrompt('Choose a card to reveal');
                this.player2.clickCard('way-of-the-crab');
                expect(this.adeptOfTheWaves.bowed).toBe(true);
                expect(this.intimidatingHida.bowed).toBe(false);
                expect(this.getChatLogs(5)).toContain('player1 reveals Banzai! due to Offer Testimony');
            });

            it('should bow both characters if both players reveal the lowest cost card', function() {
                this.player2.pass();
                this.player1.clickCard('offer-testimony');
                this.adeptOfTheWaves = this.player1.clickCard('adept-of-the-waves');
                this.intimidatingHida = this.player2.clickCard('intimidating-hida');
                this.player1.clickCard('banzai');
                this.player2.clickCard('assassination');
                expect(this.adeptOfTheWaves.bowed).toBe(true);
                expect(this.intimidatingHida.bowed).toBe(true);
            });

            it('should not be playable if there isn\'t a legal target for each player in the conflict', function() {
                this.player2.clickCard(this.favorableGround);
                this.player2.clickCard('intimidating-hida');
                this.player1.clickCard('offer-testimony');
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not prompt the player to reveal a card if they have none left', function() {
                this.player2.pass();
                this.player1.clickCard('banzai');
                this.adeptOfTheWaves = this.player1.clickCard('adept-of-the-waves');
                this.player1.clickPrompt('Done');
                this.player2.pass();
                this.player1.clickCard('offer-testimony');
                this.adeptOfTheWaves = this.player1.clickCard('adept-of-the-waves');
                this.intimidatingHida = this.player2.clickCard('intimidating-hida');
                expect(this.player1).not.toHavePrompt('Choose a card to reveal');
                expect(this.player2).toHavePrompt('Choose a card to reveal');
                this.player2.clickCard('way-of-the-crab');
                expect(this.adeptOfTheWaves.bowed).toBe(false);
                expect(this.intimidatingHida.bowed).toBe(true);
            });
        });
    });
});
