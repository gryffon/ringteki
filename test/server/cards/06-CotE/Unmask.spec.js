describe('Unmask', function() {
    integration(function() {
        describe('Unmask\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['yoritomo', 'kitsu-spiritcaller'],
                        fate: 2,
                        honor: 10
                    },
                    player2: {
                        inPlay: ['matsu-berserker'],
                        hand: ['unmask'],
                        fate: 1,
                        honor: 10
                    }
                });
                this.matsuBerserker = this.player2.findCardByName('matsu-berserker');
                this.yoritomo = this.player1.findCardByName('yoritomo');
                this.player1.player.showBid = 4;
                this.player2.player.showBid = 5;
            });

            it('should not be playable outside of a conflict', function() {
                this.player1.pass();
                this.player2.clickCard('unmask');
                expect(this.player2).toHavePrompt('Action Window');
            });

            it('should not be playable if the controller bid less on his dial', function() {
                this.player1.player.showBid = 5;
                this.player2.player.showBid = 4;
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.yoritomo],
                    defenders: [this.matsuBerserker]
                });
                this.player2.clickCard('unmask');
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            describe('during a conflict', function() {
                beforeEach(function() {
                    this.yoritomo.honor();
                    this.noMoreActions();
                    this.initiateConflict({
                        attackers: [this.yoritomo],
                        defenders: [this.matsuBerserker]
                    });
                    this.yoritomo.honor();
                    this.player2.clickCard('unmask');
                });

                it('should not allow targeting characters not participating', function() {
                    this.kitsuSpiritcaller = this.player1.findCardByName('kitsu-spiritcaller');
                    expect(this.player2).toHavePrompt('Unmask');
                    expect(this.player2).toBeAbleToSelect(this.yoritomo);
                    expect(this.player2).not.toBeAbleToSelect(this.kitsuSpiritcaller);
                });

                it('should remove any status token on the target', function() {
                    expect(this.yoritomo.isHonored).toBe(true);
                    this.player2.clickCard(this.yoritomo);
                    expect(this.yoritomo.isHonored).toBe(false);
                });

                it('should set the target\'s skill to match it\'s base skill for the duration of the conflict', function() {
                    // Honored so that defender wins and ring is not chosen.
                    this.matsuBerserker.honor();
                    expect(this.yoritomo.getMilitarySkill()).toBe(this.yoritomo.getBaseMilitarySkill() + this.yoritomo.glory + this.player1.fate);
                    expect(this.yoritomo.getPoliticalSkill()).toBe(this.yoritomo.getBasePoliticalSkill() + this.yoritomo.glory + this.player1.fate);
                    this.player2.clickCard(this.yoritomo);
                    expect(this.yoritomo.getMilitarySkill()).toBe(this.yoritomo.getBaseMilitarySkill());
                    expect(this.yoritomo.getPoliticalSkill()).toBe(this.yoritomo.getBasePoliticalSkill());
                    this.noMoreActions();
                    expect(this.yoritomo.getMilitarySkill()).toBe(this.yoritomo.getBaseMilitarySkill() + this.player1.fate);
                    expect(this.yoritomo.getPoliticalSkill()).toBe(this.yoritomo.getBasePoliticalSkill() + this.player1.fate);
                });

                it('should give the target\'s controller 2 honor', function() {
                    this.player1Honor = this.player1.honor;
                    this.player2.clickCard(this.yoritomo);
                    expect(this.player1.honor).toBe(this.player1Honor + 2);
                });
            });
        });
    });
});
