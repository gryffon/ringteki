describe('Forebearer\'s Echoes', function() {
    integration(function() {
        describe('Forebearer\'s Echoes ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-challenger'],
                        hand: ['forebearer-s-echoes'],
                        dynastyDiscard: ['doji-whisperer', 'favorable-ground'],
                        conflictDiscard: ['steward-of-law']
                    },
                    player2: {
                        inPlay: ['mirumoto-raitsugu', 'sincere-challenger'],
                        hand: ['assassination']
                    }
                });
                this.dojiChallenger = this.player1.findCardByName('doji-challenger');
                this.dojiWhisperer = this.player1.findCardByName('doji-whisperer');
                this.favorableGround = this.player1.findCardByName('favorable-ground');
                this.stewardOfLaw = this.player1.findCardByName('steward-of-law');
                this.forebearersEchoes = this.player1.findCardByName('forebearer-s-echoes');

                this.mirumotoRaitsugu = this.player2.findCardByName('mirumoto-raitsugu');
                this.sincereChallenger = this.player2.findCardByName('sincere-challenger');
                this.assassination = this.player2.findCardByName('assassination');
            });

            it('should not be able to be triggered outside of a military conflict', function() {
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.forebearersEchoes);
                expect(this.player1).toHavePrompt('Action Window');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.dojiChallenger],
                    defenders: [],
                    type: 'political'
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.forebearersEchoes);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should prompt to choose a character in your dynasty discard pile that could move to the conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.dojiChallenger],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.forebearersEchoes);
                expect(this.player1).toHavePrompt('Choose a character from your dynasty discard pile');
                expect(this.player1).toBeAbleToSelect(this.dojiWhisperer);
                expect(this.player1).not.toBeAbleToSelect(this.dojiChallenger);
                expect(this.player1).not.toBeAbleToSelect(this.favorableGround);
                expect(this.player1).not.toBeAbleToSelect(this.stewardOfLaw);
            });

            it('should move the chosen character to the conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.dojiChallenger],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.forebearersEchoes);
                this.player1.clickCard(this.dojiWhisperer);
                expect(this.dojiWhisperer.location).toBe('play area');
                expect(this.dojiWhisperer.isParticipating()).toBe(true);
                expect(this.getChatLogs(3)).toContain('player1 plays Forebearer\'s Echoes to put Doji Whisperer into play in the conflict and apply a lasting effect to Doji Whisperer');
            });

            it('should return the target to the bottom of the deck at the end of the conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.dojiChallenger],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.forebearersEchoes);
                this.player1.clickCard(this.dojiWhisperer);
                this.noMoreActions();
                this.player1.clickPrompt('Yes');
                this.player1.clickPrompt('Don\'t Resolve');
                expect(this.dojiWhisperer.location).toBe('dynasty deck');
                expect(this.player1.dynastyDeck[this.player1.dynastyDeck.length - 1]).toBe(this.dojiWhisperer);
                expect(this.getChatLogs(1)).toContain('Doji Whisperer returns to the bottom of the dynasty deck due to the delayed effect of Forebearer\'s Echoes');
            });

            it('should not return the target to the bottom of the deck at the end of the conflict if it is no longer in play', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.dojiChallenger],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.forebearersEchoes);
                this.player1.clickCard(this.dojiWhisperer);
                this.player2.clickCard(this.assassination);
                this.player2.clickCard(this.dojiWhisperer);
                expect(this.dojiWhisperer.location).toBe('dynasty discard pile');
                this.noMoreActions();
                this.player1.clickPrompt('Yes');
                this.player1.clickPrompt('Don\'t Resolve');
                expect(this.dojiWhisperer.location).toBe('dynasty discard pile');
            });
        });
    });
});
