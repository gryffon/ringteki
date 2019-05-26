describe('Softskin', function() {
    integration(function() {
        describe('Softskin\'s constant ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        hand: ['softskin', 'against-the-waves']
                    },
                    player2: {
                        inPlay: ['adept-of-the-waves'],
                        hand: ['against-the-waves']
                    }
                });

                this.softskin = this.player1.findCardByName('softskin');
                this.againstTheWaves1 = this.player1.findCardByName('against-the-waves');

                this.adeptOfTheWaves = this.player2.findCardByName('adept-of-the-waves');
                this.adeptOfTheWaves.fate = 2;
                this.againstTheWaves2 = this.player2.findCardByName('against-the-waves');

                this.player1.clickCard(this.softskin);
                this.player1.clickCard(this.adeptOfTheWaves);
                this.player2.pass();
                this.player1.clickCard(this.againstTheWaves1);
                this.player1.clickCard(this.adeptOfTheWaves);
            });

            it('should \'trigger\' when a card attempts to ready due to a card effect', function() {
                this.player2.clickCard(this.againstTheWaves2);
                this.player2.clickCard(this.adeptOfTheWaves);
                expect(this.player2).toHavePrompt('Adept of the Waves');
            });

            it('should \'trigger\' when a card attempts to ready from a framework step', function() {
                this.advancePhases('regroup');
                expect(this.player2).toHavePrompt('Adept of the Waves');
            });

            it('should prompt the controller with the option to discard 3 cards', function() {
                this.player2.clickCard(this.againstTheWaves2);
                this.player2.clickCard(this.adeptOfTheWaves);
                expect(this.player2).toHavePrompt('Discard the top three cards of your conflict deck to ready this character?');
                expect(this.player2).toHavePromptButton('Yes');
                expect(this.player2).toHavePromptButton('No');
            });

            it('should prevent the attached character if the cost is refused', function() {
                this.player2.clickCard(this.againstTheWaves2);
                this.player2.clickCard(this.adeptOfTheWaves);
                this.player2.clickPrompt('No');
                expect(this.adeptOfTheWaves.bowed).toBe(true);
                expect(this.getChatLogs(1)).toContain('player2 chooses not to ready Adept of the Waves');
            });

            it('should allow the attached character to ready if 3 cards are discarded from the conflict deck', function() {
                let conflictDeckCount = this.player2.conflictDeck.length;
                this.player2.clickCard(this.againstTheWaves2);
                this.player2.clickCard(this.adeptOfTheWaves);
                this.player2.clickPrompt('Yes');
                expect(this.adeptOfTheWaves.bowed).toBe(false);
                expect(this.player2.conflictDeck.length).toBe(conflictDeckCount - 3);
                expect(this.getChatLogs(1)).toContain('player2 chooses to discard Supernatural Storm, Supernatural Storm and Supernatural Storm in order to ready Adept of the Waves');
            });

            it('should prevent the attached character from readying if there are fewer than 3 cards in the controller\'s conflict deck', function() {
                this.player2.reduceDeckToNumber('conflict deck', 2);
                expect(this.player2.conflictDeck.length).toBe(2);
                this.player2.clickCard(this.againstTheWaves2);
                this.player2.clickCard(this.adeptOfTheWaves);
                expect(this.getChatLogs(1)).toContain('player2 cannot pay the additional cost required to ready Adept of the Waves');
            });
        });
    });
});
