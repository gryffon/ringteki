describe('Oracle of Stone', function() {
    integration(function() {
        describe('Oracle of Stone\'s effect', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        conflictDeck: [
                            'charge',
                            'spyglass',
                            'mantra-of-fire',
                            'mantra-of-water'
                        ],
                        hand: ['oracle-of-stone']
                    },
                    player2: {
                        conflictDeck: [
                            'mantra-of-fire',
                            'mantra-of-water'
                        ],
                        hand: [
                            'charge',
                            'spyglass'
                        ]
                    }
                });
                this.oracleOfStone = this.player1.findCardByName('oracle-of-stone');
            });

            it('should draw 2 cards', function() {
                let hand = this.player1.hand.length;
                let conflictDeck = this.player1.conflictDeck.length;
                let hand2 = this.player2.hand.length;
                let conflictDeck2 = this.player2.conflictDeck.length;
                this.player1.clickCard(this.oracleOfStone);
                expect(this.player1.hand.length).toBe(hand + 1);
                expect(this.player1.conflictDeck.length).toBe(conflictDeck - 2);
                expect(this.player2.hand.length).toBe(hand2 + 2);
                expect(this.player2.conflictDeck.length).toBe(conflictDeck2 - 2);
            });

            it('should discard 2 cards', function() {
                this.player1.clickCard(this.oracleOfStone);
                let hand = this.player2.hand.length;
                this.player2.clickCard('charge');
                this.player2.clickCard('mantra-of-water');
                // expect(this.player2.hand.length).toBe(hand - 2);
                console.log(this.player1.formatPrompt(), '\n--');
                console.log(this.player2.formatPrompt());
            });
        });
    });
});
