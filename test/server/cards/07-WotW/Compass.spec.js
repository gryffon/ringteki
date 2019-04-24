describe('Compass', function() {
    integration(function() {
        describe('Compass\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shinjo-outrider', 'border-rider'],
                        dynastyDiscard: ['imperial-storehouse', 'favorable-ground', 'moto-youth'],
                        hand: ['compass', 'fine-katana', 'ornate-fan', 'iuchi-wayfinder']
                    },
                    player2: {
                        inPlay: []
                    }
                });

                this.shinjoOutrider = this.player1.findCardByName('shinjo-outrider');
                this.borderRider = this.player1.findCardByName('border-rider');
                this.imperialStorehouse = this.player1.findCardByName('imperial-storehouse');
                this.favorableGround = this.player1.findCardByName('favorable-ground');
                this.motoYouth = this.player1.findCardByName('moto-youth');
                this.compass = this.player1.findCardByName('compass');
                this.fineKatana = this.player1.findCardByName('fine-katana');
                this.ornateFan = this.player1.findCardByName('ornate-fan');
                this.iuchiWayfinder = this.player1.findCardByName('iuchi-wayfinder');

                this.oppProvince1 = this.player2.provinces['province 1'].provinceCard;

                this.player1.moveCard(this.imperialStorehouse, 'dynasty deck');
                this.player1.moveCard(this.favorableGround, 'dynasty deck');
                this.player1.moveCard(this.motoYouth, 'dynasty deck');

                this.player1.moveCard(this.fineKatana, 'conflict deck');
                this.player1.moveCard(this.ornateFan, 'conflict deck');
                this.player1.moveCard(this.iuchiWayfinder, 'conflict deck');

                this.player1.clickCard(this.compass);
                this.player1.clickCard(this.shinjoOutrider);
            });

            it('should not trigger when an opponent\'s province is revealed and the attached character is not participating', function() {
                expect(this.oppProvince1.facedown).toBe(true);
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.borderRider],
                    province: this.oppProvince1
                });
                expect(this.oppProvince1.facedown).toBe(false);
                expect(this.player2).toHavePrompt('Choose defenders');
            });

            it('should trigger when an opponent\'s province is revealed and the attached character is participating', function() {
                expect(this.oppProvince1.facedown).toBe(true);
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.shinjoOutrider]
                });
                expect(this.oppProvince1.facedown).toBe(false);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.compass);
            });

            it('should prompt to choose a deck', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.shinjoOutrider]
                });
                this.player1.clickCard(this.compass);
                expect(this.getChatLogs(1)).toContain('player1 uses Compass to look at the top 3 cards of one of their decks');
                expect(this.player1).toHavePromptButton('Dynasty Deck');
                expect(this.player1).toHavePromptButton('Conflict Deck');
            });

            it('should prompt to choose what to place on the bottom of the top 3 cards', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.shinjoOutrider]
                });
                this.player1.clickCard(this.compass);
                this.player1.clickPrompt('Dynasty Deck');
                expect(this.getChatLogs(1)).toContain('player1 chooses to look at the top 3 cards of their dynasty deck');
                expect(this.player1).toHavePrompt('Choose a card to place on the bottom of your deck');
                expect(this.player1).toHavePromptButton(this.imperialStorehouse.name);
                expect(this.player1).toHavePromptButton(this.favorableGround.name);
                expect(this.player1).toHavePromptButton(this.motoYouth.name);
                expect(this.player1).toHavePromptButton('Done');
                this.player1.clickPrompt(this.favorableGround.name);
                expect(this.getChatLogs(1)).toContain('player1 places a card on the bottom of their dynasty deck');
                expect(this.player1).toHavePrompt('Choose a card to place on the bottom of your deck');
                expect(this.player1).toHavePromptButton(this.imperialStorehouse.name);
                expect(this.player1).not.toHavePromptButton(this.favorableGround.name);
                expect(this.player1).toHavePromptButton(this.motoYouth.name);
                expect(this.player1).toHavePromptButton('Done');
                this.player1.clickPrompt(this.motoYouth.name);
                expect(this.player1).toHavePrompt('Choose a card to place on the bottom of your deck');
                expect(this.player1).toHavePromptButton(this.imperialStorehouse.name);
                expect(this.player1).not.toHavePromptButton(this.favorableGround.name);
                expect(this.player1).not.toHavePromptButton(this.motoYouth.name);
                expect(this.player1).toHavePromptButton('Done');
                this.player1.clickPrompt(this.imperialStorehouse.name);
                expect(this.player1).not.toHavePrompt('Choose a card to place on the bottom of your deck');
                let deckLength = this.player1.dynastyDeck.length;
                expect(this.player1.dynastyDeck[deckLength - 1]).toBe(this.imperialStorehouse);
                expect(this.player1.dynastyDeck[deckLength - 2]).toBe(this.motoYouth);
                expect(this.player1.dynastyDeck[deckLength - 3]).toBe(this.favorableGround);
            });

            it('should prompt to choose the order to place the remaining cards on top', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.shinjoOutrider]
                });
                this.player1.clickCard(this.compass);
                this.player1.clickPrompt('Conflict Deck');
                expect(this.getChatLogs(1)).toContain('player1 chooses to look at the top 3 cards of their conflict deck');
                expect(this.player1).toHavePrompt('Choose a card to place on the bottom of your deck');
                expect(this.player1).toHavePromptButton(this.fineKatana.name);
                expect(this.player1).toHavePromptButton(this.ornateFan.name);
                expect(this.player1).toHavePromptButton(this.iuchiWayfinder.name);
                expect(this.player1).toHavePromptButton('Done');
                this.player1.clickPrompt('Done');
                expect(this.player1).toHavePrompt('Choose a card to place on the top of your deck');
                expect(this.player1).toHavePromptButton(this.fineKatana.name);
                expect(this.player1).toHavePromptButton(this.ornateFan.name);
                expect(this.player1).toHavePromptButton(this.iuchiWayfinder.name);
                expect(this.player1).not.toHavePromptButton('Done');
                this.player1.clickPrompt(this.iuchiWayfinder.name);
                expect(this.getChatLogs(1)).toContain('player1 places a card on the top of their conflict deck');
                expect(this.player1).toHavePrompt('Choose a card to place on the top of your deck');
                expect(this.player1).toHavePromptButton(this.fineKatana.name);
                expect(this.player1).toHavePromptButton(this.ornateFan.name);
                expect(this.player1).not.toHavePromptButton(this.iuchiWayfinder.name);
                this.player1.clickPrompt(this.fineKatana.name);
                expect(this.player2).toHavePrompt('Choose defenders');
                expect(this.player1.conflictDeck[0]).toBe(this.ornateFan);
                expect(this.player1.conflictDeck[1]).toBe(this.fineKatana);
                expect(this.player1.conflictDeck[2]).toBe(this.iuchiWayfinder);
            });

            it('should handle less than 3 cards in the deck', function() {
                this.player1.reduceDeckToNumber('conflict deck', 2);
                expect(this.player1.conflictDeck.length).toBe(2);
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.shinjoOutrider]
                });
                this.player1.clickCard(this.compass);
                this.player1.clickPrompt('Conflict Deck');
                expect(this.player1).toHavePrompt('Choose a card to place on the bottom of your deck');
                expect(this.player1).toHavePromptButton(this.iuchiWayfinder.name);
                expect(this.player1).toHavePromptButton(this.ornateFan.name);
            });

            it('should not trigger if both decks are empty', function() {
                this.player1.reduceDeckToNumber('dynasty deck', 0);
                expect(this.player1.dynastyDeck.length).toBe(0);
                this.player1.reduceDeckToNumber('conflict deck', 0);
                expect(this.player1.conflictDeck.length).toBe(0);
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.shinjoOutrider]
                });
                expect(this.player2).toHavePrompt('Choose defenders');
            });

            it('should not allow you to choose an empty deck', function() {
                this.player1.reduceDeckToNumber('conflict deck', 0);
                expect(this.player1.conflictDeck.length).toBe(0);
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.shinjoOutrider]
                });
                this.player1.clickCard(this.compass);
                expect(this.player1).toHavePromptButton('Dynasty Deck');
                expect(this.player1).not.toHavePromptButton('Conflict Deck');
            });
        });
    });
});
