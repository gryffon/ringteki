describe('Kitsuki Kagi', function() {
    integration(function() {
        describe('Kitsuki Kagi\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['kitsuki-kagi'],
                        dynastyDiscard: ['imperial-storehouse', 'seppun-guardsman', 'otomo-courtier', 'yogo-hiroue'],
                        conflictDiscard: ['ambush', 'assassination', 'blackmail', 'censure']
                    },
                    player2: {
                        inPlay: [],
                        dynastyDiscard: ['aranat', 'adept-of-the-waves', 'agasha-shunsen', 'agasha-sumiko'],
                        conflictDiscard: ['compass', 'dispatch', 'duty', 'gossip']
                    }
                });

                this.kagi = this.player1.findCardByName('kitsuki-kagi');
                this.p1d1 = this.player1.findCardByName('imperial-storehouse');
                this.p1d2 = this.player1.findCardByName('seppun-guardsman');
                this.p1d3 = this.player1.findCardByName('otomo-courtier');
                this.p1d4 = this.player1.findCardByName('yogo-hiroue');

                this.p1c1 = this.player1.findCardByName('ambush');
                this.p1c2 = this.player1.findCardByName('assassination');
                this.p1c3 = this.player1.findCardByName('blackmail');
                this.p1c4 = this.player1.findCardByName('censure');

                this.p2d1 = this.player2.findCardByName('aranat');
                this.p2d2 = this.player2.findCardByName('adept-of-the-waves');
                this.p2d3 = this.player2.findCardByName('agasha-shunsen');
                this.p2d4 = this.player2.findCardByName('agasha-sumiko');

                this.p2c1 = this.player2.findCardByName('compass');
                this.p2c2 = this.player2.findCardByName('dispatch');
                this.p2c3 = this.player2.findCardByName('duty');
                this.p2c4 = this.player2.findCardByName('gossip');

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.kagi],
                    defenders: []
                });
            });

            it('should react if it wins the conflict', function() {
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.kagi);
            });

            it('should allow targetting cards in discard piles', function() {
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.kagi);
                this.player1.clickCard(this.kagi);
                expect(this.player1).toBeAbleToSelect(this.p1d1);
                expect(this.player1).toBeAbleToSelect(this.p1d2);
                expect(this.player1).toBeAbleToSelect(this.p1d3);
                expect(this.player1).toBeAbleToSelect(this.p1d4);
                expect(this.player1).toBeAbleToSelect(this.p1c1);
                expect(this.player1).toBeAbleToSelect(this.p1c2);
                expect(this.player1).toBeAbleToSelect(this.p1c3);
                expect(this.player1).toBeAbleToSelect(this.p1c4);
                expect(this.player1).toBeAbleToSelect(this.p2d1);
                expect(this.player1).toBeAbleToSelect(this.p2d2);
                expect(this.player1).toBeAbleToSelect(this.p2d3);
                expect(this.player1).toBeAbleToSelect(this.p2d4);
                expect(this.player1).toBeAbleToSelect(this.p2c1);
                expect(this.player1).toBeAbleToSelect(this.p2c2);
                expect(this.player1).toBeAbleToSelect(this.p2c3);
                expect(this.player1).toBeAbleToSelect(this.p2c4);
            });

            it('should be allowed to cancel and restart selection process', function() {
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.kagi);
                this.player1.clickCard(this.kagi);
                expect(this.player1).toBeAbleToSelect(this.p1d1);
                this.player1.clickCard(this.p1d1);
                expect(this.player1).not.toBeAbleToSelect(this.p1d1);
                this.player1.clickPrompt('Cancel');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.clickCard(this.kagi);
                expect(this.player1).toBeAbleToSelect(this.p1d1);
                this.player1.clickCard(this.p1d1);
                expect(this.player1).not.toBeAbleToSelect(this.p1d1);
            });

            it('should not allow mixing discard piles', function() {
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.kagi);
                this.player1.clickCard(this.kagi);
                this.player1.clickCard(this.p1d1);

                expect(this.player1).not.toBeAbleToSelect(this.p1d1);
                expect(this.player1).toBeAbleToSelect(this.p1d2);
                expect(this.player1).toBeAbleToSelect(this.p1d3);
                expect(this.player1).toBeAbleToSelect(this.p1d4);
                expect(this.player1).not.toBeAbleToSelect(this.p1c1);
                expect(this.player1).not.toBeAbleToSelect(this.p1c2);
                expect(this.player1).not.toBeAbleToSelect(this.p1c3);
                expect(this.player1).not.toBeAbleToSelect(this.p1c4);
                expect(this.player1).not.toBeAbleToSelect(this.p2d1);
                expect(this.player1).not.toBeAbleToSelect(this.p2d2);
                expect(this.player1).not.toBeAbleToSelect(this.p2d3);
                expect(this.player1).not.toBeAbleToSelect(this.p2d4);
                expect(this.player1).not.toBeAbleToSelect(this.p2c1);
                expect(this.player1).not.toBeAbleToSelect(this.p2c2);
                expect(this.player1).not.toBeAbleToSelect(this.p2c3);
                expect(this.player1).not.toBeAbleToSelect(this.p2c4);

                this.player1.clickPrompt('Cancel');
                this.player1.clickCard(this.kagi);
                this.player1.clickCard(this.p1c1);

                expect(this.player1).not.toBeAbleToSelect(this.p1d1);
                expect(this.player1).not.toBeAbleToSelect(this.p1d2);
                expect(this.player1).not.toBeAbleToSelect(this.p1d3);
                expect(this.player1).not.toBeAbleToSelect(this.p1d4);
                expect(this.player1).not.toBeAbleToSelect(this.p1c1);
                expect(this.player1).toBeAbleToSelect(this.p1c2);
                expect(this.player1).toBeAbleToSelect(this.p1c3);
                expect(this.player1).toBeAbleToSelect(this.p1c4);
                expect(this.player1).not.toBeAbleToSelect(this.p2d1);
                expect(this.player1).not.toBeAbleToSelect(this.p2d2);
                expect(this.player1).not.toBeAbleToSelect(this.p2d3);
                expect(this.player1).not.toBeAbleToSelect(this.p2d4);
                expect(this.player1).not.toBeAbleToSelect(this.p2c1);
                expect(this.player1).not.toBeAbleToSelect(this.p2c2);
                expect(this.player1).not.toBeAbleToSelect(this.p2c3);
                expect(this.player1).not.toBeAbleToSelect(this.p2c4);

                this.player1.clickPrompt('Cancel');
                this.player1.clickCard(this.kagi);
                this.player1.clickCard(this.p2d1);

                expect(this.player1).not.toBeAbleToSelect(this.p1d1);
                expect(this.player1).not.toBeAbleToSelect(this.p1d2);
                expect(this.player1).not.toBeAbleToSelect(this.p1d3);
                expect(this.player1).not.toBeAbleToSelect(this.p1d4);
                expect(this.player1).not.toBeAbleToSelect(this.p1c1);
                expect(this.player1).not.toBeAbleToSelect(this.p1c2);
                expect(this.player1).not.toBeAbleToSelect(this.p1c3);
                expect(this.player1).not.toBeAbleToSelect(this.p1c4);
                expect(this.player1).not.toBeAbleToSelect(this.p2d1);
                expect(this.player1).toBeAbleToSelect(this.p2d2);
                expect(this.player1).toBeAbleToSelect(this.p2d3);
                expect(this.player1).toBeAbleToSelect(this.p2d4);
                expect(this.player1).not.toBeAbleToSelect(this.p2c1);
                expect(this.player1).not.toBeAbleToSelect(this.p2c2);
                expect(this.player1).not.toBeAbleToSelect(this.p2c3);
                expect(this.player1).not.toBeAbleToSelect(this.p2c4);

                this.player1.clickPrompt('Cancel');
                this.player1.clickCard(this.kagi);
                this.player1.clickCard(this.p2c1);

                expect(this.player1).not.toBeAbleToSelect(this.p1d1);
                expect(this.player1).not.toBeAbleToSelect(this.p1d2);
                expect(this.player1).not.toBeAbleToSelect(this.p1d3);
                expect(this.player1).not.toBeAbleToSelect(this.p1d4);
                expect(this.player1).not.toBeAbleToSelect(this.p1c1);
                expect(this.player1).not.toBeAbleToSelect(this.p1c2);
                expect(this.player1).not.toBeAbleToSelect(this.p1c3);
                expect(this.player1).not.toBeAbleToSelect(this.p1c4);
                expect(this.player1).not.toBeAbleToSelect(this.p2d1);
                expect(this.player1).not.toBeAbleToSelect(this.p2d2);
                expect(this.player1).not.toBeAbleToSelect(this.p2d3);
                expect(this.player1).not.toBeAbleToSelect(this.p2d4);
                expect(this.player1).not.toBeAbleToSelect(this.p2c1);
                expect(this.player1).toBeAbleToSelect(this.p2c2);
                expect(this.player1).toBeAbleToSelect(this.p2c3);
                expect(this.player1).toBeAbleToSelect(this.p2c4);
            });

            it('should remove selected cards from the game', function() {
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.kagi);
                this.player1.clickCard(this.kagi);
                this.player1.clickCard(this.p1d1);
                this.player1.clickCard(this.p1d2);
                this.player1.clickCard(this.p1d3);
                // this.player1.clickPrompt('Done');
                expect(this.p1d1.location).toBe('removed from game');
                expect(this.p1d2.location).toBe('removed from game');
                expect(this.p1d3.location).toBe('removed from game');
            });

            it('should not allow selecting already selected cards', function() {
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.kagi);
                this.player1.clickCard(this.kagi);
                this.player1.clickCard(this.p1d1);
                expect(this.player1).not.toBeAbleToSelect(this.p1d1);

                this.player1.clickCard(this.p1d2);
                expect(this.player1).not.toBeAbleToSelect(this.p1d1);
                expect(this.player1).not.toBeAbleToSelect(this.p1d2);

                this.player1.clickCard(this.p1d3);
                expect(this.p1d1.location).toBe('removed from game');
                expect(this.p1d2.location).toBe('removed from game');
                expect(this.p1d3.location).toBe('removed from game');
            });

            it('should allow selecting less than 3 cards', function() {
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.kagi);
                this.player1.clickCard(this.kagi);
                this.player1.clickCard(this.p1d1);
                this.player1.clickCard(this.p1d2);
                this.player1.clickPrompt('Done');
                expect(this.p1d1.location).toBe('removed from game');
                expect(this.p1d2.location).toBe('removed from game');
            });
        });
    });
});

