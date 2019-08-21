describe('Bayushi Yojiro', function() {
    integration(function() {
        describe('Bayushi Yojiro', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['bayushi-yojiro', 'bayushi-aramoro']
                    },
                    player2: {
                        inPlay: ['young-harrier'],
                        hand: ['way-of-the-crane']
                    }
                });
                this.bayushiYojiro = this.player1.findCardByName('bayushi-yojiro');
                this.bayushiAramoro = this.player1.findCardByName('bayushi-aramoro');
                this.youngHarrier = this.player2.findCardByName('young-harrier');
                this.wayOfTheCrane = this.player2.findCardByName('way-of-the-crane');
                this.noMoreActions();
            });

            it('should have no effect if not participating', function() {
                this.initiateConflict({
                    attackers: [this.bayushiAramoro],
                    defenders: [this.youngHarrier]
                });
                expect(this.youngHarrier.getMilitarySkill()).toBe(1);
                expect(this.youngHarrier.getPoliticalSkill()).toBe(1);
                expect(this.youngHarrier.isDishonored).toBe(false);
                this.player2.clickCard(this.youngHarrier);
                expect(this.youngHarrier.isDishonored).toBe(true);
                expect(this.youngHarrier.getMilitarySkill()).toBe(0);
                expect(this.youngHarrier.getPoliticalSkill()).toBe(0);
            });

            it('should stop dishonor status modifying both skills', function() {
                this.initiateConflict({
                    attackers: [this.bayushiYojiro, this.bayushiAramoro],
                    defenders: [this.youngHarrier]
                });
                expect(this.youngHarrier.getMilitarySkill()).toBe(1);
                expect(this.youngHarrier.getPoliticalSkill()).toBe(1);
                expect(this.youngHarrier.isDishonored).toBe(false);
                this.player2.clickCard(this.youngHarrier);
                expect(this.youngHarrier.isDishonored).toBe(true);
                expect(this.youngHarrier.getMilitarySkill()).toBe(1);
                expect(this.youngHarrier.getPoliticalSkill()).toBe(1);
            });

            it('should stop honor status modifying both skills', function() {
                this.initiateConflict({
                    attackers: [this.bayushiYojiro, this.bayushiAramoro],
                    defenders: [this.youngHarrier]
                });
                expect(this.youngHarrier.getMilitarySkill()).toBe(1);
                expect(this.youngHarrier.getPoliticalSkill()).toBe(1);
                expect(this.youngHarrier.isHonored).toBe(false);
                this.player2.clickCard(this.wayOfTheCrane);
                this.player2.clickCard(this.youngHarrier);
                expect(this.youngHarrier.isHonored).toBe(true);
                expect(this.youngHarrier.getMilitarySkill()).toBe(1);
                expect(this.youngHarrier.getPoliticalSkill()).toBe(1);
            });

            it('should stop dishonor status modifying both skills', function() {
                this.initiateConflict({
                    attackers: [this.bayushiYojiro, this.bayushiAramoro],
                    defenders: [this.youngHarrier]
                });
                expect(this.youngHarrier.getMilitarySkill()).toBe(1);
                expect(this.youngHarrier.getPoliticalSkill()).toBe(1);
                expect(this.youngHarrier.isHonored).toBe(false);
                this.player2.clickCard(this.wayOfTheCrane);
                this.player2.clickCard(this.youngHarrier);
                expect(this.youngHarrier.isHonored).toBe(true);
                expect(this.youngHarrier.getMilitarySkill()).toBe(1);
                expect(this.youngHarrier.getPoliticalSkill()).toBe(1);
                expect(this.youngHarrier.getMilitaryModifiers().some(modifier =>
                    modifier.name === 'Honored Token (Bayushi Yojiro)' &&
                    modifier.amount === 0
                )).toBe(true);
                expect(this.youngHarrier.getPoliticalModifiers().some(modifier =>
                    modifier.name === 'Honored Token (Bayushi Yojiro)' &&
                    modifier.amount === 0
                )).toBe(true);
            });

            it('should stop honor status adding honor on leaving play', function() {
                this.initiateConflict({
                    attackers: [this.bayushiYojiro, this.bayushiAramoro],
                    defenders: [this.youngHarrier]
                });
                this.player2.clickCard(this.wayOfTheCrane);
                this.player2.clickCard(this.youngHarrier);
                expect(this.youngHarrier.isHonored).toBe(true);
                let honor = this.player2.player.honor;
                this.player1.clickCard(this.bayushiAramoro);
                this.player1.clickCard(this.youngHarrier);
                expect(this.youngHarrier.location).toBe('conflict discard pile');
                expect(this.player2.player.honor).toBe(honor);
            });

            it('should stop dishonor status losing honor on leaving play', function() {
                this.initiateConflict({
                    attackers: [this.bayushiYojiro, this.bayushiAramoro],
                    defenders: [this.youngHarrier]
                });
                this.player2.clickCard(this.youngHarrier);
                expect(this.youngHarrier.isDishonored).toBe(true);
                let honor = this.player2.player.honor;
                this.player1.clickCard(this.bayushiAramoro);
                this.player1.clickCard(this.youngHarrier);
                expect(this.youngHarrier.location).toBe('conflict discard pile');
                expect(this.player2.player.honor).toBe(honor);
            });
        });
    });
});
