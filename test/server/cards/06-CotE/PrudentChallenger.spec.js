describe('Prudent Challenger', function() {
    integration(function() {
        describe('Prudent Challenger\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['prudent-challenger'],
                        hand: ['ornate-fan']
                    },
                    player2: {
                        inPlay: ['mirumoto-raitsugu', 'doomed-shugenja', 'togashi-initiate'],
                        hand: ['fine-katana']
                    }
                });
                this.prudentChallenger = this.player1.findCardByName('prudent-challenger');
                this.ornateFan = this.player1.findCardByName('ornate-fan');

                this.mirumotoRaitsugu = this.player2.findCardByName('mirumoto-raitsugu');
                this.doomedShugenja = this.player2.findCardByName('doomed-shugenja');
                this.togashiInitiate = this.player2.findCardByName('togashi-initiate');
                this.fineKatana = this.player2.findCardByName('fine-katana');
            });

            it('should not be able to be triggered outside of a conflict', function() {
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.prudentChallenger);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should prompt to target a participating character', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.prudentChallenger],
                    defenders: [this.mirumotoRaitsugu, this.doomedShugenja],
                    type: 'political'
                });
                this.player2.pass();
                this.player1.clickCard(this.prudentChallenger);
                expect(this.player1).toHavePrompt('Prudent Challenger');
                expect(this.player1).toBeAbleToSelect(this.mirumotoRaitsugu);
                expect(this.player1).toBeAbleToSelect(this.doomedShugenja);
                expect(this.player1).not.toBeAbleToSelect(this.togashiInitiate);
            });

            it('should resolve without prompting if there are no attachments on the loser', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.prudentChallenger],
                    defenders: [this.mirumotoRaitsugu, this.doomedShugenja],
                    type: 'political'
                });
                this.player2.pass();
                this.player1.clickCard(this.prudentChallenger);
                this.player1.clickCard(this.mirumotoRaitsugu);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('5');
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should prompt who controls Prudent Challenger to discard attachments on the loser (challenge target loses)', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.prudentChallenger],
                    defenders: [this.mirumotoRaitsugu, this.doomedShugenja],
                    type: 'political'
                });
                this.player2.clickCard(this.fineKatana);
                this.player2.clickCard(this.mirumotoRaitsugu);
                this.player1.clickCard(this.ornateFan);
                this.player1.clickCard(this.mirumotoRaitsugu);
                this.player2.pass();
                this.player1.clickCard(this.prudentChallenger);
                this.player1.clickCard(this.mirumotoRaitsugu);
                this.player1.clickPrompt('5');
                this.player2.clickPrompt('1');
                expect(this.player1).toHavePrompt('Choose an attachment to discard');
                expect(this.player1).toBeAbleToSelect(this.fineKatana);
                expect(this.player1).toBeAbleToSelect(this.ornateFan);
            });

            it('should prompt who controls Prudent Challenger to discard attachments on the loser (challenger loses)', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.prudentChallenger],
                    defenders: [this.mirumotoRaitsugu, this.doomedShugenja],
                    type: 'political'
                });
                this.player2.clickCard(this.fineKatana);
                this.player2.clickCard(this.mirumotoRaitsugu);
                this.player1.clickCard(this.ornateFan);
                this.player1.clickCard(this.prudentChallenger);
                this.player2.pass();
                this.player1.clickCard(this.prudentChallenger);
                this.player1.clickCard(this.mirumotoRaitsugu);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('5');
                expect(this.player1).toHavePrompt('Choose an attachment to discard');
                expect(this.player1).not.toBeAbleToSelect(this.fineKatana);
                expect(this.player1).toBeAbleToSelect(this.ornateFan);
            });

            it('should discard the chosen attachment', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.prudentChallenger],
                    defenders: [this.mirumotoRaitsugu, this.doomedShugenja],
                    type: 'political'
                });
                this.player2.pass();
                this.player1.clickCard(this.ornateFan);
                this.player1.clickCard(this.prudentChallenger);
                this.player2.pass();
                this.player1.clickCard(this.prudentChallenger);
                this.player1.clickCard(this.mirumotoRaitsugu);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('5');
                this.player1.clickCard(this.ornateFan);
                expect(this.ornateFan.location).toBe('conflict discard pile');
            });
        });
    });
});
