describe('Effective Deception', function() {
    integration(function() {
        describe('Effective Deception\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['brash-samurai'],
                        hand: ['a-perfect-cut']
                    },
                    player2: {
                        inPlay: ['tattooed-wanderer'],
                        hand: ['banzai'],
                        provinces: ['effective-deception']
                    }
                });

                this.player2.player.optionSettings.cancelOwnAbilities = true;

                this.brashSamurai = this.player1.findCardByName('brash-samurai');
                this.aPerfectCut = this.player1.findCardByName('a-perfect-cut');

                this.tattooedWanderer = this.player2.findCardByName('tattooed-wanderer');
                this.banzai = this.player2.findCardByName('banzai');
                this.effectiveDeception = this.player2.findCardByName('effective-deception');
                this.shamefulDisplay = this.player2.findCardByName('shameful-display', 'province 2');
            });

            it('should not trigger when it is not the conflict province', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.brashSamurai],
                    defenders: [this.tattooedWanderer],
                    province: this.shamefulDisplay
                });
                this.player2.pass();
                this.player1.clickCard(this.brashSamurai);
                expect(this.brashSamurai.isHonored).toBe(true);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should trigger when your opponent triggers an ability during a conflict at this province', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.brashSamurai],
                    defenders: [this.tattooedWanderer],
                    province: this.effectiveDeception
                });
                this.player2.pass();
                this.player1.clickCard(this.brashSamurai);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.effectiveDeception);
            });

            it('should trigger when you trigger an ability during a conflict at this province', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.brashSamurai],
                    defenders: [this.tattooedWanderer],
                    province: this.effectiveDeception
                });
                this.player2.clickCard(this.banzai);
                this.player2.clickCard(this.tattooedWanderer);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.effectiveDeception);
                this.player2.clickPrompt('Pass');
                this.player2.clickPrompt('Lose 1 honor to resolve this ability again');
                this.player2.clickCard(this.tattooedWanderer);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.effectiveDeception);
            });

            it('should cancel the effects of the ability', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.brashSamurai],
                    defenders: [this.tattooedWanderer],
                    province: this.effectiveDeception
                });
                this.player2.pass();
                this.player1.clickCard(this.brashSamurai);
                this.player2.clickCard(this.effectiveDeception);
                expect(this.brashSamurai.isHonored).toBe(false);
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.getChatLogs(3)).toContain('player2 uses Effective Deception to cancel the effects of Brash Samurai\'s ability');
            });
        });
    });
});
