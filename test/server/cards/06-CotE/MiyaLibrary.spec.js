describe('Miya Library', function () {
    integration(function () {
        describe('Miya Library\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        inPlay: ['miya-library', 'kanjo-district', 'miya-satoshi', 'adept-of-the-waves', 'kudaka', 'naive-student'],
                        dynastyDeck: []
                    },
                    player2: {
                    }
                });
                this.miyaLibrary = this.player1.findCardByName('miya-library');
                this.miyaSatoshi = this.player1.findCardByName('miya-satoshi');
                this.adept = this.player1.findCardByName('adept-of-the-waves');
                this.kudaka = this.player1.findCardByName('kudaka');
                this.kanjo = this.player1.findCardByName('kanjo-district');
                this.naiveStudent = this.player1.findCardByName('naive-student');
                this.player1.placeCardInProvince(this.miyaLibrary, 'province 1');
                this.player1.moveCard(this.miyaSatoshi, 'dynasty deck');
                this.player1.moveCard(this.kanjo, 'dynasty deck');
                this.player1.moveCard(this.adept, 'dynasty deck');
                this.player1.moveCard(this.kudaka, 'dynasty deck');

            });

            it('should allow you to replace the library for satoshi', function () {
                this.player1.clickCard(this.miyaLibrary);
                expect(this.player1).toHavePrompt('select an imperial character to replace miya library');
                this.player1.clickPrompt('Miya Satoshi');
                expect(this.player1).toHavePrompt('Select the card you would like to place on top of your dynasty deck');
                this.player1.clickPrompt('Kanjo District');
                expect(this.player1).toHavePrompt('Which card do you want to be the second card?');
                this.player1.clickPrompt('Adept of the Waves');
                expect(this.player1).toHavePrompt('Which card do you want to be the third card?');
                this.player1.clickPrompt('Kudaka');
                expect(this.player2).toHavePrompt('Play cards from provinces');
                expect(this.miyaSatoshi.location).toBe('province 1');
                expect(this.miyaLibrary.location).toBe('dynasty deck');
                this.player2.pass();
                this.player1.clickCard(this.miyaSatoshi);
                this.player1.clickPrompt('1');
                expect(this.miyaSatoshi.location).toBe('play area');
            });

            it('should not let you select an imperial holding', function () {
                this.player1.clickCard(this.miyaLibrary);
                expect(this.player1).not.toBeAbleToSelect('Kanjo District');
            });

            it('should still let you rearrange your deck if there is not an imperial character', function () {
                this.player1.moveCard(this.naiveStudent, 'dynasty deck');
                this.player1.clickCard(this.miyaLibrary);
                expect(this.player1).not.toBeAbleToSelect(this.miyaSatoshi);
                expect(this.player1).toHavePrompt('select an imperial character to replace miya library');
                this.player1.clickPrompt('Do not replace Miya Library');
                this.player1.clickPrompt('Kudaka');
                this.player1.clickPrompt('Naive Student');
                this.player1.clickPrompt('Adept of the Waves');
            });

            it('should put the card back in the right order', function () {
                this.player1.clickCard(this.miyaLibrary);
                expect(this.player1).toHavePrompt('select an imperial character to replace miya library');
                this.player1.clickPrompt('Miya Satoshi');
                expect(this.player1).toHavePrompt('Select the card you would like to place on top of your dynasty deck');
                this.player1.clickPrompt('Kanjo District');
                expect(this.player1).toHavePrompt('Which card do you want to be the second card?');
                this.player1.clickPrompt('Adept of the Waves');
                expect(this.player1).toHavePrompt('Which card do you want to be the third card?');
                this.player1.clickPrompt('Kudaka');
                this.player1.moveCard(this.player1.player.dynastyDeck.first(), 'dynasty discard pile');
                expect(this.kanjo.location).toBe('dynasty discard pile');
                this.player1.moveCard(this.player1.player.dynastyDeck.first(), 'dynasty discard pile');
                expect(this.adept.location).toBe('dynasty discard pile');
                this.player1.moveCard(this.player1.player.dynastyDeck.first(), 'dynasty discard pile');
                expect(this.kudaka.location).toBe('dynasty discard pile');
                this.player1.moveCard(this.player1.player.dynastyDeck.first(), 'dynasty discard pile');
                expect(this.miyaLibrary.location).toBe('dynasty discard pile');
            });

            it('should work if the player has less four card in their dynasty deck', function () {
                for(var i = this.player1.dynastyDeck.length - 1; i >= 0; i--) {
                    this.player1.moveCard(this.player1.dynastyDeck[i], 'dynasty discard pile');
                }
                this.player1.moveCard(this.miyaSatoshi, 'dynasty deck');
                this.player1.moveCard(this.kanjo, 'dynasty deck');
                this.player1.clickCard(this.miyaLibrary);
                this.player1.clickPrompt('Do not replace Miya Library');
                this.player1.clickPrompt('Kanjo District');
                expect(this.player2).toHavePrompt('Play cards from provinces');
            });
        });
    });
});
