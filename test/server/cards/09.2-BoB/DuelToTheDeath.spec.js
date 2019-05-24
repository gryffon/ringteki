describe('Duel to the Death', function() {
    integration(function() {
        describe('Duel to the Death\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-challenger', 'doji-whisperer'],
                        hand: ['duel-to-the-death', 'steward-of-law']
                    },
                    player2: {
                        inPlay: ['mirumoto-raitsugu', 'ancient-master']
                    }
                });
                this.dojiChallenger = this.player1.findCardByName('doji-challenger');
                this.dojiWhisperer = this.player1.findCardByName('doji-whisperer');
                this.duelToTheDeath = this.player1.findCardByName('duel-to-the-death');
                this.stewardOfLaw = this.player1.findCardByName('steward-of-law');

                this.mirumotoRaitsugu = this.player2.findCardByName('mirumoto-raitsugu');
                this.ancientMaster = this.player2.findCardByName('ancient-master');
            });

            it('should not be able to be triggered outside of a conflict', function() {
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.duelToTheDeath);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should prompt to select a participating character on your side', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.dojiChallenger],
                    defenders: [this.mirumotoRaitsugu],
                    type: 'political'
                });
                this.player2.pass();
                this.player1.clickCard(this.duelToTheDeath);
                expect(this.player1).toHavePrompt('Choose a character');
                expect(this.player1).toBeAbleToSelect(this.dojiChallenger);
                expect(this.player1).not.toBeAbleToSelect(this.dojiWhisperer);
                expect(this.player1).not.toBeAbleToSelect(this.mirumotoRaitsugu);
                expect(this.player1).not.toBeAbleToSelect(this.ancientMaster);
            });

            it('should prompt to select a participating character on your opponent\'s side', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.dojiChallenger],
                    defenders: [this.mirumotoRaitsugu],
                    type: 'military'
                });
                this.player2.pass();
                this.player1.clickCard(this.duelToTheDeath);
                this.player1.clickCard(this.dojiChallenger);
                expect(this.player1).toHavePrompt('Choose a character');
                expect(this.player1).not.toBeAbleToSelect(this.dojiChallenger);
                expect(this.player1).not.toBeAbleToSelect(this.dojiWhisperer);
                expect(this.player1).toBeAbleToSelect(this.mirumotoRaitsugu);
                expect(this.player1).not.toBeAbleToSelect(this.ancientMaster);
            });

            it('should prompt your opponent to refuse the duel', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.dojiChallenger],
                    defenders: [this.mirumotoRaitsugu],
                    type: 'military'
                });
                this.player2.pass();
                this.player1.clickCard(this.duelToTheDeath);
                this.player1.clickCard(this.dojiChallenger);
                this.player1.clickCard(this.mirumotoRaitsugu);
                expect(this.player2).toHavePrompt('Do you wish to refuse the duel?');
                expect(this.player2).toHavePromptButton('Yes');
                expect(this.player2).toHavePromptButton('No');
            });

            it('should dishonor the duel target and end the duel with no effect if the duel is refused', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.dojiChallenger],
                    defenders: [this.mirumotoRaitsugu],
                    type: 'military'
                });
                this.player2.pass();
                this.player1.clickCard(this.duelToTheDeath);
                this.player1.clickCard(this.dojiChallenger);
                this.player1.clickCard(this.mirumotoRaitsugu);
                this.player2.clickPrompt('Yes');
                expect(this.mirumotoRaitsugu.isDishonored).toBe(true);
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.getChatLogs(5)).toContain('player2 chooses to refuse the duel and dishonor Mirumoto Raitsugu');
            });

            it('should not prompt your opponent if they cannot be dishonored', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.dojiChallenger],
                    defenders: [this.mirumotoRaitsugu],
                    type: 'military'
                });
                this.player2.pass();
                this.player1.clickCard(this.stewardOfLaw);
                this.player1.clickPrompt('0');
                this.player1.clickPrompt('Conflict');
                this.player2.pass();
                this.player1.clickCard(this.duelToTheDeath);
                this.player1.clickCard(this.dojiChallenger);
                this.player1.clickCard(this.mirumotoRaitsugu);
                expect(this.player1).toHavePrompt('Honor Bid');
                expect(this.player2).toHavePrompt('Honor Bid');
            });

            it('should discard the loser', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.dojiChallenger],
                    defenders: [this.mirumotoRaitsugu],
                    type: 'military'
                });
                this.player2.pass();
                this.player1.clickCard(this.duelToTheDeath);
                this.player1.clickCard(this.dojiChallenger);
                this.player1.clickCard(this.mirumotoRaitsugu);
                this.player2.clickPrompt('No');
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('5');
                expect(this.dojiChallenger.location).toBe('dynasty discard pile');
                expect(this.mirumotoRaitsugu.location).toBe('play area');
                expect(this.getChatLogs(5)).toContain('Duel Effect: discard Doji Challenger');
            });
        });
    });
});
