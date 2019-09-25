describe('Truthseeker', function() {
    integration(function() {
        describe('Truthseeker\'s ability', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        dynastyDiscard: ['truthseeker'],
                        hand: ['assassination', 'fine-katana', 'ornate-fan']
                    },
                    player2: {
                        inPlay: ['asahina-artisan']
                    }
                });
                this.truthseeker = this.player1.placeCardInProvince('truthseeker', 'province 1');
                this.ornateFan = this.player1.moveCard('ornate-fan', 'conflict deck');
                this.fineKatana = this.player1.moveCard('fine-katana', 'conflict deck');
                this.assassination = this.player1.moveCard('assassination', 'conflict deck');
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
                expect(this.player1).toHavePromptButton('Assassination');
                expect(this.player1).toHavePromptButton('Ornate Fan');
                expect(this.player1).toHavePromptButton('Fine Katana');
                this.player1.clickPrompt('Fine Katana');
                expect(this.player1).toHavePromptButton('Assassination');
                expect(this.player1).toHavePromptButton('Ornate Fan');
                this.player1.clickPrompt('Ornate Fan');
                expect(this.player2).toHavePrompt('Play cards from provinces');

                let topCards = this.player1.conflictDeck.slice(0, 3);

                expect(topCards[0]).toBe(this.fineKatana);
                expect(topCards[1]).toBe(this.ornateFan);
                expect(topCards[2]).toBe(this.assassination);
            });
        });
    });
});

