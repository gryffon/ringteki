describe('Imperial Storehouse', function () {
    integration(function () {
        describe('Imperial Storehouse\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        dynastyDiscard: ['imperial-storehouse']
                    },
                    player2: {
                    }
                });
                this.imperialStorehouse = this.player1.placeCardInProvince('imperial-storehouse', 'province 1');
            });

            it('should draw a card', function () {
                let handCount = this.player1.hand.length;
                this.player1.clickCard(this.imperialStorehouse);
                expect(this.player1.hand.length).toBe(handCount + 1);
            });

            it('should sacrifice itself', function () {
                this.player1.clickCard(this.imperialStorehouse);
                expect(this.imperialStorehouse.location).toBe('dynasty discard pile');
            });

            it('should refill the province', function () {
                this.player1.clickCard(this.imperialStorehouse);
                this.newCard = this.player1.player.getDynastyCardInProvince('province 1');
                expect(this.newCard).not.toBeUndefined();
            });

        });
    });
});
