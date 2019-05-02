describe('Rebuild', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    hand: ['rebuild'],
                    dynastyDiscard: ['imperial-storehouse', 'seppun-guardsman', 'otomo-courtier']
                },
                player2: {
                    hand: ['fine-katana']
                }
            });
            this.rebuild = this.player1.findCardByName('rebuild');
            this.imperialStorehouse = this.player1.placeCardInProvince('imperial-storehouse');
            this.seppunGuardsman = this.player1.placeCardInProvince('seppun-guardsman', 'province 2');
            this.otomoCourtier = this.player1.placeCardInProvince('otomo-courtier', 'province 3');
            this.otomoCourtier.facedown = true;
            this.player1.clickCard(this.imperialStorehouse);
            this.player2.pass();
        });

        describe('Rebuild\'s action', function() {
            it('should shuffle a faceup card into the deck', function() {
                expect(this.player1.player.provinceOne.size()).toBe(2);
                this.player1.clickCard('rebuild');
                expect(this.player1).toHavePrompt('Select card to shuffle into deck');
                this.player1.clickCard(this.seppunGuardsman);
                expect(this.player1.player.provinceTwo.size()).toBe(1);
                expect(this.seppunGuardsman.location).toBe('dynasty deck');
            });

            it('should shuffle a facedown card into the deck', function() {
                this.player1.clickCard('rebuild');
                expect(this.player1).toHavePrompt('Select card to shuffle into deck');
                this.player1.clickCard(this.otomoCourtier);
                expect(this.player1.player.provinceThree.size()).toBe(1);
                expect(this.otomoCourtier.location).toBe('dynasty deck');
            });

            it('should place the chosen card in the province', function() {
                this.player1.clickCard('rebuild');
                this.player1.clickCard(this.seppunGuardsman);
                expect(this.player1).toHavePrompt('Choose a holding to put into the province');
                expect(this.player1).toBeAbleToSelect(this.imperialStorehouse);
                this.player1.clickCard(this.imperialStorehouse);
                expect(this.imperialStorehouse.location).toBe('province 2');
            });
        });
    });
});
