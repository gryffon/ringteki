describe('Aspiring Challenger', function() {
    integration(function() {
        describe('Aspiring Challenger', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'draw',
                    player1: {
                        inPlay: ['aspiring-challenger']
                    },
                    player2: {
                        inPlay: []
                    }
                });
                this.aspiringChallenger = this.player1.findCardByName('aspiring-challenger');
            });

            it('should have +2 glory if controller has composure', function() {
                let glory = this.aspiringChallenger.glory;
                expect(this.player1.player.hasComposure()).toBe(false);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('2');
                expect(this.player1.player.hasComposure()).toBe(true);
                expect(this.aspiringChallenger.glory).toBe(glory + 2);
            });
        });

        describe('when the target leaves play during the duel', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 11,
                        inPlay: ['aspiring-challenger', 'moto-youth', 'utaku-infantry']
                    },
                    player2: {
                        honor: 11,
                        inPlay: ['obstinate-recruit']
                    }
                });
                this.aspiringChallenger = this.player1.findCardByName('aspiring-challenger');
                this.motoYouth = this.player1.findCardByName('moto-youth');
                this.utakuInfantry = this.player1.findCardByName('utaku-infantry');
                this.obstinateRecruit = this.player2.findCardByName('obstinate-recruit');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.aspiringChallenger],
                    defenders: [this.obstinateRecruit]
                });
                this.player2.pass();
            });

            it('the duel should still successfully resolve', function() {
                this.player1.clickCard(this.aspiringChallenger);
                this.player1.clickCard(this.obstinateRecruit);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('2');
                expect(this.aspiringChallenger.isHonored).toBe(true);
                expect(this.obstinateRecruit.location).toBe('dynasty discard pile');
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });
        });

        describe('Aspiring Challenger\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['aspiring-challenger']
                    },
                    player2: {
                        inPlay: ['mirumoto-raitsugu', 'doomed-shugenja', 'togashi-initiate']
                    }
                });
                this.aspiringChallenger = this.player1.findCardByName('aspiring-challenger');
                this.mirumotoRaitsugu = this.player2.findCardByName('mirumoto-raitsugu');
                this.doomedShugenja = this.player2.findCardByName('doomed-shugenja');
                this.togashiInitiate = this.player2.findCardByName('togashi-initiate');
            });

            it('should not be able to be triggered outside of a conflict', function() {
                this.player1.clickCard(this.aspiringChallenger);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('it should prompt to target a participating character', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.aspiringChallenger],
                    defenders: [this.mirumotoRaitsugu, this.doomedShugenja],
                    type: 'political'
                });
                this.player2.pass();
                this.player1.clickCard(this.aspiringChallenger);
                expect(this.player1).toHavePrompt('Aspiring Challenger');
                expect(this.player1).toBeAbleToSelect(this.mirumotoRaitsugu);
                expect(this.player1).toBeAbleToSelect(this.doomedShugenja);
                expect(this.player1).not.toBeAbleToSelect(this.togashiInitiate);
            });

            it('the winner of the duel should be honored', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.aspiringChallenger],
                    defenders: [this.mirumotoRaitsugu, this.doomedShugenja],
                    type: 'political'
                });
                this.player2.pass();
                this.player1.clickCard(this.aspiringChallenger);
                this.player1.clickCard(this.mirumotoRaitsugu);
                this.player1.clickPrompt('5');
                this.player2.clickPrompt('1');
                expect(this.aspiringChallenger.isHonored).toBe(true);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });
        });
    });
});
