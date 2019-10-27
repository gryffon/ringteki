describe('Deduction', function () {
    integration(function () {
        describe('Deduction', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['young-harrier', 'crisis-breaker', 'shiba-tsukune'],
                        hand: ['severed-from-the-stream', 'captive-audience']
                    },
                    player2: {
                        inPlay: ['keeper-initiate'],
                        hand: ['deduction']
                    }
                });
                this.youngHarrier = this.player1.findCardByName('young-harrier');
                this.crisisBreaker = this.player1.findCardByName('crisis-breaker');
                this.tsukune = this.player1.findCardByName('shiba-tsukune');
                this.severed = this.player1.findCardByName('severed-from-the-stream');
                this.captive = this.player1.findCardByName('captive-audience');

                this.keeperInitiate = this.player2.findCardByName('keeper-initiate');
                this.deduction = this.player2.findCardByName('deduction');

                this.player2.claimRing('air');
                this.player2.claimRing('earth');
                this.player2.claimRing('void');

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.youngHarrier, this.crisisBreaker, this.tsukune],
                    defenders: [this.keeperInitiate],
                    ring: 'water',
                    type: 'political'
                });
            });

            it('should allow you to return a single ring during a political conflict to bow a character with cost 3 or less', function () {
                this.player2.clickCard(this.deduction);
                expect(this.player2).toBeAbleToSelect(this.youngHarrier);
                expect(this.player2).toBeAbleToSelect(this.crisisBreaker);
                expect(this.player2).not.toBeAbleToSelect(this.tsukune);
                expect(this.player2).toBeAbleToSelect(this.keeperInitiate);
                this.player2.clickCard(this.youngHarrier);
                expect(this.player2).toBeAbleToSelectRing('air');
                expect(this.player2).toBeAbleToSelectRing('earth');
                expect(this.player2).toBeAbleToSelectRing('void');
                this.player2.clickRing('air');
                expect(this.getChatLogs(3)).toContain('player2 plays Deduction to bow Young Harrier');
                expect(this.player2).not.toBeAbleToSelectRing('air');
                expect(this.player2).not.toBeAbleToSelectRing('earth');
                expect(this.player2).not.toBeAbleToSelectRing('void');
                expect(this.youngHarrier.bowed).toBe(true);
            });

            it('should not work without any rings', function () {
                this.player2.pass();
                this.player1.clickCard(this.severed);
                expect(this.game.rings.air.claimed).toBe(false);
                expect(this.game.rings.earth.claimed).toBe(false);
                expect(this.game.rings.void.claimed).toBe(false);
                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.player2.clickCard(this.deduction);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should not work during a mil conflict', function () {
                this.player2.pass();
                this.player1.clickCard(this.captive);
                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.player2.clickCard(this.deduction);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should not be playable outside a conflict', function () {
                this.noMoreActions();
                this.player1.clickPrompt('No');
                this.player1.clickPrompt('Don\'t Resolve');
                this.player1.pass();
                this.player2.clickCard(this.deduction);
                expect(this.player2).toHavePrompt('Action Window');
            });
        });
    });
});
