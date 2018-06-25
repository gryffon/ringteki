describe('Heartless Intimidator', function () {
    integration(function () {
        describe('Heartless Intimidator\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['heartless-intimidator'],
                        hand: []
                    },
                    player2: {
                        honor: 10,
                        fate: 10,
                        inPlay: ['adept-of-shadows'],
                        dynastyDeck: ['windswept-yurt'],
                        hand: [],
                        conflictDeck: ['seeker-of-knowledge']
                    }
                });
                this.heartless = this.player1.findCardByName('heartless-intimidator');
                this.yurt = this.player2.placeCardInProvince('windswept-yurt', 'province 1');
            });

            it('will not trigger for honor gains', function() {
                this.player1.clickPrompt('Pass');
                this.player2.clickCard(this.yurt);
                this.player2.clickPrompt('Each player gains 2 honor');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');

            });

            describe('when an opponent loses an honor', function() {
                beforeEach(function () {
                    this.player1.clickPrompt('Pass');
                });

                it('make the opponent discard a card from the top of their conflict deck', function () {
                    this.player2.clickCard('adept-of-shadows');
                    this.initialSize = this.player2.conflictDeck.length;
                    this.topCard = this.player2.conflictDeck[0];
                    expect(this.player1).toHavePrompt('Triggered Abilities');
                    expect(this.player1).toBeAbleToSelect(this.heartless);
                    this.player1.clickCard(this.heartless);
                    expect(this.player2.conflictDeck.length).toBe(this.initialSize - 1);
                    expect(this.topCard.location).toBe('conflict discard pile');
                });
            });
        });
    });
});
