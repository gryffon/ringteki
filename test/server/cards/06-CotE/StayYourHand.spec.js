describe('Stay Your Hand', function() {
    integration(function() {
        describe('Stay Your Hand', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['honest-challenger', 'brash-samurai'],
                        hand: ['stay-your-hand', 'game-of-sadane']
                    },
                    player2: {
                        inPlay: ['mirumoto-raitsugu', 'mirumoto-hitomi'],
                        hand: ['policy-debate']
                    }
                });
                this.honestChallenger = this.player1.findCardByName('honest-challenger');
                this.brashSamurai = this.player1.findCardByName('brash-samurai');
                this.stayYourHand = this.player1.findCardByName('stay-your-hand');
                this.gameOfSadane = this.player1.findCardByName('game-of-sadane');

                this.mirumotoRaitsugu = this.player2.findCardByName('mirumoto-raitsugu');
                this.mirumotoHitomi = this.player2.findCardByName('mirumoto-hitomi');
                this.policyDebate = this.player2.findCardByName('policy-debate');
            });

            it('should trigger when a duel is to be initiated by an opponent\'s character', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.honestChallenger],
                    defenders: [this.mirumotoRaitsugu]
                });
                this.player2.clickCard(this.mirumotoRaitsugu);
                this.player2.clickCard(this.honestChallenger);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.stayYourHand);
            });

            it('should not trigger when a duel is to be initiated by you', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.honestChallenger],
                    defenders: [this.mirumotoRaitsugu]
                });
                this.player2.pass();
                this.player1.clickCard(this.gameOfSadane);
                this.player1.clickCard(this.honestChallenger);
                this.player1.clickCard(this.mirumotoRaitsugu);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).not.toBeAbleToSelect(this.stayYourHand);
                expect(this.player1).toHavePrompt('Choose your bid for the duel\nHonest Challenger: 2 vs 2: Mirumoto Raitsugu');
            });

            it('should trigger when a duel is to be initiated by an opponent\'s event', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.honestChallenger],
                    defenders: [this.mirumotoRaitsugu]
                });
                this.player2.clickCard(this.policyDebate);
                this.player2.clickCard(this.mirumotoRaitsugu);
                this.player2.clickCard(this.honestChallenger);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.stayYourHand);
            });

            it('should cancel the duel', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.honestChallenger],
                    defenders: [this.mirumotoRaitsugu]
                });
                this.player2.clickCard(this.mirumotoRaitsugu);
                this.player2.clickCard(this.honestChallenger);
                this.player1.clickCard(this.stayYourHand);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.getChatLogs(3)).toContain('player1 plays Stay Your Hand to cancel the duel originating from Mirumoto Raitsugu');
            });

            it('should trigger when a duel targets multiple characters of yours', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.honestChallenger, this.brashSamurai],
                    defenders: [this.mirumotoRaitsugu, this.mirumotoHitomi]
                });
                this.player2.clickCard(this.mirumotoHitomi);
                this.player2.clickCard(this.honestChallenger);
                this.player2.clickCard(this.brashSamurai);
                this.player2.clickPrompt('Done');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.stayYourHand);
            });
        });
    });
});
