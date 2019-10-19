describe('Ashigaru Levy', function() {
    integration(function() {
        describe('Ashigaru Levy\'s ability', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        dynastyDiscard: ['ashigaru-levy', 'ashigaru-levy', 'ashigaru-levy', 'kitsu-spiritcaller', 'akodo-gunso']
                    }
                });

                this.ashigaruLevy1 = this.player1.placeCardInProvince('ashigaru-levy', 'province 1');

                this.ashigaruLevy2 = this.player1.findCardByName('ashigaru-levy', 'dynasty discard pile');
                this.ashigaruLevy2 = this.player1.placeCardInProvince(this.ashigaruLevy2, 'province 2');

                this.ashigaruLevy3 = this.player1.findCardByName('ashigaru-levy', 'dynasty discard pile');

                this.kitsuSpiritcaller = this.player1.placeCardInProvince('kitsu-spiritcaller', 'province 3');
                this.akodoGunso = this.player1.findCardByName('akodo-gunso', 'dynasty discard pile');
            });

            it('should allow you to fetch another levy from the province row', function () {
                this.player1.clickCard(this.ashigaruLevy1);
                this.player1.clickPrompt('0');

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.ashigaruLevy1);
                this.player1.clickCard(this.ashigaruLevy1);

                expect(this.player1).toBeAbleToSelect(this.ashigaruLevy2);
                this.player1.clickCard(this.ashigaruLevy2);
                expect(this.ashigaruLevy2.location).toBe('play area');
            });

            it('should allow you to fetch another levy from the province row', function () {
                this.player1.clickCard(this.ashigaruLevy1);
                this.player1.clickPrompt('0');

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.ashigaruLevy1);
                this.player1.clickCard(this.ashigaruLevy1);

                expect(this.player1).toBeAbleToSelect(this.ashigaruLevy3);
                this.player1.clickCard(this.ashigaruLevy3);
                expect(this.ashigaruLevy3.location).toBe('play area');
            });

            it('should allow you to fetch another levy from the province row', function () {
                this.player1.clickCard(this.ashigaruLevy1);
                this.player1.clickPrompt('0');

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.ashigaruLevy1);
                this.player1.clickCard(this.ashigaruLevy1);

                expect(this.player1).toBeAbleToSelect(this.ashigaruLevy2);
                this.player1.clickCard(this.ashigaruLevy2);
                expect(this.ashigaruLevy2.location).toBe('play area');

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.ashigaruLevy2);
                this.player1.clickCard(this.ashigaruLevy2);

                expect(this.player1).toBeAbleToSelect(this.ashigaruLevy3);
                this.player1.clickCard(this.ashigaruLevy3);
                expect(this.ashigaruLevy3.location).toBe('play area');
            });
        });
    });
});

