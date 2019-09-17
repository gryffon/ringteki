describe('Togashi Yoshi', function() {
    integration(function() {
        describe('Togashi Yoshi\'s ability', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        dynastyDiscard: ['truthseeker']
                    },
                    player2: {
                        inPlay: ['asahina-artisan']
                    }
                });
                this.truthseeker = this.player1.placeCardInProvince('truthseeker', 'province 1');
            });

            it('should be allowed to trigger as soon as the character enters play', function () {
                this.player1.clickCard(this.truthseeker);
                this.player1.clickPrompt('1');

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.truthseeker);
            });

            it('should give each player\'s decks as options for the target', function () {
                this.player1.clickCard(this.truthseeker);
                this.player1.clickPrompt('1');

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.truthseeker);

                this.player1.clickCard(this.truthseeker);
                expect(this.player1).toHavePrompt('Choose which deck to look at:');
                expect(this.player1).toHavePromptButton('Opponent\'s Dynasty Deck');
                expect(this.player1).toHavePromptButton('Opponent\'s Conflict Deck');
                expect(this.player1).toHavePromptButton('Your Dynasty Deck');
                expect(this.player1).toHavePromptButton('Your Conflict Deck');
            });

            it('should let you order the top 3 cards', function () {
                this.player1.clickCard(this.truthseeker);
                this.player1.clickPrompt('1');
                this.player1.clickCard(this.truthseeker);
                this.player1.clickPrompt('Your Conflict Deck');
                expect(this.player1).toHavePrompt('Select the card you would like to place on top of the deck.');
                expect(this.player1).toHavePromptButton('Supernatural Storm (3)');
                this.player1.clickPrompt('Supernatural Storm (3)');
                expect(this.player1).toHavePromptButton('Supernatural Storm (2)');
                this.player1.clickPrompt('Supernatural Storm (2)');
                expect(this.player2).toHavePrompt('Play cards from provinces');
            });
        });
    });
});

