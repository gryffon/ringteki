describe('Stolen Secrets', function() {
    integration(function() {
        describe('Stolen Secret\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['favored-niece', 'soshi-illusionist'],
                        hand: ['stolen-secrets']
                    },
                    player2: {
                        hand: ['assassination', 'centipede-tattoo', 'mantra-of-fire', 'censure']
                    }
                });

                this.assassination = this.player2.findCardByName('assassination', 'hand');
                this.centipedeTattoo = this.player2.findCardByName('centipede-tattoo', 'hand');
                this.mantraOfFire = this.player2.findCardByName('mantra-of-fire', 'hand');
                this.censure = this.player2.findCardByName('censure', 'hand');

                this.player2.player.moveCard(this.assassination, 'conflict deck');
                this.player2.player.moveCard(this.centipedeTattoo, 'conflict deck');
                this.player2.player.moveCard(this.mantraOfFire, 'conflict deck');
                this.player2.player.moveCard(this.censure, 'conflict deck');

                this.favoredNiece = this.player1.findCardByName('favored-niece');
                this.favoredNiece.fate = 1;
                this.soshiIllusionist = this.player1.findCardByName('soshi-illusionist');
                this.stolenSecrets = this.player1.findCardByName('stolen-secrets');
            });

            it('should not be playable outside of a pol conflict', function () {
                this.player1.clickCard(this.stolenSecrets);
                expect(this.player1).toHavePrompt('Initiate an action');
            });

            it('should not be playable if you do not have a participating character with 1 or more fate', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: ['soshi-illusionist'],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.stolenSecrets);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            describe('during a pol conflict', function () {
                beforeEach(function () {
                    this.noMoreActions();
                    this.initiateConflict({
                        type: 'political',
                        attackers: ['favored-niece', 'soshi-illusionist'],
                        defenders: []
                    });
                    this.player2.pass();
                });

                it('should allow you to only target a participating character with 1 or more fate', function () {
                    this.player1.clickCard(this.stolenSecrets);
                    expect(this.player1).toBeAbleToSelect(this.favoredNiece);
                    expect(this.player1).not.toBeAbleToSelect(this.soshiIllusionist);
                });

                it('should not be playable if there are 0 cards in your opponent\'s deck', function () {
                    for(var i = this.player2.conflictDeck.length - 1; i >= 0; i--) {
                        this.player2.moveCard(this.player2.conflictDeck[i], 'hand');
                    }
                    expect(this.player2.conflictDeck.length).toBe(0);
                    this.player1.clickCard(this.stolenSecrets);
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                });

                describe('if costs are paid', function () {
                    beforeEach(function () {
                        this.player1.clickCard(this.stolenSecrets);
                        this.player1.clickCard(this.favoredNiece);
                    });

                    it('should remove a fate from the targeted character', function () {
                        expect(this.favoredNiece.fate).toBe(0);
                    });

                    it('should prompt to choose from (up to) the top 4 cards of your opponent', function () {
                        expect(this.player1).toHavePrompt('Choose a card to remove from the game');
                        expect(this.player1).toHavePromptButton(this.assassination.name);
                        expect(this.player1).toHavePromptButton(this.centipedeTattoo.name);
                        expect(this.player1).toHavePromptButton(this.mantraOfFire.name);
                        expect(this.player1).toHavePromptButton(this.censure.name);
                    });
                });

                describe('if there are 4 or more cards in deck', function () {
                    beforeEach(function () {
                        this.player1.clickCard(this.stolenSecrets);
                        this.player1.clickCard(this.favoredNiece);
                        this.player1.clickPrompt(this.assassination.name);
                    });

                    it('should prompt to place the remaining cards in an order', function () {
                        expect(this.player1).toHavePrompt('Which card do you want to be on top?');
                        expect(this.player1).toHavePromptButton(this.centipedeTattoo.name);
                        expect(this.player1).toHavePromptButton(this.mantraOfFire.name);
                        expect(this.player1).toHavePromptButton(this.censure.name);
                        this.player1.clickPrompt(this.mantraOfFire.name);
                        expect(this.player1).toHavePrompt('Which card do you want to be the second card?');
                        expect(this.player1).toHavePromptButton(this.censure.name);
                        expect(this.player1).toHavePromptButton(this.centipedeTattoo.name);
                        this.player1.clickPrompt(this.censure.name);
                    });
                });

                describe('if there are exacttly 2 cards in deck', function () {
                    beforeEach(function () {
                        for(var i = this.player2.conflictDeck.length - 1; i >= 2; i--) {
                            this.player2.moveCard(this.player2.conflictDeck[i], 'hand');
                        }
                        expect(this.player2.conflictDeck.length).toBe(2);
                        this.player1.clickCard(this.stolenSecrets);
                        this.player1.clickCard(this.favoredNiece);
                        this.player1.clickPrompt(this.censure.name);
                    });

                    it('should not prompt to place the remaining card', function () {
                        expect(this.player1).not.toHavePrompt('Which card do you want to be on top?');
                    });
                });

                describe('if there are exacttly 3 cards in deck', function () {
                    beforeEach(function () {
                        for(var i = this.player2.conflictDeck.length - 1; i >= 3; i--) {
                            this.player2.moveCard(this.player2.conflictDeck[i], 'hand');
                        }
                        expect(this.player2.conflictDeck.length).toBe(3);
                        this.player1.clickCard(this.stolenSecrets);
                        this.player1.clickCard(this.favoredNiece);
                        this.player1.clickPrompt(this.censure.name);
                    });

                    it('should prompt to place the top card only', function () {
                        expect(this.player1).toHavePrompt('Which card do you want to be on top?');
                        expect(this.player1).toHavePromptButton(this.centipedeTattoo.name);
                        expect(this.player1).toHavePromptButton(this.mantraOfFire.name);
                        this.player1.clickPrompt(this.mantraOfFire.name);
                        expect(this.player1).not.toHavePrompt('Which card do you want to be the second card?');
                    });
                });

                describe('if it resolves', function () {
                    beforeEach(function () {
                        this.player1.clickCard(this.stolenSecrets);
                        this.player1.clickCard(this.favoredNiece);
                        this.player1.clickPrompt(this.assassination.name);
                        this.player1.clickPrompt(this.mantraOfFire.name);
                        this.player1.clickPrompt(this.centipedeTattoo.name);
                    });

                    it('it should change control of the card', function () {
                        expect(this.assassination.controller).toBe(this.player1.player);
                    });

                    it('it should remove the chosen card from the game', function () {
                        expect(this.assassination.location).toBe('removed from game');
                    });

                    it('it should allow the removed card to be played', function () {
                        this.player2.pass();
                        this.player1.clickCard(this.assassination);
                        expect(this.player1).toHavePrompt('Choose a character');
                        this.player1.clickCard(this.soshiIllusionist);
                        expect(this.assassination.location).toBe('conflict discard pile');
                        expect(this.assassination.controller).toBe(this.player2.player);
                    });

                    it('should reorder the remaining cards', function () {
                        expect(this.player2.conflictDeck[0]).toBe(this.mantraOfFire);
                        expect(this.player2.conflictDeck[1]).toBe(this.centipedeTattoo);
                        expect(this.player2.conflictDeck[2]).toBe(this.censure);
                    });
                });
            });

        });
    });
});
