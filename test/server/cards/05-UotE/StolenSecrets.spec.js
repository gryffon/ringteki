describe('Stolen Secrets', function() {
    integration(function() {
        describe('Stolen Secret\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['favored-niece', 'soshi-illusionist'],
                        hand: ['stolen-secrets','stolen-secrets']
                    },
                    player2: {
                        hand: ['assassination', 'finger-of-jade', 'tattooed-wanderer', 'kami-unleashed','censure']
                    }
                });

                this.assassination = this.player2.findCardByName('assassination', 'hand');
                this.fingerOfJade = this.player2.findCardByName('finger-of-jade', 'hand');
                this.tattooedWanderer = this.player2.findCardByName('tattooed-wanderer', 'hand');
                this.kamiUnleashed = this.player2.findCardByName('kami-unleashed', 'hand');
                this.censure = this.player2.findCardByName('censure', 'hand');

                this.player2.player.moveCard(this.censure, 'conflict deck');
                this.player2.player.moveCard(this.assassination, 'conflict deck');
                this.player2.player.moveCard(this.fingerOfJade, 'conflict deck');
                this.player2.player.moveCard(this.tattooedWanderer, 'conflict deck');
                this.player2.player.moveCard(this.kamiUnleashed, 'conflict deck');

                this.favoredNiece = this.player1.findCardByName('favored-niece');
                this.favoredNiece.fate = 2;
                this.soshiIllusionist = this.player1.findCardByName('soshi-illusionist');
                this.stolenSecrets = this.player1.findCardByName('stolen-secrets');
                this.stolenSecrets2 = this.player1.filterCardsByName('stolen-secrets')[1];
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
                        expect(this.favoredNiece.fate).toBe(1);
                    });

                    it('should prompt to choose from (up to) the top 4 cards of your opponent', function () {
                        expect(this.player1).toHavePrompt('Choose a card to remove from the game');
                        expect(this.player1).toHavePromptButton(this.assassination.name);
                        expect(this.player1).toHavePromptButton(this.fingerOfJade.name);
                        expect(this.player1).toHavePromptButton(this.tattooedWanderer.name);
                        expect(this.player1).toHavePromptButton(this.kamiUnleashed.name);
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
                        expect(this.player1).toHavePromptButton(this.fingerOfJade.name);
                        expect(this.player1).toHavePromptButton(this.tattooedWanderer.name);
                        expect(this.player1).toHavePromptButton(this.kamiUnleashed.name);
                        this.player1.clickPrompt(this.tattooedWanderer.name);
                        expect(this.player1).toHavePrompt('Which card do you want to be the second card?');
                        expect(this.player1).toHavePromptButton(this.kamiUnleashed.name);
                        expect(this.player1).toHavePromptButton(this.fingerOfJade.name);
                        this.player1.clickPrompt(this.kamiUnleashed.name);
                    });
                });

                describe('if there are exactly 2 cards in deck', function () {
                    beforeEach(function () {
                        for(var i = this.player2.conflictDeck.length - 1; i >= 2; i--) {
                            this.player2.moveCard(this.player2.conflictDeck[i], 'hand');
                        }
                        expect(this.player2.conflictDeck.length).toBe(2);
                        this.player1.clickCard(this.stolenSecrets);
                        this.player1.clickCard(this.favoredNiece);
                        this.player1.clickPrompt(this.kamiUnleashed.name);
                    });

                    it('should not prompt to place the remaining card', function () {
                        expect(this.player1).not.toHavePrompt('Which card do you want to be on top?');
                    });
                });

                describe('if there are exactly 3 cards in deck', function () {
                    beforeEach(function () {
                        for(var i = this.player2.conflictDeck.length - 1; i >= 3; i--) {
                            this.player2.moveCard(this.player2.conflictDeck[i], 'hand');
                        }
                        expect(this.player2.conflictDeck.length).toBe(3);
                        this.player1.clickCard(this.stolenSecrets);
                        this.player1.clickCard(this.favoredNiece);
                        this.player1.clickPrompt(this.kamiUnleashed.name);
                    });

                    it('should prompt to place the top card only', function () {
                        expect(this.player1).toHavePrompt('Which card do you want to be on top?');
                        expect(this.player1).toHavePromptButton(this.fingerOfJade.name);
                        expect(this.player1).toHavePromptButton(this.tattooedWanderer.name);
                        this.player1.clickPrompt(this.tattooedWanderer.name);
                        expect(this.player1).not.toHavePrompt('Which card do you want to be the second card?');
                    });
                });

                describe('if it resolves (with an event as chosen card)', function () {
                    beforeEach(function () {
                        this.player1.clickCard(this.stolenSecrets);
                        this.player1.clickCard(this.favoredNiece);
                        this.player1.clickPrompt(this.assassination.name);
                        this.player1.clickPrompt(this.tattooedWanderer.name);
                        this.player1.clickPrompt(this.fingerOfJade.name);
                    });

                    it('it should change control of the card', function () {
                        expect(this.assassination.controller).toBe(this.player1.player);
                    });

                    it('it should remove the chosen card from the game', function () {
                        expect(this.assassination.location).toBe('removed from game');
                    });

                    it('the chosen card should be hidden from your opponent', function() {
                        expect(this.assassination.anyEffect('hideWhenFaceUp')).toBe(true);
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
                        expect(this.player2.conflictDeck[0]).toBe(this.tattooedWanderer);
                        expect(this.player2.conflictDeck[1]).toBe(this.fingerOfJade);
                        expect(this.player2.conflictDeck[2]).toBe(this.kamiUnleashed);
                    });
                });

                describe('if it resolves (with an attachment as chosen card)', function() {
                    beforeEach(function() {
                        this.player1.clickCard(this.stolenSecrets);
                        this.player1.clickCard(this.favoredNiece);
                        this.player1.clickPrompt(this.fingerOfJade.name);
                        this.player1.clickPrompt(this.assassination.name);
                        this.player1.clickPrompt(this.tattooedWanderer.name);
                    });

                    it('it should change control of the card', function() {
                        expect(this.fingerOfJade.controller).toBe(this.player1.player);
                    });

                    it('it should remove the chosen card from the game', function() {
                        expect(this.fingerOfJade.location).toBe('removed from game');
                    });

                    it('the chosen card should be hidden from your opponent', function() {
                        expect(this.fingerOfJade.anyEffect('hideWhenFaceUp')).toBe(true);
                    });

                    it('it should allow the removed card to be played', function() {
                        this.player2.pass();
                        this.player1.clickCard(this.fingerOfJade);
                        expect(this.player1).toHavePrompt('Finger of Jade');
                        this.player1.clickCard(this.soshiIllusionist);
                        expect(this.fingerOfJade.location).toBe('play area');
                    });
                });

                describe('if it resolves (with a character as chosen card)', function() {
                    beforeEach(function() {
                        this.player1.clickCard(this.stolenSecrets);
                        this.player1.clickCard(this.favoredNiece);
                        this.player1.clickPrompt(this.kamiUnleashed.name);
                        this.player1.clickPrompt(this.fingerOfJade.name);
                        this.player1.clickPrompt(this.assassination.name);
                    });

                    it('it should change control of the card', function() {
                        expect(this.kamiUnleashed.controller).toBe(this.player1.player);
                    });

                    it('it should remove the chosen card from the game', function() {
                        expect(this.kamiUnleashed.location).toBe('removed from game');
                    });

                    it('the chosen card should be hidden from your opponent', function() {
                        expect(this.kamiUnleashed.anyEffect('hideWhenFaceUp')).toBe(true);
                    });

                    it('it should allow the removed card to be played', function() {
                        this.player2.pass();
                        this.player1.clickCard(this.kamiUnleashed);
                        expect(this.player1).toHavePrompt('Kami Unleashed');
                        expect(this.player1).toHavePromptButton('0');
                        this.player1.clickPrompt('0');
                        expect(this.player1).toHavePromptButton('Conflict');
                        this.player1.clickPrompt('Conflict');
                        expect(this.kamiUnleashed.location).toBe('play area');
                        expect(this.kamiUnleashed.inConflict).toBe(true);
                        expect(this.player1).toHavePrompt('Waiting for opponent to take an action or pass');
                    });
                });

                describe('if it resolves (with a Tattooed Wanderer as chosen card)', function() {
                    beforeEach(function() {
                        this.player1.clickCard(this.stolenSecrets);
                        this.player1.clickCard(this.favoredNiece);
                        this.player1.clickPrompt(this.tattooedWanderer.name);
                        this.player1.clickPrompt(this.fingerOfJade.name);
                        this.player1.clickPrompt(this.assassination.name);
                    });

                    it('it should allow Tattooed Wanderer to be played as an attachment', function() {
                        this.player2.pass();
                        this.player1.clickCard(this.tattooedWanderer);
                        expect(this.player1).toHavePrompt('Tattooed Wanderer');
                        expect(this.player1).toHavePromptButton('Play Tattooed Wanderer as an attachment');
                        this.player1.clickPrompt('Play Tattooed Wanderer as an attachment');
                        expect(this.player1).toBeAbleToSelect(this.soshiIllusionist);
                        this.player1.clickCard(this.soshiIllusionist);
                        expect(this.tattooedWanderer.location).toBe('play area');
                        expect(this.soshiIllusionist.attachments.toArray()).toContain(this.tattooedWanderer);
                        expect(this.player1).toHavePrompt('Waiting for opponent to take an action or pass');
                    });

                    it('it should allow Tattooed Wanderer to be played as a character', function() {
                        this.player2.pass();
                        this.player1.clickCard(this.tattooedWanderer);
                        expect(this.player1).toHavePrompt('Tattooed Wanderer');
                        expect(this.player1).toHavePromptButton('Play this character');
                        this.player1.clickPrompt('Play this character');
                        expect(this.player1).toHavePrompt('Tattooed Wanderer');
                        expect(this.player1).toHavePromptButton('0');
                        this.player1.clickPrompt('0');
                        expect(this.player1).toHavePromptButton('Home');
                        this.player1.clickPrompt('Home');
                        expect(this.tattooedWanderer.location).toBe('play area');
                        expect(this.tattooedWanderer.inConflict).toBe(false);
                        expect(this.player1).toHavePrompt('Waiting for opponent to take an action or pass');
                    });
                });

                describe('if a second Stolen Secrets is played', function() {
                    beforeEach(function() {
                        this.player1.clickCard(this.stolenSecrets);
                        this.player1.clickCard(this.favoredNiece);
                        this.player1.clickPrompt(this.assassination.name);
                        this.player1.clickPrompt(this.tattooedWanderer.name);
                        this.player1.clickPrompt(this.fingerOfJade.name);
                        this.player2.pass();
                        this.player1.clickCard(this.stolenSecrets2);
                        this.player1.clickCard(this.favoredNiece);
                        this.player1.clickPrompt(this.fingerOfJade.name);
                        this.player1.clickPrompt(this.tattooedWanderer.name);
                        this.player1.clickPrompt(this.censure.name);
                    });

                    it('it should allow both chosen cards to be played', function() {
                        this.player2.pass();
                        this.player1.clickCard(this.assassination);
                        expect(this.player1).toHavePrompt('Choose a character');
                        this.player1.clickCard(this.soshiIllusionist);
                        expect(this.assassination.location).toBe('conflict discard pile');
                        expect(this.assassination.controller).toBe(this.player2.player);
                        this.player2.pass();
                        this.player1.clickCard(this.fingerOfJade);
                        expect(this.player1).toHavePrompt('Finger of Jade');
                        expect(this.player1).toBeAbleToSelect(this.favoredNiece);
                        this.player1.clickCard(this.favoredNiece);
                        expect(this.fingerOfJade.location).toBe('play area');
                        expect(this.favoredNiece.attachments.toArray()).toContain(this.fingerOfJade);
                        expect(this.player1).toHavePrompt('Waiting for opponent to take an action or pass');
                    });
                });
            });
        });
    });
});
