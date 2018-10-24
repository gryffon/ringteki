describe('Alibi Artist', function() {
    integration(function() {
        describe('Alibi Artist\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['alibi-artist'],
                        hand: ['reprieve','fine-katana','ornate-fan']
                    },
                    player2: {
                    }
                });
                this.artist = this.player1.findCardByName('alibi-artist');
                this.katana = this.player1.findCardByName('fine-katana');
                this.fan = this.player1.findCardByName('ornate-fan');
                this.reprieve = this.player1.findCardByName('reprieve');
            });

            describe('if the conflict deck is empty', function () {
                beforeEach(function () {
                    this.player1.player.conflictDeck.each(card => {
                        this.player1.player.moveCard(card, 'conflict discard pile');
                    });
                });

                it('should not trigger', function () {
                    this.player1.honor = 4;
                    this.player1.clickCard('alibi-artist');
                    expect(this.player1).not.toHavePrompt('Choose a card to put in your hand');
                });
            });

            it('should only work at 6 honor or less', function() {
                this.player1.honor = 7;
                this.player1.clickCard('alibi-artist');
                expect(this.player1).not.toHavePrompt('Choose a card to put in your hand');
            });

            it('should work at 6 or less honor and correctly put cards in hand and at bottom of conflict deck', function() {
                this.player1.honor = 4;
                this.player1.moveCard(this.reprieve, 'conflict deck');
                this.player1.moveCard(this.fan, 'conflict deck');
                this.player1.clickCard('alibi-artist');
                expect(this.player1).toHavePrompt('Choose a card to put in your hand');
                this.player1.clickPrompt('Ornate Fan');
                expect(this.fan.location).toBe('hand');
                expect(this.player1.player.conflictDeck.last()).toBe(this.reprieve);
            });
        });
    });
});

