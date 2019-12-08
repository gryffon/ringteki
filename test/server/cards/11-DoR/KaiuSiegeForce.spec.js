describe('Kaiu Siege Force', function () {
    integration(function () {
        describe('Kaiu Siege Force\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['kaiu-siege-force'],
                        dynastyDiscard: ['imperial-storehouse']
                    },
                    player2: {
                        dynastyDiscard: ['favorable-ground']
                    }
                });

                this.storehouse = this.player1.moveCard('imperial-storehouse', 'province 1');
                this.favorable = this.player2.moveCard('favorable-ground', 'province 1');
                this.siegeForce = this.player1.findCardByName('kaiu-siege-force');
                this.siegeForce.bowed = true;
            });

            it('should ready itself', function () {
                this.player1.clickCard(this.siegeForce);
                expect(this.player1).toBeAbleToSelect(this.storehouse);
                expect(this.player1).not.toBeAbleToSelect(this.favorable);
                this.player1.clickCard(this.storehouse);
                expect(this.siegeForce.bowed).toBe(false);
                expect(this.storehouse.location).toBe('dynasty deck');
                expect(this.player1.dynastyDeck[this.player1.dynastyDeck.length - 1]).toBe(this.storehouse);
                expect(this.getChatLogs(3)).toContain('player1 uses Kaiu Siege Force, returning Imperial Storehouse to the bottom of their deck to ready Kaiu Siege Force');
            });

            it('should not be usable without a holding', function () {
                this.player1.clickCard(this.storehouse);
                this.player2.pass();
                this.player1.clickCard(this.siegeForce);
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.siegeForce.bowed).toBe(true);
            });
        });
    });
});
