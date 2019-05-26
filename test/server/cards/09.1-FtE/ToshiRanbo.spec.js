describe('Toshi Ranbo', function() {
    integration(function() {
        describe('Toshi Ranbo\'s constant ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        provinces: ['toshi-ranbo'],
                        dynastyDiscard: ['bayushi-liar', 'bayushi-shoju']
                    },
                    player2: {
                        dynastyDiscard: ['kitsuki-yaruma']
                    }
                });

                this.toshiRanbo = this.player1.findCardByName('toshi-ranbo', 'province 1');
                this.shamefulDisplay = this.player1.findCardByName('shameful-display', 'province 2');
                this.bayushiLiar = this.player1.placeCardInProvince('bayushi-liar', 'province 1');
                this.bayushiShoju = this.player1.placeCardInProvince('bayushi-shoju', 'province 2');

                this.kitsukiYaruma = this.player2.placeCardInProvince('kitsuki-yaruma', 'province 1');
            });

            it('should start the game faceup', function() {
                expect(this.toshiRanbo.facedown).toBe(false);
            });

            it('should not be able to be turned facedown', function() {
                this.shamefulDisplay.facedown = false;
                this.player1.pass();
                this.player2.clickCard(this.kitsukiYaruma);
                this.player2.clickPrompt('0');
                expect(this.kitsukiYaruma.location).toBe('play area');
                expect(this.player2).toHavePrompt('Triggered Abilities');
                this.player2.clickCard(this.kitsukiYaruma);
                expect(this.player2).toHavePrompt('Choose a province');
                expect(this.player2).toBeAbleToSelect(this.shamefulDisplay);
                expect(this.player2).not.toBeAbleToSelect(this.toshiRanbo);
            });

            it('should add 1 fate to characters played from this province', function() {
                this.toshiRanbo.facedown = false;
                this.player1.clickCard(this.bayushiLiar);
                this.player1.clickPrompt('0');
                expect(this.bayushiLiar.location).toBe('play area');
                expect(this.bayushiLiar.fate).toBe(1);
                expect(this.getChatLogs(2)).toContain('player1 plays Bayushi Liar with 0 additional fate');
                expect(this.getChatLogs(1)).toContain('Bayushi Liar enters play with 1 additional fate due to Toshi Ranbo');
            });

            it('should not add fate to characters played from other provinces', function() {
                this.player1.clickCard(this.bayushiShoju);
                this.player1.clickPrompt('0');
                expect(this.bayushiShoju.location).toBe('play area');
                expect(this.bayushiShoju.fate).toBe(0);
            });
        });
    });
});
