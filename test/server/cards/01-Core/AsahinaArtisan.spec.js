describe('Asahina Artisan', function () {
    integration(function () {
        describe('Asahina Artisan\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['asahina-artisan', 'brash-samurai', 'miya-mystic']
                    },
                    player2: {
                        inPlay: ['daidoji-uji']
                    }
                });
                this.asahinaArtisan = this.player1.findCardByName('asahina-artisan');
                this.brashSamurai = this.player1.findCardByName('brash-samurai');
                this.miyaMystic = this.player1.findCardByName('miya-mystic');
                this.daidojiUji = this.player2.findCardByName('daidoji-uji');
            });

            it('should not trigger outside of a conflict', function () {
                this.player1.clickCard(this.asahinaArtisan);
                expect(this.player1).not.toHavePrompt('Asahina Artisan');
            });

            it('should target other Crane characters only', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.brashSamurai],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.asahinaArtisan);
                expect(this.player1).toHavePrompt('Asahina Artisan');
                expect(this.player1).toBeAbleToSelect(this.brashSamurai);
                expect(this.player1).toBeAbleToSelect(this.daidojiUji);
                expect(this.player1).not.toBeAbleToSelect(this.asahinaArtisan);
                expect(this.player1).not.toBeAbleToSelect(this.miyaMystic);
            });

            it('should bow Asahina Artisan and give +3 Pol to the target until the end of the conflict', function () {
                this.noMoreActions();
                let politicalSkill = this.brashSamurai.getPoliticalSkill();
                let militarySkill = this.brashSamurai.getMilitarySkill();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.brashSamurai],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.asahinaArtisan);
                this.player1.clickCard(this.brashSamurai);
                expect(this.asahinaArtisan.bowed).toBe(true);
                expect(this.brashSamurai.getMilitarySkill()).toBe(militarySkill);
                expect(this.brashSamurai.getPoliticalSkill()).toBe(politicalSkill + 3);
                this.player2.pass();
                this.player1.pass();
                this.player1.clickPrompt('Yes');
                this.player1.clickPrompt('Gain 2 Honor');
                expect(this.brashSamurai.getMilitarySkill()).toBe(militarySkill);
                expect(this.brashSamurai.getPoliticalSkill()).toBe(politicalSkill);
            });

            it('should not be able to trigger if Asahina Artisan is bowed', function () {
                this.noMoreActions();
                this.asahinaArtisan.bowed = true;
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.brashSamurai],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.asahinaArtisan);
                expect(this.player1).not.toHavePrompt('Asahina Artisan');
            });
        });
    });
});
