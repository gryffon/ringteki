describe('Fight On', function() {
    integration(function() {
        describe('Fight On\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shrewd-yasuki', 'vanguard-warrior']
                    },
                    player2: {
                        inPlay: ['borderlands-defender'],
                        hand: ['fight-on']
                    }
                });

                this.borderlandsDefender = this.player2.inPlay[0];
                this.borderlandsDefender.bow();
                this.vaguardWarrior = this.player1.inPlay[1];
                this.vaguardWarrior.bow();
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: ['shrewd-yasuki'],
                    defenders: []
                });
            });

            it('should ready controllers bowed character and move it to the conflict', function() {
                this.player2.clickCard('fight-on');
                this.player2.clickCard(this.borderlandsDefender);
                expect(this.borderlandsDefender.bowed).toBeFalsy();
                expect(this.borderlandsDefender.inConflict).toBeTruthy();
            });

            it('should not work on an opponents character', function() {
                this.player2.clickCard('fight-on');
                this.player2.clickCard(this.vaguardWarrior);
                expect(this.vaguardWarrior.bowed).toBeTruthy();
                expect(this.vaguardWarrior.inConflict).toBeFalsy();
            });
        });
    });
});
