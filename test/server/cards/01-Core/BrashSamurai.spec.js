describe('Brash Samurai', function () {
    integration(function () {
        describe('Brash Samurai', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['brash-samurai', 'daidoji-uji']
                    },
                    player2: {
                        inPlay: ['agasha-swordsmith']
                    }
                });

                this.brashSamurai = this.player1.findCardByName('brash-samurai');
                this.daidojiUji = this.player1.findCardByName('daidoji-uji');
                this.agashaSwordsmith = this.player2.findCardByName('agasha-swordsmith');
                this.noMoreActions();
            });

            it('should honor itself as the only attacker', function () {
                this.initiateConflict({
                    attackers: [this.brashSamurai],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.brashSamurai);
                expect(this.brashSamurai.isHonored).toBe(true);
            });

            it('should honor itself as the only defender', function () {
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.agashaSwordsmith],
                    defenders: [this.brashSamurai]
                });
                this.player1.clickCard(this.brashSamurai);
                expect(this.brashSamurai.isHonored).toBe(true);
            });

            it('should not honor itself if there are other participants', function () {
                this.initiateConflict({
                    attackers: [this.brashSamurai, this.daidojiUji],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.brashSamurai);
                expect(this.brashSamurai.isHonored).toBe(false);
            });

            it('should not honor itself outside of a conflict', function () {
                this.player1.passConflict();
                this.player1.clickCard(this.brashSamurai);
                expect(this.brashSamurai.isHonored).toBe(false);
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.agashaSwordsmith],
                    defenders: [this.daidojiUji]
                });
                this.player1.clickCard(this.brashSamurai);
                expect(this.brashSamurai.isHonored).toBe(false);
            });
        });
    });
});
