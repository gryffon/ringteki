describe('Shosuro Hametsu', function() {
    integration(function() {
        describe('Shosuro Hametsu\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shosuro-hametsu'],
                        honor: 10,
                        conflictDeck: ['fiery-madness', 'backhanded-compliment']
                    }
                });
                this.shosuroHametsu = this.player1.findCardByName('shosuro-hametsu');
            });

            it('should prompt the player to choose a card', function() {
                this.player1.clickCard(this.shosuroHametsu);
                expect(this.player1).toHavePrompt('Shosuro Hametsu');
            });

            it('should reduce player honor by 1', function() {
                this.player1.clickCard(this.shosuroHametsu);
                expect(this.player1.honor).toBe(9);
            });

            it('should prompt for only poison cards', function() {
                this.player1.clickCard(this.shosuroHametsu);
                expect(this.player1).toHavePrompt('Select a card to reveal and put in your hand');
                expect(this.player1).toHavePromptButton('Fiery Madness');
                expect(this.player1).not.toHavePromptButton('Backhanded Compliment');
            });

            it('should put the card in the player\'s hand, and display message with card name', function() {
                let handsize = this.player1.player.hand.size();
                this.player1.clickCard(this.shosuroHametsu);
                this.player1.clickPrompt('Fiery Madness');
                expect(this.player1.player.hand.size()).toBe(handsize + 1);
            });

            it('should display message with chosen card name', function() {
                //this.chat = spyOn(this.game, 'addMessage');
                this.player1.clickCard(this.shosuroHametsu);
                this.player1.clickPrompt('Fiery Madness');
                expect(this.getChatLogs(3)).toContain('player1 uses Shosuro Hametsu, losing 1 honor to search their deck');
                expect(this.getChatLogs(2)).toContain('player1 takes Fiery Madness and adds it to their hand');
                expect(this.getChatLogs(1)).toContain('player1 is shuffling their conflict deck');
            });
        });
    });
});
