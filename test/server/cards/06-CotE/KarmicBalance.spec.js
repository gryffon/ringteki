describe('Karmic Balance', function() {
    integration(function() {
        describe('Karmic Balance', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'draw',
                    player1: {
                        hand: ['karmic-balance', 'court-games'],
                        conflictDiscard: ['banzai', 'banzai', 'banzai']
                    },
                    player2: {
                        hand: ['banzai', 'banzai'],
                        conflictDiscard: ['banzai']
                    }
                });
                this.karmicBalance = this.player1.findCardByName('karmic-balance');
            });

            it('should not be able to be played if honor dials are unequal', function() {
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('2');
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.karmicBalance);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should be able to be played if honor dials are equal', function() {
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.karmicBalance);
                expect(this.player2).toHavePrompt('Action Window');
            });

            describe('if it resolves', function() {
                beforeEach(function() {
                    this.chat = spyOn(this.game, 'addMessage');
                    this.player1.clickPrompt('1');
                    this.player2.clickPrompt('1');
                    this.player1.clickCard(this.karmicBalance);
                });

                it('should shuffle both player\'s hand and conflict discard pile into their conflict deck and draw 4 new cards', function() {
                    expect(this.player1.player.hand.size()).toBe(4);
                    expect(this.player1.player.conflictDiscardPile.size()).toBe(0);
                    expect(this.player2.player.hand.size()).toBe(4);
                    expect(this.player2.player.conflictDiscardPile.size()).toBe(0);
                    expect(this.chat).toHaveBeenCalledWith('{0} is shuffling their conflict deck', this.player1.player);
                    expect(this.chat).toHaveBeenCalledWith('{0} is shuffling their conflict deck', this.player2.player);
                });

                it('should only log 1 shuffling chat message per player', function() {
                    let player1Count = this.chat.calls.allArgs().filter(c => {
                        return c[0] === '{0} is shuffling their conflict deck' && c[1] === this.player1.player;
                    }).length;
                    let player2Count = this.chat.calls.allArgs().filter(c => {
                        return c[0] === '{0} is shuffling their conflict deck' && c[1] === this.player2.player;
                    }).length;
                    expect(player1Count).toBe(1);
                    expect(player2Count).toBe(1);
                });

                it('should remove itself from the game', function() {
                    expect(this.karmicBalance.location).toBe('removed from game');
                });
            });

        });
    });
});
