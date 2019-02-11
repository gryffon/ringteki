describe('Insult to Injury', function() {
    integration(function() {
        describe('Insult to Injury\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-hotaru', 'doji-challenger'],
                        hand: ['insult-to-injury','policy-debate']
                    },
                    player2: {
                        inPlay: ['mirumoto-raitsugu']
                    }
                });
                this.noMoreActions();
                this.dojiHotaru = this.player1.findCardByName('doji-hotaru');
                this.dojiChallenger = this.player1.findCardByName('doji-challenger');
                this.insultToInjury = this.player1.findCardByName('insult-to-injury');
                this.policyDebate = this.player1.findCardByName('policy-debate');
                this.mirumotoRaitsugu = this.player2.findCardByName('mirumoto-raitsugu');

                this.initiateConflict({
                    attackers: [this.dojiHotaru, this.dojiChallenger],
                    defenders: [this.mirumotoRaitsugu]
                });
            });

            it('should be selectable when a card you control with the \'duelist\' trait wins a duel', function () {
                this.player2.pass();
                this.player1.clickCard(this.policyDebate);
                this.player1.clickCard(this.dojiChallenger);
                this.player1.clickCard(this.mirumotoRaitsugu);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.insultToInjury);
            });

            it('should not be selectable when a card you control that does not have the \'duelist\' trait wins a duel', function() {
                this.player2.pass();
                this.player1.clickCard(this.policyDebate);
                this.player1.clickCard(this.dojiHotaru);
                this.player1.clickCard(this.mirumotoRaitsugu);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).not.toBeAbleToSelect(this.insultToInjury);
            });

            it('should not be selectable when you lose a duel', function() {
                this.player2.pass();
                this.player1.clickCard(this.policyDebate);
                this.player1.clickCard(this.dojiChallenger);
                this.player1.clickCard(this.mirumotoRaitsugu);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('5');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).not.toBeAbleToSelect(this.insultToInjury);
            });

            it('should be selectable if you win a duel initiated by your opponent', function() {
                this.player2.clickCard(this.mirumotoRaitsugu);
                this.player2.clickCard(this.dojiChallenger);
                this.player2.clickPrompt('1');
                this.player1.clickPrompt('2');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.insultToInjury);
            });

            describe('if it resolves', function () {
                beforeEach(function () {
                    this.player2.pass();
                    this.player1.clickCard(this.policyDebate);
                    this.player1.clickCard(this.dojiChallenger);
                    this.player1.clickCard(this.mirumotoRaitsugu);
                    this.player1.clickPrompt('1');
                    this.player2.clickPrompt('1');
                    this.player1.clickCard(this.insultToInjury);
                });

                it('should dishonor the loser of the duel', function () {
                    expect(this.mirumotoRaitsugu.isDishonored).toBeTruthy();
                });
            });
        });
    });
});
