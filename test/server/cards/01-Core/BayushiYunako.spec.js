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
                        inPlay: ['yogo-hiroue', 'goblin-sneak', 'akodo-makoto'],
                        hand: ['way-of-the-lion'],
                        conflictDiscard: ['way-of-the-lion']
                    }
                });

                this.bayushiShoju = this.player1.findCardByName('bayushi-shoju');
                this.bayushiYunako = this.player1.findCardByName('bayushi-yunako');
                this.bayushiLiar = this.player1.findCardByName('bayushi-liar');
                this.yogoHiroue = this.player2.findCardByName('yogo-hiroue');
                this.goblinSneak = this.player2.findCardByName('goblin-sneak');
                this.akodoMakoto = this.player2.findCardByName('akodo-makoto');
                this.wayOfTheLion = this.player2.findCardByName('way-of-the-lion');
                this.wayOfTheLion2 = this.player2.findCardByName('way-of-the-lion', 'conflict discard pile');
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

            it('should switch using values at the point of resolution', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.bayushiYunako],
                    defenders: [this.akodoMakoto]
                });
                expect(this.akodoMakoto.getBaseMilitarySkill()).toBe(4);
                expect(this.akodoMakoto.getBasePoliticalSkill()).toBe(1);
                expect(this.akodoMakoto.getMilitarySkill()).toBe(4);
                expect(this.akodoMakoto.getPoliticalSkill()).toBe(1);
                this.player2.clickCard(this.wayOfTheLion);
                this.player2.clickCard(this.akodoMakoto);
                expect(this.akodoMakoto.getBaseMilitarySkill()).toBe(8);
                expect(this.akodoMakoto.getBasePoliticalSkill()).toBe(1);
                expect(this.akodoMakoto.getMilitarySkill()).toBe(8);
                expect(this.akodoMakoto.getPoliticalSkill()).toBe(1);
                this.player1.clickCard(this.bayushiYunako);
                this.player1.clickCard(this.akodoMakoto);
                expect(this.akodoMakoto.getBaseMilitarySkill()).toBe(1);
                expect(this.akodoMakoto.getBasePoliticalSkill()).toBe(8);
                expect(this.akodoMakoto.getMilitarySkill()).toBe(1);
                expect(this.akodoMakoto.getPoliticalSkill()).toBe(8);
                this.player2.moveCard(this.wayOfTheLion2, 'hand');
                this.player2.clickCard(this.wayOfTheLion2);
                this.player2.clickCard(this.akodoMakoto);
                expect(this.akodoMakoto.getBaseMilitarySkill()).toBe(2);
                expect(this.akodoMakoto.getBasePoliticalSkill()).toBe(8);
                expect(this.akodoMakoto.getMilitarySkill()).toBe(2);
                expect(this.akodoMakoto.getPoliticalSkill()).toBe(8);
            });
        });
    });
});
