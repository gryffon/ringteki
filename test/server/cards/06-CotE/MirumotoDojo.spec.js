describe('Mirumoto Dojo', function() {
    integration(function() {
        describe('Mirumoto Dojo\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        dynastyDiscard: ['mirumoto-dojo'],
                        inPlay: ['doji-challenger', 'brash-samurai']
                    },
                    player2: {
                        inPlay: ['mirumoto-raitsugu', 'doomed-shugenja']
                    }
                });
                this.mirumotoDojo = this.player1.placeCardInProvince('mirumoto-dojo', 'province 1');

                this.dojiChallenger = this.player1.findCardByName('doji-challenger');
                this.dojiChallenger.fate = 3;
                this.brashSamurai = this.player1.findCardByName('brash-samurai');
                this.brashSamurai.fate = 2;

                this.mirumotoRaitsugu = this.player2.findCardByName('mirumoto-raitsugu');
                this.doomedShugenja = this.player2.findCardByName('doomed-shugenja');
            });

            it('should not be triggered outside of a conflict', function() {
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.mirumotoDojo);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should prompt to select a participating character you control as the challenger', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.dojiChallenger],
                    defenders: [this.mirumotoRaitsugu],
                    type: 'military'
                });
                this.player2.pass();
                this.player1.clickCard(this.mirumotoDojo);
                expect(this.player1).toHavePrompt('Choose a Character');
                expect(this.player1).toBeAbleToSelect(this.dojiChallenger);
                expect(this.player1).not.toBeAbleToSelect(this.brashSamurai);
                expect(this.player1).not.toBeAbleToSelect(this.mirumotoRaitsugu);
                expect(this.player1).not.toBeAbleToSelect(this.doomedShugenja);
            });

            it('should prompt to select a participating character your opponent controls as the duel target', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.dojiChallenger],
                    defenders: [this.mirumotoRaitsugu],
                    type: 'military'
                });
                this.player2.pass();
                this.player1.clickCard(this.mirumotoDojo);
                this.player1.clickCard(this.dojiChallenger);
                expect(this.player1).toHavePrompt('Choose a Character');
                expect(this.player1).not.toBeAbleToSelect(this.dojiChallenger);
                expect(this.player1).not.toBeAbleToSelect(this.brashSamurai);
                expect(this.player1).toBeAbleToSelect(this.mirumotoRaitsugu);
                expect(this.player1).not.toBeAbleToSelect(this.doomedShugenja);
            });

            it('should move 1 fate from the loser to its owner\'s fate pool', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.brashSamurai],
                    defenders: [this.doomedShugenja],
                    type: 'military'
                });
                this.player2.pass();
                this.player1.clickCard(this.mirumotoDojo);
                this.player1.clickCard(this.brashSamurai);
                this.player1.clickCard(this.doomedShugenja);

                let player1Fate = this.player1.player.fate;
                let brashSamuraiFate = this.brashSamurai.fate;

                this.player1.clickPrompt('1');
                this.player2.clickPrompt('5');
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.brashSamurai.fate).toBe(brashSamuraiFate - 1);
                expect(this.player1.player.fate).toBe(player1Fate + 1);
            });

            it('should discard 1 fate instead if the winner is a \'duelist\'', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.dojiChallenger],
                    defenders: [this.mirumotoRaitsugu],
                    type: 'military'
                });
                this.player2.pass();
                this.player1.clickCard(this.mirumotoDojo);
                this.player1.clickCard(this.dojiChallenger);
                this.player1.clickCard(this.mirumotoRaitsugu);

                let player1Fate = this.player1.player.fate;
                let dojiChallengerFate = this.dojiChallenger.fate;

                this.player1.clickPrompt('1');
                this.player2.clickPrompt('5');
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.dojiChallenger.fate).toBe(dojiChallengerFate - 1);
                expect(this.player1.player.fate).toBe(player1Fate);
            });
        });
    });
});
