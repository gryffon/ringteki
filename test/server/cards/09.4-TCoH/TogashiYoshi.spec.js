describe('Togashi Yoshi', function() {
    integration(function() {
        describe('Togashi Yoshi\'s ability', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['togashi-yoshi'],
                        fate: 6
                    },
                    player2: {
                        inPlay: ['asahina-artisan'],
                        hand: ['way-of-the-crane']
                    }
                });
                this.togashiYoshi = this.player1.findCardByName('togashi-yoshi');
                this.asahinaArtisan = this.player2.findCardByName('asahina-artisan');
                this.wotc = this.player2.findCardByName('way-of-the-crane');

                this.game.rings.air.fate = 1;
            });

            it('should allow you to claim fate of a ring with fate if you win a military conflict', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.togashiYoshi],
                    defenders: [this.asahinaArtisan],
                    ring: 'fire'
                });

                this.player2.pass();
                this.player1.pass();

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.togashiYoshi);

                this.player1.clickCard(this.togashiYoshi);

                this.player1.clickRing('air');
                expect(this.player1.fate).toBe(7);
            });

            it('should allow you to claim fate of a ring with fate if you win a political conflict', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.togashiYoshi],
                    defenders: [this.asahinaArtisan],
                    ring: 'fire'
                });

                this.player2.pass();
                this.player1.pass();

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.togashiYoshi);

                this.player1.clickCard(this.togashiYoshi);

                this.player1.clickRing('air');
                expect(this.player1.fate).toBe(7);
            });

            it('should not allow you to trigger it if you lost the conflict', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.togashiYoshi],
                    defenders: [this.asahinaArtisan],
                    ring: 'fire'
                });

                this.player2.clickCard(this.wotc);
                this.player2.clickCard(this.asahinaArtisan);
                this.player1.pass();
                this.player2.pass();

                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).not.toBeAbleToSelect(this.togashiYoshi);
                expect(this.player1.fate).toBe(6);
            });
        });
    });
});

