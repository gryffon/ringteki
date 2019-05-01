describe('Bayushi Dairu', function() {
    integration(function() {
        describe('Bayushi Dairu\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['bayushi-dairu', 'young-rumormonger', 'soshi-illusionist']
                    },
                    player2: {
                        inPlay: ['kakita-yoshi'],
                        hand: ['steward-of-law']
                    }
                });
                this.bayushiDairu = this.player1.findCardByName('bayushi-dairu');
                this.youngRumormonger = this.player1.findCardByName('young-rumormonger');
                this.youngRumormonger.dishonor();

                this.kakitaYoshi = this.player2.findCardByName('kakita-yoshi');
                this.kakitaYoshi.honor();
            });

            it('should not work outside of a conflict', function() {
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.bayushiDairu);
                expect(this.player1).toHavePrompt('Action Window');
            });

            describe('during a conflict', function() {
                beforeEach(function() {
                    this.noMoreActions();
                    this.initiateConflict({
                        type: 'political',
                        attackers: [this.bayushiDairu],
                        defenders: [this.kakitaYoshi]
                    });
                });

                it('should allow moving a dishonor token', function() {
                    let token = this.youngRumormonger.personalHonor;
                    expect(this.youngRumormonger.isDishonored).toBe(true);
                    expect(this.bayushiDairu.isDishonored).toBe(false);
                    this.player2.pass();
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                    this.player1.clickCard(this.bayushiDairu);
                    expect(this.player1).toHavePrompt('Bayushi Dairu');
                    expect(this.player1).toBeAbleToSelect(this.kakitaYoshi);
                    expect(this.player1).toBeAbleToSelect(this.youngRumormonger);
                    expect(this.player1).not.toBeAbleToSelect('soshi-illusionist');
                    this.player1.clickCard(this.youngRumormonger);
                    expect(this.player2).toHavePrompt('Conflict Action Window');
                    expect(this.youngRumormonger.isDishonored).toBe(false);
                    expect(this.bayushiDairu.isDishonored).toBe(true);
                    expect(this.bayushiDairu.personalHonor).toBe(token);
                });

                it('should cancel out tokens if both are on Dairu', function() {
                    this.bayushiDairu.honor();
                    this.player2.pass();
                    this.player1.clickCard(this.bayushiDairu);
                    expect(this.player1).toHavePrompt('Bayushi Dairu');
                    this.player1.clickCard(this.youngRumormonger);
                    expect(this.player2).toHavePrompt('Conflict Action Window');
                    expect(this.youngRumormonger.isDishonored).toBe(false);
                    expect(this.bayushiDairu.isDishonored).toBe(false);
                    expect(this.bayushiDairu.isHonored).toBe(false);
                });

                it('should allow moving an honor token', function() {
                    let token = this.kakitaYoshi.personalHonor;
                    expect(this.kakitaYoshi.isHonored).toBe(true);
                    expect(this.bayushiDairu.isHonored).toBe(false);
                    this.player2.pass();
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                    this.player1.clickCard(this.bayushiDairu);
                    expect(this.player1).toHavePrompt('Bayushi Dairu');
                    this.player1.clickCard(this.kakitaYoshi);
                    expect(this.kakitaYoshi.isHonored).toBe(false);
                    expect(this.bayushiDairu.isHonored).toBe(true);
                    expect(this.bayushiDairu.personalHonor).toBe(token);
                });

                it('should not allow taking a dishonor token if Steward is in play when ordinary', function() {
                    this.stewardOfLaw = this.player2.playCharacterFromHand('steward-of-law');
                    this.player2.clickPrompt('Conflict');
                    expect(this.stewardOfLaw.inConflict).toBe(true);
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                    this.player1.clickCard(this.bayushiDairu);
                    expect(this.player1).toHavePrompt('Bayushi Dairu');
                    expect(this.player1).toBeAbleToSelect(this.kakitaYoshi);
                    expect(this.player1).not.toBeAbleToSelect(this.youngRumormonger);
                    expect(this.player1).not.toBeAbleToSelect('soshi-illusionist');
                    expect(this.player1).not.toBeAbleToSelect(this.stewardOfLaw);
                });

                it('should not allow taking a dishonor token if Steward is in play when honored', function() {
                    this.bayushiDairu.honor();
                    this.stewardOfLaw = this.player2.playCharacterFromHand('steward-of-law');
                    this.player2.clickPrompt('Conflict');
                    expect(this.stewardOfLaw.inConflict).toBe(true);
                    expect(this.bayushiDairu.isHonored).toBe(true);
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                    this.player1.clickCard(this.bayushiDairu);
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                });
            });
        });
    });
});
