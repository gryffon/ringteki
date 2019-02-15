describe('Honorable Challenger', function() {
    integration(function() {
        describe('Honorable Challenger\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['honorable-challenger']
                    },
                    player2: {
                        inPlay: ['mirumoto-raitsugu', 'doomed-shugenja', 'togashi-initiate']
                    }
                });
                this.honorableChallenger = this.player1.findCardByName('honorable-challenger');
                this.mirumotoRaitsugu = this.player2.findCardByName('mirumoto-raitsugu');
                this.doomedShugenja = this.player2.findCardByName('doomed-shugenja');
                this.togashiInitiate = this.player2.findCardByName('togashi-initiate');
            });

            it('should not be able to be triggered outside of a conflict', function() {
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.honorableChallenger);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should prompt to target a participating character', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.honorableChallenger],
                    defenders: [this.mirumotoRaitsugu, this.doomedShugenja],
                    type: 'political'
                });
                this.player2.pass();
                this.player1.clickCard(this.honorableChallenger);
                expect(this.player1).toHavePrompt('Honorable Challenger');
                expect(this.player1).toBeAbleToSelect(this.mirumotoRaitsugu);
                expect(this.player1).toBeAbleToSelect(this.doomedShugenja);
                expect(this.player1).not.toBeAbleToSelect(this.togashiInitiate);
            });

            it('should not bow the winner of the duel as the result of the conflict resolution', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.honorableChallenger],
                    defenders: [this.mirumotoRaitsugu, this.doomedShugenja],
                    type: 'political'
                });
                this.player2.pass();
                this.player1.clickCard(this.honorableChallenger);
                this.player1.clickCard(this.mirumotoRaitsugu);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('5');
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.honorableChallenger.bowed).toBe(true);
                expect(this.mirumotoRaitsugu.bowed).toBe(false);
                expect(this.doomedShugenja.bowed).toBe(true);
            });

            it('should still bow the winner of the duel as the result of other conflict resolutions', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.honorableChallenger],
                    defenders: [this.mirumotoRaitsugu, this.doomedShugenja],
                    type: 'military'
                });
                this.player2.pass();
                this.player1.clickCard(this.honorableChallenger);
                this.player1.clickCard(this.mirumotoRaitsugu);
                this.player1.clickPrompt('5');
                this.player2.clickPrompt('1');
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.honorableChallenger.bowed).toBe(false);
                expect(this.mirumotoRaitsugu.bowed).toBe(true);
                expect(this.doomedShugenja.bowed).toBe(true);
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.togashiInitiate],
                    defenders: [this.honorableChallenger],
                    ring: 'void'
                });
                this.noMoreActions();
                expect(this.honorableChallenger.bowed).toBe(true);
            });
        });
    });
});
