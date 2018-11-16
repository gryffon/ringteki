describe('Third Tower Guard', function() {
    integration(function() {
        describe('Third Tower Guard\'s constant ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['third-tower-guard']
                    },
                    player2: {
                    }
                });
                this.thirdTowerGuard = this.player1.findCardByName('third-tower-guard');
            });

            it('should give +2 military skill if you have claimed the earth ring', function() {
                let militarySkill = this.thirdTowerGuard.getMilitarySkill();
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.thirdTowerGuard],
                    defenders: [],
                    ring: 'earth',
                    jumpTo: 'afterConflict'
                });
                this.player1.clickPrompt('Don\'t resolve');
                expect(this.game.rings.earth.claimed).toBe(true);
                expect(this.thirdTowerGuard.getMilitarySkill()).toBe(militarySkill + 2);
            });

            it('should give +2 military skill if you have claimed the water ring', function() {
                let militarySkill = this.thirdTowerGuard.getMilitarySkill();
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.thirdTowerGuard],
                    defenders: [],
                    ring: 'water',
                    jumpTo: 'afterConflict'
                });
                this.player1.clickPrompt('Don\'t resolve');
                expect(this.game.rings.water.claimed).toBe(true);
                expect(this.thirdTowerGuard.getMilitarySkill()).toBe(militarySkill + 2);
            });
        });
    });
});
