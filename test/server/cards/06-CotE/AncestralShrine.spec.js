describe('Ancestral Shrine', function () {
    integration(function () {
        describe('Ancestral Shrine\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        dynastyDiscard: ['ancestral-shrine'],
                        honor: 10
                    }
                });

                this.shrine = this.player1.placeCardInProvince('ancestral-shrine', 'province 1');
            });

            it('should not prompt the player to return a ring if none are claimed', function () {
                this.player1.clickCard(this.shrine);
                expect(this.player1).not.toHavePrompt('Choose a ring to return');
            });

            it('should not give honor if action is canceled', function () {
                this.player1.claimRing('earth');
                this.player1.clickCard(this.shrine);
                expect(this.player1).toHavePrompt('Choose a ring to return');
                this.player1.clickPrompt('Cancel');
                expect(this.player1.honor).toBe(10);
            });

            it('should prompt the player to return a ring', function () {
                this.player1.claimRing('earth');
                this.player1.clickCard(this.shrine);
                expect(this.player1).toHavePrompt('Choose a ring to return');
                this.player1.clickRing('air');
                expect(this.player1).toHavePrompt('Choose a ring to return');
                this.player1.clickRing('fire');
                expect(this.player1).toHavePrompt('Choose a ring to return');
                this.player1.clickRing('water');
                expect(this.player1).toHavePrompt('Choose a ring to return');
                this.player1.clickRing('void');
                expect(this.player1).toHavePrompt('Choose a ring to return');
            });

            it('should give honor equal to the number of rings returned', function () {
                this.player1.claimRing('earth');
                this.player1.claimRing('air');
                this.player1.clickCard(this.shrine);
                expect(this.player1).toHavePrompt('Choose a ring to return');
                expect(this.player1).toBeAbleToSelectRing('earth');
                expect(this.player1).not.toBeAbleToSelectRing('fire');
                expect(this.player1).toBeAbleToSelectRing('air');
                this.player1.clickRing('earth');
                expect(this.player1).toHavePrompt('Choose a ring to return');
                expect(this.player1).toBeAbleToSelectRing('air');
                this.player1.clickRing('air');
                expect(this.game.rings.earth.isUnclaimed()).toBe(true);
                expect(this.game.rings.air.isUnclaimed()).toBe(true);
                expect(this.player1.honor).toBe(12);
            });
        });
    });
});
