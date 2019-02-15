describe('Courtly Challenger', function() {
    integration(function() {
        describe('Courtly Challenger', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['courtly-challenger']
                    },
                    player2: {
                        inPlay: ['doomed-shugenja'],
                        hand: ['policy-debate']
                    }
                });
                this.courtlyChallenger = this.player1.findCardByName('courtly-challenger');
                this.doomedShugenja = this.player2.findCardByName('doomed-shugenja');
                this.policyDebate = this.player2.findCardByName('policy-debate');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.courtlyChallenger],
                    defenders: [this.doomedShugenja],
                    type: 'political'
                });
            });

            it('should be honored after it wins a duel', function() {
                this.player2.clickCard(this.policyDebate);
                this.player2.clickCard(this.doomedShugenja);
                this.player2.clickCard(this.courtlyChallenger);
                this.player1.clickPrompt('5');
                this.player2.clickPrompt('1');
                expect(this.courtlyChallenger.isHonored).toBe(true);
            });

            it('should be dishonored after it loses a duel', function() {
                this.player2.clickCard(this.policyDebate);
                this.player2.clickCard(this.doomedShugenja);
                this.player2.clickCard(this.courtlyChallenger);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('5');
                expect(this.courtlyChallenger.isDishonored).toBe(true);
            });

        });

        describe('when the target leaves play during the duel', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 11,
                        inPlay: ['courtly-challenger']
                    },
                    player2: {
                        honor: 11,
                        inPlay: ['obstinate-recruit']
                    }
                });
                this.courtlyChallenger = this.player1.findCardByName('courtly-challenger');
                this.obstinateRecruit = this.player2.findCardByName('obstinate-recruit');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.courtlyChallenger],
                    defenders: [this.obstinateRecruit],
                    type: 'political'
                });
                this.player2.pass();
            });

            it('the duel should still successfully resolve', function() {
                let handSize = this.player1.player.hand.size();
                this.player1.clickCard(this.courtlyChallenger);
                this.player1.clickCard(this.obstinateRecruit);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('2');
                expect(this.player1.player.hand.size()).toBe(handSize + 2);
                expect(this.courtlyChallenger.isHonored).toBe(true);
                expect(this.obstinateRecruit.location).toBe('dynasty discard pile');
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });
        });

        describe('Courtly Challenger\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['courtly-challenger']
                    },
                    player2: {
                        inPlay: ['mirumoto-raitsugu']
                    }
                });
                this.courtlyChallenger = this.player1.findCardByName('courtly-challenger');
                this.mirumotoRaitsugu = this.player2.findCardByName('mirumoto-raitsugu');
            });

            it('should not be able to be triggered outside of a conflict', function() {
                this.player1.clickCard(this.courtlyChallenger);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('the winner of the duel should draw 2 cards', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.courtlyChallenger],
                    defenders: [this.mirumotoRaitsugu],
                    type: 'political'
                });
                this.player2.pass();
                let handSize = this.player2.player.hand.size();
                this.player1.clickCard(this.courtlyChallenger);
                this.player1.clickCard(this.mirumotoRaitsugu);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('5');
                expect(this.player2.player.hand.size()).toBe(handSize + 2);
            });

        });
    });
});
