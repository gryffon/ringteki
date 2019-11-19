describe('Emperor\'s Summons', function() {
    integration(function() {
        describe('Emperor\'s Summons\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['brash-samurai', 'doji-whisperer']
                    },
                    player2: {
                        inPlay: ['tattooed-wanderer'],
                        provinces: ['emperor-s-summons'],
                        dynastyDiscard: ['mirumoto-raitsugu', 'favorable-ground']
                    }
                });

                this.brashSamurai = this.player1.findCardByName('brash-samurai');
                this.dojiWhisperer = this.player1.findCardByName('doji-whisperer');

                this.tattooedWanderer = this.player2.findCardByName('tattooed-wanderer');
                this.emperorsSummons = this.player2.findCardByName('emperor-s-summons');
                this.shamefulDisplay = this.player2.findCardByName('shameful-display', 'province 2');
                this.mirumotoRaitsugu = this.player2.findCardByName('mirumoto-raitsugu');
                this.player2.moveCard(this.mirumotoRaitsugu, 'dynasty deck');
                this.favorableGround = this.player2.findCardByName('favorable-ground');
                this.player2.moveCard(this.favorableGround, 'dynasty deck');
            });

            it('should trigger when revealed', function() {
                this.noMoreActions();
                this.player1.clickCard(this.brashSamurai);
                this.player1.clickRing('fire');
                this.player1.clickCard(this.emperorsSummons);
                this.player1.clickPrompt('Initiate Conflict');
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.emperorsSummons);
            });

            it('should prompt to choose a character', function() {
                this.noMoreActions();
                this.player1.clickCard(this.brashSamurai);
                this.player1.clickRing('fire');
                this.player1.clickCard(this.emperorsSummons);
                this.player1.clickPrompt('Initiate Conflict');
                this.player2.clickCard(this.emperorsSummons);
                expect(this.getChatLogs(1)).toContain('player2 uses Emperor\'s Summons to choose a character to place in a province');
                expect(this.player2).toHavePrompt('Select a card:');
                expect(this.player2).toHavePromptButton('Adept of the Waves (4)');
                expect(this.player2).toHavePromptButton('Mirumoto Raitsugu');
                expect(this.player2).not.toHavePromptButton('Imperial Storehouse');
                expect(this.player2).toHavePromptButton('Select nothing');
            });

            it('should do nothing if \'Select nothing\' is chosen', function() {
                let dynastyDeckSize = this.player2.dynastyDeck.length;
                this.noMoreActions();
                this.player1.clickCard(this.brashSamurai);
                this.player1.clickRing('fire');
                this.player1.clickCard(this.emperorsSummons);
                this.player1.clickPrompt('Initiate Conflict');
                this.player2.clickCard(this.emperorsSummons);
                this.player2.clickPrompt('Select nothing');
                expect(this.player2.dynastyDeck.length).toBe(dynastyDeckSize);
                expect(this.getChatLogs(2)).toContain('player2 selects nothing from their deck');
            });

            it('should place the selected charater in the chosen province, discarding each other card in that province, face up', function() {
                this.noMoreActions();
                const cardsInDiscard = this.player2.player.dynastyDiscardPile.size();
                this.player1.clickCard(this.brashSamurai);
                this.player1.clickRing('fire');
                this.player1.clickCard(this.emperorsSummons);
                this.player1.clickPrompt('Initiate Conflict');
                this.player2.clickCard(this.emperorsSummons);
                this.player2.clickPrompt('Mirumoto Raitsugu');
                this.player2.clickCard(this.shamefulDisplay);
                expect(this.mirumotoRaitsugu.location).toBe('province 2');
                expect(this.mirumotoRaitsugu.facedown).toBe(false);
                expect(this.player2.player.dynastyDiscardPile.size()).toBe(cardsInDiscard + 1);
                expect(this.getChatLogs(2)).toContain('player2 chooses to place Mirumoto Raitsugu in province 2 discarding Adept of the Waves');
            });
        });
    });
});
