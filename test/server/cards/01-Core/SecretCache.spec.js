describe('Secret Cache', function() {
    integration(function() {
        describe('Secret Cache\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['matsu-berserker']
                    },
                    player2: {
                        provinces: ['secret-cache']
                    }
                });
                this.matsuBerserker = this.player1.findCardByName('matsu-berserker');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['matsu-berserker']
                });
            });

            it('should trigger when attackers are declared', function() {
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect('secret-cache');
            });

            it('should prompt the player to choose a card', function() {
                this.player2.clickCard('secret-cache');
                expect(this.player2).toHavePrompt('Secret Cache');
            });

            it('should put the card in the player\'s hand, and display an anonymous message', function() {
                let handsize = this.player2.player.hand.size();
                this.player2.clickCard('secret-cache');
                this.player2.clickPrompt('Supernatural Storm (5)');
                expect(this.player2.player.hand.size()).toBe(handsize + 1);
                expect(this.getChatLogs(4)).toContain('player2 uses Secret Cache to look at the top 5 cards of their conflict deck');
                expect(this.getChatLogs(3)).toContain('player2 takes a card into their hand');
                expect(this.getChatLogs(2)).toContain('player2 is shuffling their conflict deck');
            });
        });
    });
});
