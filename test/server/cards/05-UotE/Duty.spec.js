describe('Duty', function() {
    integration(function() {
        describe('Duty\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'draw',
                    player1: {
                        honor: 3,
                        inPlay: ['soshi-illusionist'],
                        hand: ['duty', 'force-of-the-river', 'assassination', 'banzai'],
                        dynastyDiscard: ['imperial-storehouse', 'favorable-ground']
                    },
                    player2: {
                        honor: 11,
                        inPlay: ['doji-whisperer'],
                        hand: ['assassination']
                    }
                });

                this.soshiIllusionist = this.player1.findCardByName('soshi-illusionist');
                this.imperialStorehouse = this.player1.placeCardInProvince('imperial-storehouse');
                this.favorableGround = this.player1.placeCardInProvince('favorable-ground', 'province 2');

                this.dojiWhisperer = this.player2.findCardByName('doji-whisperer');
            });

            it('should trigger when losing due to draw bids', function() {
                this.player1.clickPrompt('5');
                this.player2.clickPrompt('1');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect('duty');
                this.duty = this.player1.clickCard('duty');
                expect(this.player1.honor).toBe(4);
                expect(this.player2.honor).toBe(11);
                expect(this.player1.player.hand.size()).toBe(8);
                expect(this.player2.player.hand.size()).toBe(2);
                expect(this.duty.location).toBe('conflict discard pile');
            });

            it('should trigger when losing due to running out of conflict cards', function() {
                this.player1.player.conflictDeck.each(card => {
                    this.player1.player.moveCard(card, 'conflict discard pile');
                });
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect('duty');
                this.duty = this.player1.clickCard('duty');
                expect(this.player1.honor).toBe(4);
                expect(this.player2.honor).toBe(11);
                expect(this.player1.player.hand.size()).toBe(4);
                expect(this.player2.player.hand.size()).toBe(2);
            });

            it('should not trigger when losing due paying a cost', function() {
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                this.noMoreActions();
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.soshiIllusionist],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard('assassination');
                this.player1.clickCard(this.dojiWhisperer);
                expect(this.player1).toHavePrompt('Game Won');
            });

            it('should trigger when losing due to running out of dynasty cards', function() {
                this.player1.player.dynastyDeck.each(card => {
                    this.player1.player.moveCard(card, 'dynasty discard pile');
                });
                this.imperialStorehouse.facedown = true;
                this.favorableGround.facedown = true;
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                this.forceOfTheRiver = this.player1.playAttachment('force-of-the-river', this.soshiIllusionist);
                this.noMoreActions();
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.soshiIllusionist],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.forceOfTheRiver);
                expect(this.imperialStorehouse.location).toBe('removed from game');
                expect(this.favorableGround.location).toBe('removed from game');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect('duty');
                this.duty = this.player1.clickCard('duty');
                expect(this.player1.honor).toBe(4);
                expect(this.player2.honor).toBe(11);
                expect(this.duty.location).toBe('conflict discard pile');
            });

            it('should trigger when losing due to dishonored character leaving play', function() {
                this.soshiIllusionist.dishonor();
                this.player1.honor = 1;
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                this.noMoreActions();
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.soshiIllusionist],
                    defenders: []
                });
                this.player2.clickCard('assassination');
                this.player2.clickCard(this.soshiIllusionist);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect('duty');
                this.duty = this.player1.clickCard('duty');
                expect(this.player1.honor).toBe(2);
                expect(this.player2.honor).toBe(8);
                expect(this.duty.location).toBe('conflict discard pile');
                expect(this.soshiIllusionist.location).toBe('dynasty discard pile');
            });

            it('should trigger when Banzai is kicked, but not allow the second resolution', function() {
                this.player1.honor = 1;
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                this.noMoreActions();
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.soshiIllusionist],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard('banzai');
                this.player1.clickCard(this.soshiIllusionist);
                this.player1.clickPrompt('Lose 1 honor to resolve this ability again');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect('duty');
                this.duty = this.player1.clickCard('duty');
                expect(this.player1.honor).toBe(2);
                expect(this.player2.honor).toBe(11);
                expect(this.duty.location).toBe('conflict discard pile');
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.soshiIllusionist.militarySkill).toBe(3);
            });

            it('should not trigger when its the last card in the deck and 5 cards are drawn', function() {
                this.player1.player.conflictDeck.each(card => {
                    this.player1.player.moveCard(card, 'conflict discard pile');
                });
                this.player1.moveCard('duty', 'conflict deck');
                this.player1.clickPrompt('5');
                this.player2.clickPrompt('5');
                expect(this.player1).toHavePrompt('Game Won');
            });
        });
    });
});
