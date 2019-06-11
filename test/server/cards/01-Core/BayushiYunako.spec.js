describe('Bayushi Yunako', function () {
    integration(function () {
        describe('Bayushi Yunako\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['bayushi-yunako', 'bayushi-shoju', 'bayushi-liar']
                    },
                    player2: {
                        inPlay: ['yogo-hiroue', 'goblin-sneak']
                    }
                });

                this.bayushiShoju = this.player1.findCardByName('bayushi-shoju');
                this.bayushiYunako = this.player1.findCardByName('bayushi-yunako');
                this.bayushiLiar = this.player1.findCardByName('bayushi-liar');
                this.yogoHiroue = this.player2.findCardByName('yogo-hiroue');
                this.goblinSneak = this.player2.findCardByName('goblin-sneak');
            });

            it('switches the base mil and pol values', function () {
                this.noMoreActions();
                let baseMil = this.yogoHiroue.getBaseMilitarySkill();
                let basePol = this.yogoHiroue.getBasePoliticalSkill();
                this.initiateConflict({
                    attackers: [this.bayushiYunako],
                    defenders: [this.yogoHiroue]
                });
                this.player2.pass();
                this.player1.clickCard(this.bayushiYunako);
                expect(this.player1).toHavePrompt('Bayushi Yunako');
                this.player1.clickCard(this.yogoHiroue);
                expect(this.yogoHiroue.getBaseMilitarySkill()).toBe(basePol);
                expect(this.yogoHiroue.getBasePoliticalSkill()).toBe(baseMil);
            });

            it('can\'t target characters with dashes', function () {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.bayushiYunako],
                    defenders: [this.yogoHiroue]
                });
                this.player2.pass();
                this.player1.clickCard(this.bayushiYunako);
                expect(this.player1).toHavePrompt('Bayushi Yunako');
                expect(this.player1).toBeAbleToSelect(this.bayushiYunako);
                expect(this.player1).toBeAbleToSelect(this.yogoHiroue);
                expect(this.player1).toBeAbleToSelect(this.bayushiShoju);
                expect(this.player1).not.toBeAbleToSelect(this.bayushiLiar);
                expect(this.player1).not.toBeAbleToSelect(this.goblinSneak);
            });

            it('can\'t trigger at home', function () {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.bayushiShoju],
                    defenders: [this.yogoHiroue]
                });
                this.player2.pass();
                this.player1.clickCard(this.bayushiYunako);
                expect(this.player1).not.toHavePrompt('Bayushi Yunako');
            });
        });
    });
});
