describe('Steward of the Rich Frog', function() {
    integration(function() {
        describe('when a player tries to dishonor a character owned by a player with Steward\'s effect ACTIVE and having exactly 1 more card when trying to play his card.', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['steward-of-the-rich-frog', 'ikoma-prodigy'],
                        hand: ['fine-katana', 'forged-edict', 'clarity-of-purpose']
                    },
                    player2: {
                        inPlay: ['bayushi-liar', 'alibi-artist'],
                        hand: ['for-shame', 'court-games', 'make-an-opening', 'fine-katana']
                    }
                });
                this.stewardOfTheRichFrog = this.player1.findCardByName('steward-of-the-rich-frog');
                this.ikomaProdigy = this.player1.findCardByName('ikoma-prodigy');
                this.bayushiLiar = this.player2.findCardByName('bayushi-liar');

                this.forgedEdict = this.player1.findCardByName('forged-edict');

                this.forShame = this.player2.findCardByName('for-shame');
                this.courtGames = this.player2.findCardByName('court-games');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.stewardOfTheRichFrog, this.ikomaProdigy],
                    defenders: [this.bayushiLiar]
                });
            });

            it('When playing For Shame! Steward of the Rich Frog should get bowed automatically', function() {
                this.player2.clickCard(this.forShame);
                this.player2.clickCard(this.stewardOfTheRichFrog);

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.forgedEdict);

                this.player1.clickPrompt('Pass');

                expect(this.player1).not.toHavePromptButton('Dishonor this character');
                expect(this.player1).not.toHavePromptButton('Bow this character');

                expect(this.stewardOfTheRichFrog.bowed).toBe(true);
            });

            it('When playing For Shame! any other character of the Steward\'s Controller should get bowed automatically', function() {
                this.player2.clickCard(this.forShame);
                this.player2.clickCard(this.ikomaProdigy);

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.forgedEdict);

                this.player1.clickPrompt('Pass');

                expect(this.player1).not.toHavePromptButton('Dishonor this character');
                expect(this.player1).not.toHavePromptButton('Bow this character');

                expect(this.ikomaProdigy.bowed).toBe(true);
            });

            it('When attempted to play Court Games he only has the option of Honoring his own character if allowed to resolve', function() {
                this.player2.clickCard(this.courtGames);

                expect(this.player2).toHavePromptButton('Honor a friendly character');
                expect(this.player2).not.toHavePromptButton('Dishonor an opposing character');
                this.player2.clickPrompt('Honor a friendly character');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.forgedEdict);
                expect(this.player1).toHavePromptButton('Pass');

                this.player1.clickPrompt('Pass');

                this.player2.clickCard(this.bayushiLiar);
                expect(this.bayushiLiar.isHonored).toBe(true);
            });

            it('when the opponent attempts to play Court Games, the player controlling steward can dishonor his character to play Forged Edict, because by the time interrupt windows are available the opponents hand size has decreased', function() {
                this.player2.clickCard(this.courtGames);

                expect(this.player2).toHavePromptButton('Honor a friendly character');
                expect(this.player2).not.toHavePromptButton('Dishonor an opposing character');
                this.player2.clickPrompt('Honor a friendly character');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.forgedEdict);
                expect(this.player1).toHavePromptButton('Pass');

                this.player1.clickCard(this.forgedEdict);
                this.player1.clickCard(this.ikomaProdigy);

                expect(this.player1).toHavePrompt('Conflict Action Window');

                expect(this.ikomaProdigy.isDishonored).toBe(true);
                expect(this.bayushiLiar.isHonored).toBe(false);
            });
        });
        describe('when a player tries to dishonor a character owned by a player with Steward\'s effect INACTIVE', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['steward-of-the-rich-frog', 'ikoma-prodigy'],
                        hand: ['fine-katana', 'forged-edict', 'clarity-of-purpose']
                    },
                    player2: {
                        inPlay: ['bayushi-liar', 'alibi-artist'],
                        hand: ['for-shame', 'court-games', 'make-an-opening']
                    }
                });
                this.stewardOfTheRichFrog = this.player1.findCardByName('steward-of-the-rich-frog');
                this.ikomaProdigy = this.player1.findCardByName('ikoma-prodigy');
                this.bayushiLiar = this.player2.findCardByName('bayushi-liar');

                this.forgedEdict = this.player1.findCardByName('forged-edict');

                this.forShame = this.player2.findCardByName('for-shame');
                this.courtGames = this.player2.findCardByName('court-games');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.stewardOfTheRichFrog, this.ikomaProdigy],
                    defenders: [this.bayushiLiar]
                });
            });

            it('when playing For Shame! the Steward should get the choice to be bowed or dishonored', function() {
                this.player2.clickCard(this.forShame);
                this.player2.clickCard(this.stewardOfTheRichFrog);

                expect(this.player1).toHavePromptButton('Dishonor this character');
                expect(this.player1).toHavePromptButton('Bow this character');
            });

            it('when playing For Shame! any other character owned by Steward\'s controller should get the choice to be bowed or dishonored', function() {
                this.player2.clickCard(this.forShame);
                this.player2.clickCard(this.stewardOfTheRichFrog);

                expect(this.player1).toHavePromptButton('Dishonor this character');
                expect(this.player1).toHavePromptButton('Bow this character');
            });

            it('when attempted to play Court Games he has the option of honoring or dishonoring', function() {
                this.player2.clickCard(this.courtGames);

                expect(this.player2).toHavePromptButton('Honor a friendly character');
                expect(this.player2).toHavePromptButton('Dishonor an opposing character');

                this.player2.clickPrompt('Dishonor an opposing character');

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.forgedEdict);

                this.player1.clickPrompt('Pass');

                this.player1.clickCard(this.stewardOfTheRichFrog);

                expect(this.stewardOfTheRichFrog.isDishonored).toBe(true);
            });

            it('when the opponent attempts to play Court Games, the player controlling Steward can dishonor his character to play Forged Edict', function() {
                this.player2.clickCard(this.courtGames);

                expect(this.player2).toHavePromptButton('Honor a friendly character');
                expect(this.player2).toHavePromptButton('Dishonor an opposing character');

                this.player2.clickPrompt('Dishonor an opposing character');

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.forgedEdict);

                this.player1.clickCard(this.forgedEdict);
                this.player1.clickCard(this.stewardOfTheRichFrog);

                expect(this.stewardOfTheRichFrog.isDishonored).toBe(true);
            });
        });
    });
});
