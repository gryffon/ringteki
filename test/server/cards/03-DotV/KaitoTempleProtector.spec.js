describe('Kaito Temple Protector', function() {
    integration(function() {
        describe('Kaito Temple Protector\'s constant ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['master-of-the-spear']
                    },
                    player2: {
                        inPlay: ['kaito-temple-protector', 'shinjo-outrider']
                    }
                });

                this.masterOfTheSpear = this.player1.findCardByName('master-of-the-spear');

                this.kaitoTempleProtector = this.player2.findCardByName('kaito-temple-protector');
                this.shinjoOutrider = this.player2.findCardByName('shinjo-outrider');

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.masterOfTheSpear],
                    defenders: [this.kaitoTempleProtector]
                });
            });

            it('should make Master of the Spear\'s action illegal if he is the only defender', function() {
                this.player2.pass();
                this.player1.clickCard(this.masterOfTheSpear);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not be a legal target for MotS', function() {
                this.player2.clickCard(this.shinjoOutrider);
                expect(this.shinjoOutrider.inConflict).toBe(true);
                this.player1.clickCard(this.masterOfTheSpear);
                expect(this.player2).toHavePrompt('Master of the Spear');
                expect(this.player2).toBeAbleToSelect(this.shinjoOutrider);
                expect(this.player2).not.toBeAbleToSelect(this.kaitoTempleProtector);
            });
        });

        describe('Kaito Temple Protector\'s triggered ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['master-of-the-spear', 'matsu-seventh-legion', 'venerable-historian'],
                        hand: ['fine-katana', 'ornate-fan']
                    },
                    player2: {
                        inPlay: ['kaito-temple-protector', 'shinjo-outrider']
                    }
                });

                this.masterOfTheSpear = this.player1.findCardByName('master-of-the-spear');
                this.matsuSeventhLegion = this.player1.findCardByName('matsu-seventh-legion');
                this.venerableHistorian = this.player1.findCardByName('venerable-historian');

                this.fineKatana = this.player1.findCardByName('fine-katana');
                this.ornateFan = this.player1.findCardByName('ornate-fan');

                this.kaitoTempleProtector = this.player2.findCardByName('kaito-temple-protector');
                this.shinjoOutrider = this.player2.findCardByName('shinjo-outrider');
            });

            it('should not be triggerable if not defending', function() {
                this.player1.pass();
                expect(this.player2).toHavePrompt('Action Window');
                this.player2.clickCard(this.kaitoTempleProtector);
                expect(this.player2).toHavePrompt('Action Window');
                this.player2.pass();

                this.initiateConflict({
                    attackers: [this.masterOfTheSpear],
                    defenders: [this.shinjoOutrider]
                });

                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.player2.clickCard(this.kaitoTempleProtector);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            describe('when defending', function() {
                beforeEach(function() {
                    this.noMoreActions();
                    this.initiateConflict({
                        attackers: [this.masterOfTheSpear, this.matsuSeventhLegion],
                        defenders: [this.kaitoTempleProtector, this.shinjoOutrider]
                    });
                });

                it('should allow you to choose another participating character', function() {
                    this.player2.clickCard(this.kaitoTempleProtector);
                    expect(this.player2).toHavePrompt('Kaito Temple Protector');
                    expect(this.player2).toBeAbleToSelect(this.masterOfTheSpear);
                    expect(this.player2).toBeAbleToSelect(this.matsuSeventhLegion);
                    expect(this.player2).not.toBeAbleToSelect(this.venerableHistorian);
                    expect(this.player2).toBeAbleToSelect(this.shinjoOutrider);
                    expect(this.player2).not.toBeAbleToSelect(this.kaitoTempleProtector);
                });

                it('should set its mil/pol base skills to chosen character\'s current skills', function() {
                    this.player2.pass();
                    this.player1.clickCard(this.fineKatana);
                    this.player1.clickCard(this.masterOfTheSpear);
                    this.player2.pass();
                    this.player1.clickCard(this.ornateFan);
                    this.player1.clickCard(this.masterOfTheSpear);
                    this.player2.clickCard(this.kaitoTempleProtector);
                    this.player2.clickCard(this.masterOfTheSpear);
                    expect(this.kaitoTempleProtector.getBaseMilitarySkill()).toBe(this.masterOfTheSpear.getMilitarySkill());
                    expect(this.kaitoTempleProtector.getBasePoliticalSkill()).toBe(this.masterOfTheSpear.getPoliticalSkill());
                });

                it('should set as political dash if target is political dash', function() {
                    this.player2.clickCard(this.kaitoTempleProtector);
                    this.player2.clickCard(this.matsuSeventhLegion);
                    expect(this.kaitoTempleProtector.hasDash('political')).toBe(true);
                });
            });

            it('should set as military dash if target is military dash', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.venerableHistorian],
                    defenders: [this.kaitoTempleProtector],
                    type: 'political'
                });

                this.player2.clickCard(this.kaitoTempleProtector);
                this.player2.clickCard(this.venerableHistorian);
                expect(this.kaitoTempleProtector.hasDash('military')).toBe(true);
            });
        });
    });
});
