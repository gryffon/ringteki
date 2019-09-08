describe('Stride the waves', function () {
    integration(function () {
        describe('Stride the waves\' ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['solemn-scholar'],
                        hand: ['stride-the-waves']
                    },
                    player2: {
                        inPlay: ['akodo-kage']
                    }
                });

                this.solemnScholar = this.player1.findCardByName('solemn-scholar');
                this.strideTheWaves = this.player1.findCardByName('stride-the-waves');

                this.akodoKage = this.player2.findCardByName('akodo-kage');

                this.player1.claimRing('water');

                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.solemnScholar],
                    defenders: [this.akodoKage]
                });
            });

            it('should not be allowed to be attached to an opponents character', function() {
                this.player2.pass();
                this.player1.clickCard(this.strideTheWaves);

                expect(this.player1).not.toBeAbleToSelect(this.akodoKage);
                expect(this.player1).toBeAbleToSelect(this.solemnScholar);
            });

            it('should allow you to move from and back to the conflict', function() {
                this.player2.pass();
                this.player1.playAttachment(this.strideTheWaves, this.solemnScholar);
                this.player2.pass();

                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.strideTheWaves.parent).toBe(this.solemnScholar);

                this.player1.clickCard(this.strideTheWaves);
                expect(this.solemnScholar.inConflict).toBe(false);

                this.player2.pass();

                this.player1.clickCard(this.strideTheWaves);
                expect(this.solemnScholar.inConflict).toBe(true);

                this.player2.pass();

                expect(this.player1).not.toBeAbleToSelect(this.strideTheWaves);
                this.player1.clickCard(this.strideTheWaves);
                expect(this.solemnScholar.inConflict).toBe(true);
            });
        });
    });
});
