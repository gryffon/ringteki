describe('Daring Challenger', function() {
    integration(function() {
        describe('Daring Challenger', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'draw',
                    player1: {
                        inPlay: ['daring-challenger']
                    },
                    player2: {
                        inPlay: ['doomed-shugenja']
                    }
                });
                this.daringChallenger = this.player1.findCardByName('daring-challenger');
                this.doomedShugenja = this.player2.findCardByName('doomed-shugenja');
            });

            it('should have +1 military skill if controller is less honorable', function() {
                this.player1.clickPrompt('2');
                this.player2.clickPrompt('1');
                expect(this.player1.player.honor).toBeLessThan(this.player2.player.honor);
                let baseMilitarySkill = this.daringChallenger.getBaseMilitarySkill();
                expect(baseMilitarySkill).toBe(2);
                expect(this.daringChallenger.getMilitarySkill()).toBe(baseMilitarySkill + 1);
            });

            it('should not have +1 military skill if controller is equally honorable', function() {
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                expect(this.player1.player.honor).toBe(this.player2.player.honor);
                let baseMilitarySkill = this.daringChallenger.getBaseMilitarySkill();
                expect(baseMilitarySkill).toBe(2);
                expect(this.daringChallenger.getMilitarySkill()).toBe(baseMilitarySkill);
            });

            it('should not have +1 military skill if controller is more honorable', function() {
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('2');
                expect(this.player1.player.honor).toBeGreaterThan(this.player2.player.honor);
                let baseMilitarySkill = this.daringChallenger.getBaseMilitarySkill();
                expect(baseMilitarySkill).toBe(2);
                expect(this.daringChallenger.getMilitarySkill()).toBe(baseMilitarySkill);
            });
        });

        describe('when the target leaves play during the duel', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 11,
                        inPlay: ['daring-challenger']
                    },
                    player2: {
                        honor: 11,
                        inPlay: ['obstinate-recruit']
                    }
                });
                this.daringChallenger = this.player1.findCardByName('daring-challenger');
                this.obstinateRecruit = this.player2.findCardByName('obstinate-recruit');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.daringChallenger],
                    defenders: [this.obstinateRecruit]
                });
                this.player2.pass();
            });

            it('the duel should still successfully resolve', function() {
                this.player1.clickCard(this.daringChallenger);
                this.player1.clickCard(this.obstinateRecruit);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('5');
                expect(this.daringChallenger.fate).toBe(1);
                expect(this.obstinateRecruit.location).toBe('dynasty discard pile');
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });
        });

        describe('Daring Challenger\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['daring-challenger']
                    },
                    player2: {
                        inPlay: ['mirumoto-raitsugu']
                    }
                });
                this.daringChallenger = this.player1.findCardByName('daring-challenger');
                this.mirumotoRaitsugu = this.player2.findCardByName('mirumoto-raitsugu');
            });

            it('should not be able to be triggered outside of a conflict', function() {
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.daringChallenger);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should place 1 fate on the winner', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.daringChallenger],
                    defenders: [this.mirumotoRaitsugu]
                });
                this.player2.pass();
                this.player1.clickCard(this.daringChallenger);
                this.player1.clickCard(this.mirumotoRaitsugu);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('5');
                expect(this.daringChallenger.fate).toBe(0);
                expect(this.mirumotoRaitsugu.fate).toBe(1);
            });
        });
    });
});
