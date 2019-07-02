describe('Isawa Tadaka 2', function() {
    integration(function() {
        describe('Isawa Tadaka 2\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['isawa-tadaka-2'],
                        dynastyDiscard: ['adept-of-the-waves', 'solemn-scholar', 'favorable-ground']
                    },
                    player2: {
                        hand: ['ornate-fan', 'fine-katana', 'banzai']
                    }
                });

                this.isawaTadaka = this.player1.findCardByName('isawa-tadaka-2');
                this.adeptOfTheWaves = this.player1.findCardByName('adept-of-the-waves', 'dynasty discard pile');
                this.solemnScholar = this.player1.findCardByName('solemn-scholar', 'dynasty discard pile');
                this.favorableGround = this.player1.findCardByName('favorable-ground', 'dynasty discard pile');
            });

            it('should prompt to discard characters from the dynasty discard pile', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.isawaTadaka],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.isawaTadaka);
                expect(this.player1).toHavePrompt('Select card to remove from game');
                expect(this.player1).toBeAbleToSelect(this.adeptOfTheWaves);
                expect(this.player1).toBeAbleToSelect(this.solemnScholar);
                expect(this.player1).not.toBeAbleToSelect(this.favorableGround);
            });

            it('should not allow you to not choose a character to remove from the game', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.isawaTadaka],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.isawaTadaka);
                expect(this.player1).not.toHavePromptButton('Done');
                this.player1.clickCard(this.adeptOfTheWaves);
                expect(this.player1).toHavePromptButton('Done');
                this.player1.clickCard(this.adeptOfTheWaves);
                expect(this.player1).not.toHavePromptButton('Done');
            });

            it('should remove the chosen cards from the game', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.isawaTadaka],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.isawaTadaka);
                this.player1.clickCard(this.adeptOfTheWaves);
                this.player1.clickPrompt('Done');
                expect(this.adeptOfTheWaves.location).toBe('removed from game');
                expect(this.solemnScholar.location).toBe('dynasty discard pile');
                expect(this.getChatLogs(1)).toContain('player1 uses Isawa Tadaka, removing Adept of the Waves from the game to look at 1 random card in player2\'s hand');
            });

            it('should prompt to choose a card to discard from that number of randomly chosen cards in your opponent\'s hand', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.isawaTadaka],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.isawaTadaka);
                this.player1.clickCard(this.adeptOfTheWaves);
                this.player1.clickCard(this.solemnScholar);
                this.player1.clickPrompt('Done');
                expect(this.player1).toHavePrompt('Select a card:');
                let matchingButtons = this.player1.currentPrompt().buttons.filter(button =>
                    ['Ornate Fan', 'Fine Katana', 'Banzai!'].includes(button.text)
                );
                expect(matchingButtons.length).toBe(2);
                expect(this.player1.currentPrompt().buttons.length).toBe(2);
                let conflictDiscardPileSize = this.player2.player.conflictDiscardPile.size();
                let hand = this.player2.player.hand.size();
                this.player1.clickPrompt(matchingButtons[0].text);
                expect(this.player2.player.conflictDiscardPile.size()).toBe(conflictDiscardPileSize + 1);
                expect(this.player2.player.hand.size()).toBe(hand - 1);
                expect(this.getChatLogs(3)).toContain('player1 chooses ' + matchingButtons[0].text + ' to be discarded from ' + matchingButtons[0].text + ' and ' + matchingButtons[1].text);
            });
        });
    });
});

