describe('Court Mask', function () {
    integration(function () {
        describe('Court Mask', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['steward-of-law', 'fawning-diplomat'],
                        hand: ['court-mask']
                    },
                    player2: {
                        inPlay: ['agasha-swordsmith']
                    }
                });

                this.stewardOfLaw = this.player1.findCardByName('steward-of-law');
                this.fawningDiplomat = this.player1.findCardByName('fawning-diplomat');
                this.courtMask = this.player1.findCardByName('court-mask');
                this.agashaSwordsmith = this.player2.findCardByName('agasha-swordsmith');
            });

            it('should only be attachable to your own characters', function () {
                this.player1.clickCard(this.courtMask);
                expect(this.player1).toBeAbleToSelect(this.stewardOfLaw);
                expect(this.player1).toBeAbleToSelect(this.fawningDiplomat);
                expect(this.player1).not.toBeAbleToSelect(this.agashaSwordsmith);
            });

            it('should return to hand and dishonor attached character', function () {
                this.player1.playAttachment(this.courtMask, this.fawningDiplomat);
                this.player2.pass();
                this.player1.clickCard(this.courtMask);
                expect(this.fawningDiplomat.isDishonored).toBe(true);
                expect(this.courtMask.location).toBe('hand');
            });

            it('should return to hand even if attached character is already dishonored', function () {
                this.fawningDiplomat.dishonor();
                expect(this.fawningDiplomat.isDishonored).toBe(true);
                this.player1.playAttachment(this.courtMask, this.fawningDiplomat);
                this.player2.pass();
                this.player1.clickCard(this.courtMask);
                expect(this.fawningDiplomat.isDishonored).toBe(true);
                expect(this.courtMask.location).toBe('hand');
            });

            it('should return to hand even if attached character cannot become dishonored', function () {
                this.player1.playAttachment(this.courtMask, this.fawningDiplomat);
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.stewardOfLaw, this.fawningDiplomat],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.courtMask);
                expect(this.fawningDiplomat.isDishonored).toBe(false);
                expect(this.courtMask.location).toBe('hand');
            });
        });
    });
});
