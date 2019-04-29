describe('Honest Challenger', function() {
    integration(function() {
        describe('Honest Challenger', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'draw',
                    player1: {
                        inPlay: ['honest-challenger']
                    },
                    player2: {
                        inPlay: []
                    }
                });
                this.honestChallenger = this.player1.findCardByName('honest-challenger');
            });

            it('should have +2 mil if controller has composure', function() {
                let military = this.honestChallenger.getMilitarySkill();
                expect(this.player1.player.hasComposure()).toBe(false);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('2');
                expect(this.player1.player.hasComposure()).toBe(true);
                expect(this.honestChallenger.getMilitarySkill()).toBe(military + 2);
            });
        });

        describe('when the target leaves play during the duel', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 11,
                        inPlay: ['honest-challenger', 'moto-youth', 'utaku-infantry']
                    },
                    player2: {
                        honor: 11,
                        inPlay: ['obstinate-recruit']
                    }
                });
                this.honestChallenger = this.player1.findCardByName('honest-challenger');
                this.motoYouth = this.player1.findCardByName('moto-youth');
                this.utakuInfantry = this.player1.findCardByName('utaku-infantry');
                this.obstinateRecruit = this.player2.findCardByName('obstinate-recruit');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.honestChallenger],
                    defenders: [this.obstinateRecruit],
                    type: 'political'
                });
                this.player2.pass();
            });

            it('the duel should still successfully resolve', function() {
                this.player1.clickCard(this.honestChallenger);
                this.player1.clickCard(this.obstinateRecruit);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('2');
                expect(this.player1).toHavePrompt('Choose a character to move to the conflict');
                expect(this.player1).toBeAbleToSelect(this.motoYouth);
                expect(this.player1).toBeAbleToSelect(this.utakuInfantry);
                expect(this.player1).not.toBeAbleToSelect(this.honestChallenger);
                expect(this.player1).not.toBeAbleToSelect(this.obstinateRecruit);
                expect(this.obstinateRecruit.location).toBe('dynasty discard pile');
                this.player1.clickCard(this.motoYouth);
                expect(this.motoYouth.inConflict).toBe(true);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });
        });

        describe('Honest Challenger\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['honest-challenger', 'moto-youth', 'utaku-infantry']
                    },
                    player2: {
                        inPlay: ['mirumoto-raitsugu', 'doomed-shugenja', 'togashi-initiate']
                    }
                });
                this.honestChallenger = this.player1.findCardByName('honest-challenger');
                this.motoYouth = this.player1.findCardByName('moto-youth');
                this.utakuInfantry = this.player1.findCardByName('utaku-infantry');
                this.mirumotoRaitsugu = this.player2.findCardByName('mirumoto-raitsugu');
                this.doomedShugenja = this.player2.findCardByName('doomed-shugenja');
                this.togashiInitiate = this.player2.findCardByName('togashi-initiate');
            });

            it('should not be able to be triggered outside of a conflict', function() {
                this.player1.clickCard(this.honestChallenger);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should not be able to be triggered if Honest Challenger is not participating', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.motoYouth],
                    defenders: [this.mirumotoRaitsugu],
                    type: 'military'
                });
                this.player2.pass();
                this.player1.clickCard(this.honestChallenger);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('the winner of the duel should move a character from home to the conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.honestChallenger],
                    defenders: [this.mirumotoRaitsugu],
                    type: 'political'
                });
                this.player2.pass();
                this.chat = spyOn(this.game, 'addMessage');
                this.player1.clickCard(this.honestChallenger);
                this.player1.clickCard(this.mirumotoRaitsugu);
                this.player1.clickPrompt('5');
                this.player2.clickPrompt('1');
                expect(this.player1).toHavePrompt('Choose a character to move to the conflict');
                expect(this.player1).toBeAbleToSelect(this.motoYouth);
                expect(this.player1).toBeAbleToSelect(this.utakuInfantry);
                expect(this.player1).not.toBeAbleToSelect(this.honestChallenger);
                expect(this.player1).not.toBeAbleToSelect(this.mirumotoRaitsugu);
                expect(this.player1).not.toBeAbleToSelect(this.doomedShugenja);
                expect(this.player1).not.toBeAbleToSelect(this.togashiInitiate);
                this.player1.clickCard(this.motoYouth);
                expect(this.motoYouth.inConflict).toBe(true);
                expect(this.chat).toHaveBeenCalledWith('{0} moves {1} to the conflict', this.player1.player, this.motoYouth);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should not prompt if there is no target for the duel resolution', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.honestChallenger, this.motoYouth, this.utakuInfantry],
                    defenders: [this.mirumotoRaitsugu],
                    type: 'political'
                });
                this.player2.pass();
                this.chat = spyOn(this.game, 'addMessage');
                this.player1.clickCard(this.honestChallenger);
                this.player1.clickCard(this.mirumotoRaitsugu);
                this.player1.clickPrompt('5');
                this.player2.clickPrompt('1');
                expect(this.player1).not.toHavePrompt('Choose a character to move to the conflict');
                expect(this.chat).toHaveBeenCalledWith('The duel has no effect');
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('if opponent wins, the winner of the duel should move a character from home to the conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.honestChallenger],
                    defenders: [this.mirumotoRaitsugu],
                    type: 'political'
                });
                this.player2.pass();
                this.chat = spyOn(this.game, 'addMessage');
                this.player1.clickCard(this.honestChallenger);
                this.player1.clickCard(this.mirumotoRaitsugu);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('5');
                expect(this.player2).toHavePrompt('Choose a character to move to the conflict');
                expect(this.player2).not.toBeAbleToSelect(this.motoYouth);
                expect(this.player2).not.toBeAbleToSelect(this.utakuInfantry);
                expect(this.player2).not.toBeAbleToSelect(this.honestChallenger);
                expect(this.player2).not.toBeAbleToSelect(this.mirumotoRaitsugu);
                expect(this.player2).toBeAbleToSelect(this.doomedShugenja);
                expect(this.player2).toBeAbleToSelect(this.togashiInitiate);
                this.player2.clickCard(this.doomedShugenja);
                expect(this.doomedShugenja.inConflict).toBe(true);
                expect(this.chat).toHaveBeenCalledWith('Honest Challenger: 5 vs 8: Mirumoto Raitsugu');
                expect(this.chat).toHaveBeenCalledWith('{0} moves {1} to the conflict', this.player2.player, this.doomedShugenja);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });
        });

    });
});
