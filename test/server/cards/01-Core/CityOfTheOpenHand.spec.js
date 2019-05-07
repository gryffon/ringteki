describe('City of the Open Hand', function() {
    integration(function() {
        describe('City of the Open Hand\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        stronghold: 'city-of-the-open-hand',
                        inPlay: ['bayushi-liar'],
                        honor: 10
                    },
                    player2: {
                        stronghold: 'city-of-the-open-hand',
                        inPlay: ['righteous-magistrate'],
                        hand: ['even-the-odds','assassination'],
                        honor: 12
                    }
                });
                this.bayushiLiar = this.player1.findCardByName('bayushi-liar');
                this.cityOfTheOpenHand = this.player1.findCardByName('city-of-the-open-hand');
                this.righteousMagistrate = this.player2.findCardByName('righteous-magistrate');
                this.evenTheOdds = this.player2.findCardByName('even-the-odds');
                this.assassination = this.player2.findCardByName('assassination');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.bayushiLiar],
                    defenders: []
                });
            });

            it('should not work if player is more honorable', function() {
                this.player2.clickCard(this.assassination);
                this.player2.clickCard(this.bayushiLiar);
                this.player1.clickCard(this.cityOfTheOpenHand);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should work if player is less honorable', function() {
                this.player2.pass();
                this.player1.clickCard(this.cityOfTheOpenHand);
                expect(this.player1).toHavePrompt('City of the Open Hand');
                expect(this.player1).toHavePromptButton('Gain 1 Honor');
                expect(this.player1).toHavePromptButton('Make opponent lose 1 honor');
            });

            it('should make the player gain 1 honor', function() {
                this.player2.pass();
                this.player1.clickCard(this.cityOfTheOpenHand);
                this.player1.clickPrompt('Gain 1 Honor');
                expect(this.player1.honor).toBe(11);
                expect(this.cityOfTheOpenHand.bowed).toBe(true);
            });

            it('should make the opponent lose 1 honor', function() {
                this.player2.pass();
                this.player1.clickCard(this.cityOfTheOpenHand);
                this.player1.clickPrompt('Make opponent lose 1 honor');
                expect(this.player2.honor).toBe(11);
                expect(this.cityOfTheOpenHand.bowed).toBe(true);
            });

            it('should not work if Righteous Magistrate is defending', function() {
                this.player2.clickCard(this.evenTheOdds);
                this.player2.clickCard(this.righteousMagistrate);
                this.player1.clickCard(this.cityOfTheOpenHand);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.cityOfTheOpenHand.bowed).toBe(false);
            });
        });
    });
});
