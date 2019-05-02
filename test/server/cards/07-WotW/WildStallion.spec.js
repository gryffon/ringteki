describe('Wild Stallion', function() {
    integration(function() {
        describe('Wild Stallion ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['wild-stallion', 'moto-youth','iuchi-wayfinder']
                    }
                });
                this.wildStallion = this.player1.findCardByName('wild-stallion');
                this.motoYouth = this.player1.findCardByName('moto-youth');
                this.wayfinder = this.player1.findCardByName('iuchi-wayfinder');

            });

            it('should not trigger if there is no current conflict', function () {
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.wildStallion);
                expect(this.player1).not.toHavePrompt('Choose a character');
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should not work if participating in a conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.wildStallion],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.wildStallion);
                expect(this.player1).not.toHavePrompt('Choose a character');
            });

            it('should work if not participating in a conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.motoYouth],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.wildStallion);
                expect(this.player1).toHavePrompt('Choose a character');
            });

            it('should let you choose other characters not in a conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.motoYouth],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.wildStallion);
                expect(this.player1).toBeAbleToSelect(this.wayfinder);
                expect(this.player1).not.toBeAbleToSelect(this.motoYouth);
                expect(this.player1).not.toBeAbleToSelect(this.wildStallion);
            });

            it('should move chosen character and wild stallion to the conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.motoYouth],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.wildStallion);
                this.player1.clickCard(this.wayfinder);
                expect(this.wildStallion.inConflict).toBe(true);
                expect(this.wayfinder.inConflict).toBe(true);
                expect(this.getChatLogs(3)).toContain('player1 uses Wild Stallion to move Iuchi Wayfinder and Wild Stallion into the conflict');
            });

            it('should let you chose no characters to move to the conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.motoYouth],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.wildStallion);
                this.player1.clickPrompt('Done');
                expect(this.wildStallion.inConflict).toBe(true);
                expect(this.wayfinder.inConflict).toBe(false);
                expect(this.getChatLogs(3)).toContain('player1 uses Wild Stallion to move Wild Stallion into the conflict');
            });
        });
    });
});
