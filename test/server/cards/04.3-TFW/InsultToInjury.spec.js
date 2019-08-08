describe('Insult to Injury', function() {
    integration(function() {
        describe('Insult to Injury\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-hotaru', 'doji-challenger', 'mirumoto-hitomi'],
                        hand: ['insult-to-injury', 'policy-debate']
                    },
                    player2: {
                        inPlay: ['mirumoto-raitsugu', 'mirumoto-hitomi']
                    }
                });
                this.noMoreActions();
                this.dojiHotaru = this.player1.findCardByName('doji-hotaru');
                this.dojiChallenger = this.player1.findCardByName('doji-challenger');
                this.mirumotoHitomiP1 = this.player1.findCardByName('mirumoto-hitomi');
                this.insultToInjury = this.player1.findCardByName('insult-to-injury');
                this.policyDebate = this.player1.findCardByName('policy-debate');
                this.mirumotoRaitsugu = this.player2.findCardByName('mirumoto-raitsugu');
                this.mirumotoHitomiP2 = this.player2.findCardByName('mirumoto-hitomi');

                this.initiateConflict({
                    attackers: [this.dojiHotaru, this.dojiChallenger, this.mirumotoHitomiP1],
                    defenders: [this.mirumotoRaitsugu, this.mirumotoHitomiP2]
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
                    expect(this.mirumotoRaitsugu.isDishonored).toBe(true);
                    expect(this.getChatLogs(4)).toContain('player1 plays Insult to Injury to dishonor Mirumoto Raitsugu');
                });
            });

            it('should trigger if there is more than one winner of the duel and at least one is a duelist', function() {
                this.player2.clickCard(this.mirumotoHitomiP2);
                this.player2.clickCard(this.dojiHotaru);
                this.player2.clickCard(this.dojiChallenger);
                this.player2.clickPrompt('Done');
                this.player1.clickPrompt('5');
                this.player2.clickPrompt('1');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.insultToInjury);
            });

            it('should prompt to choose which loser to dishonor if there is more than 1 loser', function() {
                this.player2.pass();
                this.player1.clickCard(this.mirumotoHitomiP1);
                this.player1.clickCard(this.mirumotoRaitsugu);
                this.player1.clickCard(this.mirumotoHitomiP2);
                this.player1.clickPrompt('Done');
                this.player1.clickPrompt('5');
                this.player2.clickPrompt('1');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.insultToInjury);
                this.player1.clickCard(this.insultToInjury);
                expect(this.player1).toHavePrompt('Choose a character to dishonor');
                expect(this.player1).toHavePromptButton('Mirumoto Raitsugu');
                expect(this.player1).toHavePromptButton('Mirumoto Hitomi');
                this.player1.clickPrompt('Mirumoto Raitsugu');
                expect(this.mirumotoRaitsugu.isDishonored).toBe(true);
                expect(this.mirumotoHitomiP2.isDishonored).toBe(false);
                expect(this.getChatLogs(3)).toContain('player1 plays Insult to Injury to choose to dishonor a loser of the duel');
                expect(this.getChatLogs(2)).toContain('player1 chooses to dishonor Mirumoto Raitsugu');
            });
        });
    });
});
