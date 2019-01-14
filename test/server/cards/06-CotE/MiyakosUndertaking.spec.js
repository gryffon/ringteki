xdescribe('Miyako\'s Undertaking', function() {
    integration(function() {
        describe('Miyako\'s Undertaking\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['bayushi-liar', 'alibi-artist', 'young-rumormonger'],
                        honor: 5,
                        hand: ['miyako-s-undertaking', 'warm-welcome', 'way-of-the-scorpion', 'fine-katana'],
                        dynastyDiscard: ['shosuro-actress']
                    },
                    player2: {
                        dynastyDiscardPilt: ['kitsu-spiritcaller', 'honored-general', 'akodo-gunso', 'gifted-tactician']
                    }
                });
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: ['bayushi-liar', 'alibi-artist', 'young-rumormonger'],
                    defenders: []
                });
                this.player2.pass();
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

            it('should put the card in the player\'s hand', function() {
                let handsize = this.player1.player.hand.size();
                this.player1.clickCard(this.shosuroHametsu);
                this.player1.clickPrompt('Fiery Madness');
                expect(this.player1.player.hand.size()).toBe(handsize + 1);
            });

            it('should display message with chosen card name', function() {
                //this.chat = spyOn(this.game, 'addMessage');
                this.player1.clickCard(this.shosuroHametsu);
                this.player1.clickPrompt('Fiery Madness');
                expect(this.getChatLogs(3)).toContain('player1 uses Shosuro Hametsu, losing 1 honor to search conflict deck to reveal a poison card and add it to their hand');
                expect(this.getChatLogs(2)).toContain('player1 takes Fiery Madness and adds it to their hand');
                expect(this.getChatLogs(1)).toContain('player1 is shuffling their conflict deck');
            });
        });
    });
});
