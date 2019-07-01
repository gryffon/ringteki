describe('Heartless Intimidator', function () {
    integration(function () {
        describe('Heartless Intimidator\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 6,
                        inPlay: ['heartless-intimidator'],
                        hand: ['backhanded-compliment','policy-debate']
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
                this.backhand = this.player1.findCardByName('backhanded-compliment');
                this.heartless = this.player1.findCardByName('heartless-intimidator');
                this.yurt = this.player2.placeCardInProvince('windswept-yurt', 'province 1');
                this.adeptOfShadows = this.player2.findCardByName('adept-of-shadows');
                this.policyDebate = this.player1.findCardByName('policy-debate');
            });

            it('will not trigger for honor gains', function () {
                this.player1.clickPrompt('Pass');
                this.player2.clickCard(this.yurt);
                this.player2.clickPrompt('Each player gains 2 honor');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
            });

            it('will trigger from an honor loss caused by the player', function () {
                this.player1.clickCard(this.backhand, 'hand');
                this.player1.clickPrompt('player2');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.heartless);
            });

            it('will trigger from a honor loss caused by the opponent', function () {
                this.player1.clickPrompt('Pass');
                this.player2.clickCard('adept-of-shadows');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.heartless);
            });

            it('will trigger from an honor transfer', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.heartless],
                    defenders: [this.adeptOfShadows]
                });
                this.player2.pass();
                this.player1.clickCard(this.policyDebate);
                this.player1.clickCard(this.heartless);
                this.player1.clickCard(this.adeptOfShadows);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('2');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.heartless);
            });

            it('will trigger from multiple honor losses', function () {
                // Player 1 uses backhanded compliment to cause 1 honor loss
                this.player1.clickCard(this.backhand, 'hand');
                this.player1.clickPrompt('player2');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.heartless);
                this.player1.clickCard(this.heartless);
                // Player 2 returns adept of shadows to hand and loses 1 honor
                this.player2.clickCard('adept-of-shadows');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.heartless);
                this.player1.clickCard(this.heartless);
            });

            it('should not trigger when your opponent\'s deck is empty', function() {
                this.player2.reduceDeckToNumber('conflict deck', 0);
                expect(this.player2.conflictDeck.length).toBe(0);
                this.player1.clickPrompt('Pass');
                this.player2.clickCard('adept-of-shadows');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).toHavePrompt('Action Window');
            });

            describe('when it is activated', function () {
                beforeEach(function () {
                    this.player1.clickPrompt('Pass');
                    this.player2.clickCard('adept-of-shadows');
                });

                it('causes the opponent to discard the top card of their conflict deck', function () {
                    this.initialSize = this.player2.conflictDeck.length;
                    this.topCard = this.player2.conflictDeck[0];
                    this.player1.clickCard(this.heartless);
                    expect(this.player2.conflictDeck.length).toBe(this.initialSize - 1);
                    expect(this.topCard.location).toBe('conflict discard pile');
                });
            });
        });
    });
});
