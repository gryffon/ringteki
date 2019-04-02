describe('Wild Stalion', function() {
    integration(function() {
        describe('Wild Stalion ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['wild-stalion', 'moto-youth','iuchi-wayfinder']
                    }
                });
                this.wildStalion = this.player1.findCardByName('wild-stalion');
                this.motoYouth = this.player1.findCardByName('moto-youth');
                this.wayfinder = this.player1.findCardByName('iuchi-wayfinder');
                this.noMoreActions();
            });

            it('should not work if participating in a conflict', function() {
                this.initiateConflict({
                    attackers: [this.wildStalion],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.wildStalion);
                expect(this.player1).not.toHavePrompt('Choose a character');
            });

            it('should work if not participating in a conflict', function() {
                this.initiateConflict({
                    attackers: [this.motoYouth],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.wildStalion);
                expect(this.player1).toHavePrompt('Choose a character');
            });

            it('should let you choose other characters not in a conflict', function() {
                this.initiateConflict({
                    attackers: [this.motoYouth],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.wildStalion);
                expect(this.player1).toBeAbleToSelect(this.wayfinder);
                expect(this.player1).not.toBeAbleToSelect(this.motoYouth);
                expect(this.player1).not.toBeAbleToSelect(this.wildStalion);
            });

            it('should move chosen character and wild stalion to the conflict', function() {
                this.initiateConflict({
                    attackers: [this.motoYouth],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.wildStalion);
                this.player1.clickCard(this.wayfinder);
                expect(this.wildStalion.inConflict).toBe(true);
                expect(this.wayfinder.inConflict).toBe(true);
            });

            it('should let you chose no characters to move to the conflict', function() {
                this.initiateConflict({
                    attackers: [this.motoYouth],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.wildStalion);
                this.player1.clickPrompt('No More Targets');
                expect(this.wildStalion.inConflict).toBe(true);
                expect(this.wayfinder.inConflict).toBe(false);
            });
        });
    });
});
