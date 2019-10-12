describe('Those Who Serve', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'dynasty',
                player1: {
                    fate: 10,
                    hand: ['those-who-serve', 'ikoma-reservist'],
                    dynastyDeck: ['tactician-s-apprentice', 'gifted-tactician']
                },
                player2: {
                    fate: 10,
                    dynastyDeck: ['fushicho']
                }
            });
            this.thoseWhoServe = this.player1.findCardByName('those-who-serve');
            this.ikomaReservist = this.player1.findCardByName('ikoma-reservist');
            this.tacticiansApprentice = this.player1.placeCardInProvince('tactician-s-apprentice', 'province 1');
            this.giftedTactician = this.player1.placeCardInProvince('gifted-tactician', 'province 2');
            this.birb = this.player2.placeCardInProvince('fushicho', 'province 1');
        });

        it('should reduce own character cost by 1', function() {
            this.player1.clickCard(this.thoseWhoServe);
            this.player2.clickCard(this.birb);
            this.player2.clickPrompt('2');
            this.player1.clickCard(this.tacticiansApprentice);
            this.player1.clickPrompt('2');
            expect(this.player2.fate).toBe(2); // 10 - undiscounted birb with 2 fate
            this.player2.pass();
            this.player1.clickCard(this.giftedTactician);
            this.player1.clickPrompt('2');
            expect(this.player1.fate).toBe(4); // 10 - 1 TWS - 0 TA - 1 GT - 4 fate on characters
        });

        it('should not work past dynasty phase', function() {
            this.player1.clickCard(this.thoseWhoServe);
            this.player2.pass(); // player2 gets passing fate
            this.player1.pass();
            this.player1.clickPrompt('1'); // Bid
            this.player2.clickPrompt('1'); // Bid
            this.player1.clickCard(this.ikomaReservist);
            this.player1.clickPrompt('0');
            expect(this.player1.fate).toBe(8); // 10 - 1 TWS - 1 IR
        });
    });
});
