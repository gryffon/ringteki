describe('Emissary of lies\'', function() {
    integration(function() {
        describe('Emissary of Lies\' ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['emissary-of-lies'],
                        hand: ['fine-katana']
                    },
                    player2: {
                        inPlay: ['otomo-courtier', 'shiba-tsukune'],
                        hand: ['banzai']
                    }
                });

                this.emissary = this.player1.findCardByName('emissary-of-lies');
                this.katana = this.player1.findCardByName('fine-katana');

                this.tsukune = this.player2.findCardByName('shiba-tsukune');
                this.otomo = this.player2.findCardByName('otomo-courtier');
                this.banzai = this.player2.findCardByName('banzai');

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.emissary],
                    defenders: [this.tsukune]
                });
                this.player2.pass();
            });

            it('should be able to target opponent\'s character in the conflict', function() {
                this.player1.clickCard(this.emissary);
                expect(this.player1).toHavePrompt('Emissary of Lies');
                expect(this.player1).toBeAbleToSelect(this.tsukune);
                expect(this.player1).not.toBeAbleToSelect(this.otomo);
            });

            it('should let the opponent name a card', function() {
                this.player1.clickCard(this.emissary);
                this.player1.clickCard(this.tsukune);
                expect(this.player2).toHavePrompt('Name a card');
                this.player2.chooseCardInPrompt(this.katana.name, 'card-name');
            });

            it('should let the emissary player choose if they want to reveal their hand', function() {
                this.player1.clickCard(this.emissary);
                this.player1.clickCard(this.tsukune);
                this.player2.chooseCardInPrompt(this.katana.name, 'card-name');
                expect(this.player1).toHavePrompt('Do you want to reveal your hand?');
                expect(this.player1).toHavePromptButton('Yes');
                expect(this.player1).toHavePromptButton('No');
            });

            it('should not do anything if the player says no to revealing their hand', function() {
                this.player1.clickCard(this.emissary);
                this.player1.clickCard(this.tsukune);
                this.player2.chooseCardInPrompt(this.katana.name, 'card-name');
                this.player1.clickPrompt('No');
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.game.currentConflict.defenders).toContain(this.tsukune);
            });

            it('should move the character home if the name card is not in hand', function() {
                this.player1.clickCard(this.emissary);
                this.player1.clickCard(this.tsukune);
                this.player2.chooseCardInPrompt(this.banzai.name, 'card-name');
                this.player1.clickPrompt('Yes');
                expect(this.game.currentConflict.defenders).not.toContain(this.tsukune);
            });

            it('if the named card is in hand the character should not be moved even if the hand is reveal', function() {
                this.player1.clickCard(this.emissary);
                this.player1.clickCard(this.tsukune);
                this.player2.chooseCardInPrompt(this.katana.name, 'card-name');
                this.player1.clickPrompt('Yes');
                expect(this.game.currentConflict.defenders).toContain(this.tsukune);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });
        });
    });
});
