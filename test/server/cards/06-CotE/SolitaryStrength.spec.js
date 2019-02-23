describe('Solitary Strength', function() {
    integration(function() {
        describe('Solitary Strength\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shiba-tsukune','serene-warrior'],
                        hand: ['solitary-strength'],
                        dynastyDeck: ['favorable-ground'],
                        honor: 10
                    },
                    player2: {
                        inPlay: ['matsu-berserker'],
                        hand: ['test-of-courage']
                    }
                });
                this.tsukune = this.player1.findCardByName('shiba-tsukune');
                this.solitaryStrength = this.player1.findCardByName('solitary-strength');
                this.warrior = this.player1.findCardByName('serene-warrior');
                this.favorableGround = this.player1.placeCardInProvince('favorable-ground', 'province 1');

                this.berserker = this.player2.findCardByName('matsu-berserker');
                this.testOfCourage = this.player2.findCardByName('test-of-courage');

                this.noMoreActions();

                this.player1.player.showBid = 5;
                this.player2.player.showBid = 1;

                this.initiateConflict({
                    attackers: ['shiba-tsukune'],
                    defenders: []
                });
            });

            it('should correctly give 1 honor after winning a conflict', function() {
                this.player2.pass();
                this.player1.clickCard(this.solitaryStrength);
                this.player1.clickCard(this.tsukune);
                this.player2.pass();
                this.player1.pass();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.solitaryStrength);
                this.player1.clickCard(this.solitaryStrength);
                expect(this.player1.honor).toBe(11);
            });

            it('should be discarded if character is not participating alone', function() {
                this.player2.pass();
                this.player1.clickCard(this.solitaryStrength);
                this.player1.clickCard(this.tsukune);
                this.player2.pass();
                this.player1.clickCard(this.favorableGround);
                this.player1.clickCard(this.warrior);
                expect(this.solitaryStrength.location).toBe('conflict discard pile');
            });

            it('should be immediately discarded after being played if attached character is not participating alone', function() {
                this.player2.pass();
                this.player1.clickCard(this.favorableGround);
                this.player1.clickCard(this.warrior);
                this.player2.pass();
                this.player1.clickCard(this.solitaryStrength);
                this.player1.clickCard(this.tsukune);
                expect(this.solitaryStrength.location).toBe('conflict discard pile');
            });

            it('should not be discarded if attached character is the only participating character in the conflict', function() {
                this.player2.pass();
                this.player1.clickCard(this.solitaryStrength);
                this.player1.clickCard(this.tsukune);
                expect(this.solitaryStrength.location).not.toBe('conflict discard pile');
                expect(this.tsukune.attachments.toArray()).toContain(this.solitaryStrength);
            });

            it('should not be discarded if an opposing character is participating', function() {
                this.player2.pass();
                this.player1.clickCard(this.solitaryStrength);
                this.player1.clickCard(this.tsukune);
                expect(this.solitaryStrength.location).not.toBe('conflict discard pile');
                expect(this.tsukune.attachments.toArray()).toContain(this.solitaryStrength);
                this.player2.clickCard(this.testOfCourage);
                this.player2.clickCard(this.berserker);
                expect(this.berserker.inConflict).toBe(true);
                expect(this.solitaryStrength.location).not.toBe('conflict discard pile');
                expect(this.tsukune.attachments.toArray()).toContain(this.solitaryStrength);
            });

            it('should not be discarded after being attached to an opposing character participating alone', function() {
                this.player2.clickCard(this.testOfCourage);
                this.player2.clickCard(this.berserker);
                expect(this.berserker.inConflict).toBe(true);
                this.player1.clickCard(this.favorableGround);
                this.player1.clickCard(this.tsukune);
                expect(this.tsukune.inConflict).toBe(false);
                this.player2.pass();
                this.player1.clickCard(this.solitaryStrength);
                this.player1.clickCard(this.berserker);
                expect(this.solitaryStrength.location).not.toBe('conflict discard pile');
                expect(this.berserker.attachments.toArray()).toContain(this.solitaryStrength);
            });
        });
    });
});

