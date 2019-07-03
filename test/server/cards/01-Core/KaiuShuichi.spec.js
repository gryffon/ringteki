describe('Kaiu Shuichi', function() {
    integration(function() {
        describe('Kaiu Shuichi\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['kaiu-shuichi', 'kaiu-envoy'],
                        fate: 1,
                        dynastyDeck: ['imperial-storehouse']
                    },
                    player2: {
                        dynastyDeck: ['karada-district']
                    }
                });

                this.kaiuShuichi = this.player1.findCardByName('kaiu-shuichi');
                this.kaiuEnvoy = this.player1.findCardByName('kaiu-envoy');
                this.imperialStorehouse = this.player1.placeCardInProvince('imperial-storehouse', 'province 1');
                this.karadaDistrict = this.player2.placeCardInProvince('karada-district', 'province 1');
            });

            it('should be activatable there is any holding in play', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.kaiuShuichi]
                });

                this.player1.clickPrompt('No Target');
                this.player2.clickPrompt('Done');
                this.player2.pass();

                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.kaiuShuichi);
                expect(this.player1.fate).toBe(2);
            });

            it('should be activatable there is a holding in play only for the opponent', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.kaiuShuichi]
                });

                this.player1.clickPrompt('No Target');
                this.player2.clickPrompt('Done');
                this.player2.pass();

                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.imperialStorehouse);
                this.player2.pass();
                this.player1.clickCard(this.kaiuShuichi);
                expect(this.player1.fate).toBe(2);
            });

            it('should not be activatable when he isn\'t participating', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.kaiuEnvoy]
                });

                this.player2.clickPrompt('Done');
                this.player2.pass();

                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.kaiuShuichi);
                expect(this.player1.fate).toBe(1);
            });
        });
    });
});
