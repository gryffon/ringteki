describe('Four Temples Advisor', function() {
    integration(function() {
        describe('Four Temples Advisor\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['brash-samurai', 'doji-whisperer'],
                        hand: ['four-temples-advisor']
                    },
                    player2: {
                        inPlay: ['bayushi-shoju']
                    }
                });

                this.brash = this.player1.findCardByName('brash-samurai');
                this.bayushiShoju = this.player2.findCardByName('bayushi-shoju');
                this.advisor = this.player1.findCardByName('four-temples-advisor');
                this.whisperer = this.player1.findCardByName('doji-whisperer');
                this.player1.playAttachment(this.advisor, this.brash);

                this.game.rings.air.fate = 1;
                this.game.rings.void.fate = 1;
            });

            it('should trigger when you gain fate during a conflict in which attached character is participating', function() {
                let handSize = this.player1.hand.length;

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.brash],
                    ring: 'air'
                });
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.advisor);

                this.player1.clickCard(this.advisor);
                expect(this.player1.hand.length).toBe(handSize + 1);
            });

            it('should trigger when you gain fate during a conflict in which attached character is not participating', function() {
                let handSize = this.player1.hand.length;

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.whisperer],
                    ring: 'air'
                });
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.advisor);

                this.player1.clickCard(this.advisor);
                expect(this.player1.hand.length).toBe(handSize + 1);
            });

            it('should be able to trigger more than once', function() {
                let handSize = this.player1.hand.length;

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.whisperer],
                    ring: 'air'
                });
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.advisor);

                this.player1.clickCard(this.advisor);
                expect(this.player1.hand.length).toBe(handSize + 1);

                this.player2.clickPrompt('Done');

                this.noMoreActions();
                this.noMoreActions();
                this.player2.passConflict();
                this.noMoreActions();

                this.initiateConflict({
                    type: 'political',
                    attackers: [this.brash],
                    ring: 'void'
                });
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.advisor);

                this.player1.clickCard(this.advisor);
                expect(this.player1.hand.length).toBe(handSize + 2);
            });

            it('should not trigger when an opponent gains fate during a conflict in which Trusted Advisor is participating', function() {
                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.bayushiShoju],
                    defenders: [this.brash],
                    ring: 'air'
                });
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).not.toBeAbleToSelect(this.advisor);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });
        });
    });
});

