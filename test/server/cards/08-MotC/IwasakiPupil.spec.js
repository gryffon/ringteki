describe('Iwasaki Pupil', function() {
    integration(function() {
        describe('Iwasaki pupil ability during drawing', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'draw',
                    player1: {
                        honor: 11,
                        inPlay: ['iwasaki-pupil']
                    },
                    player2: {
                        honor: 11,
                        inPlay: []
                    }
                });
            });

            it('during draw bids if the bids are 1 to 5, four honor is trade and only 3 cards are drawn', function() {
                let playerOneHandSize = this.player1.player.hand.size();
                let playerTwoHandSize = this.player2.player.hand.size();
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('5');
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.player1.honor).toBe(11 + 4);
                expect(this.player2.honor).toBe(11 - 4);
                expect(this.player1.player.hand.size()).toBe(playerOneHandSize + 1);
                expect(this.player2.player.hand.size()).toBe(playerTwoHandSize + 3);
            });

            it('should make biding 2 or 3 only draw you one card', function() {
                let playerOneHandSize = this.player1.player.hand.size();
                let playerTwoHandSize = this.player2.player.hand.size();
                this.player1.clickPrompt('3');
                this.player2.clickPrompt('2');
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.player1.player.hand.size()).toBe(playerOneHandSize + 1);
                expect(this.player2.player.hand.size()).toBe(playerTwoHandSize + 1);
            });
        });

        describe('Iwasaki pupil ability stacking if 2 are in play', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'draw',
                    player1: {
                        honor: 11,
                        inPlay: ['iwasaki-pupil']
                    },
                    player2: {
                        honor: 11,
                        inPlay: ['iwasaki-pupil']
                    }
                });
            });

            it('during draw bids if the bids are 1 to 5, four honor is traded and only 1 card is drawn', function() {
                let playerOneHandSize = this.player1.player.hand.size();
                let playerTwoHandSize = this.player2.player.hand.size();
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('5');
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.player1.honor).toBe(11 + 4);
                expect(this.player2.honor).toBe(11 - 4);
                expect(this.player1.player.hand.size()).toBe(playerOneHandSize + 1);
                expect(this.player2.player.hand.size()).toBe(playerTwoHandSize + 1);
            });
        });
    });
});
