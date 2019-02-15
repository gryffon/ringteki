describe('Kakita Dojo', function() {
    integration(function() {
        describe('Kakita Dojo\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        dynastyDiscard: ['kakita-dojo'],
                        inPlay: ['doji-challenger', 'brash-samurai']
                    },
                    player2: {
                        inPlay: ['mirumoto-raitsugu', 'doomed-shugenja', 'borderlands-defender'],
                        hand: ['duelist-training']
                    }
                });
                this.kakitaDojo = this.player1.placeCardInProvince('kakita-dojo', 'province 1');

                this.dojiChallenger = this.player1.findCardByName('doji-challenger');
                this.brashSamurai = this.player1.findCardByName('brash-samurai');

                this.mirumotoRaitsugu = this.player2.findCardByName('mirumoto-raitsugu');
                this.doomedShugenja = this.player2.findCardByName('doomed-shugenja');
                this.borderlandsDefender = this.player2.findCardByName('borderlands-defender');
                this.duelistTraining = this.player2.findCardByName('duelist-training');
            });

            it('should not be triggered outside of a conflict', function() {
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.kakitaDojo);
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
                this.player1.clickCard(this.kakitaDojo);
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
                this.player1.clickCard(this.kakitaDojo);
                this.player1.clickCard(this.dojiChallenger);
                expect(this.player1).toHavePrompt('Choose a Character');
                expect(this.player1).not.toBeAbleToSelect(this.dojiChallenger);
                expect(this.player1).not.toBeAbleToSelect(this.brashSamurai);
                expect(this.player1).toBeAbleToSelect(this.mirumotoRaitsugu);
                expect(this.player1).not.toBeAbleToSelect(this.doomedShugenja);
            });

            it('should prevent the loser from triggering their abilities', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.brashSamurai],
                    defenders: [this.doomedShugenja],
                    type: 'military'
                });
                this.player2.pass();
                this.player1.clickCard(this.kakitaDojo);
                this.player1.clickCard(this.brashSamurai);
                this.player1.clickCard(this.doomedShugenja);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('5');
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.brashSamurai);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not bow the loser if the winner is not a \'duelist\'', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.brashSamurai],
                    defenders: [this.doomedShugenja],
                    type: 'military'
                });
                this.player2.pass();
                this.player1.clickCard(this.kakitaDojo);
                this.player1.clickCard(this.brashSamurai);
                this.player1.clickCard(this.doomedShugenja);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('5');
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.brashSamurai.bowed).toBe(false);
            });

            it('should bow the loser if the winner is a \'duelist\'', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.dojiChallenger],
                    defenders: [this.mirumotoRaitsugu],
                    type: 'military'
                });
                this.player2.pass();
                this.player1.clickCard(this.kakitaDojo);
                this.player1.clickCard(this.dojiChallenger);
                this.player1.clickCard(this.mirumotoRaitsugu);
                this.player1.clickPrompt('5');
                this.player2.clickPrompt('1');
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.mirumotoRaitsugu.bowed).toBe(true);
            });

            it('should not bow a borderlands defender when it is defending, but still prevent triggered abilities', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.dojiChallenger],
                    defenders: [this.borderlandsDefender],
                    type: 'military'
                });
                this.player2.clickCard(this.duelistTraining);
                this.player2.clickCard(this.borderlandsDefender);
                this.player1.clickCard(this.kakitaDojo);
                this.player1.clickCard(this.dojiChallenger);
                this.player1.clickCard(this.borderlandsDefender);
                this.player1.clickPrompt('5');
                this.player2.clickPrompt('1');
                expect(this.borderlandsDefender.bowed).toBe(false);
                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.player2.clickCard(this.borderlandsDefender);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });
        });
    });
});
