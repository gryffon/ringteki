describe('Strategic Weakpoint', function() {
    integration(function() {
        describe('Strategic Weakpoint\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['kitsuki-yuikimi', 'kitsuki-investigator', 'doomed-shugenja', 'shiba-yojimbo'],
                        hand: ['finger-of-jade', 'reprieve', 'pathfinder-s-blade', 'favored-mount']
                    },
                    player2: {
                        dynastyDeck: ['strategic-weakpoint']
                    }
                });
                this.strategicWeakpoint = this.player2.placeCardInProvince('strategic-weakpoint', 'province 1');
                this.shamefulDisplay = this.player2.findCardByName('shameful-display', 'province 1');

                this.yuikimi = this.player1.findCardByName('kitsuki-yuikimi');
                this.investigator = this.player1.findCardByName('kitsuki-investigator');
                this.shug = this.player1.findCardByName('doomed-shugenja');
                this.yojimbo = this.player1.findCardByName('shiba-yojimbo');
                this.foj = this.player1.findCardByName('finger-of-jade');
                this.reprieve = this.player1.findCardByName('reprieve');
                this.pfb = this.player1.findCardByName('pathfinder-s-blade');
                this.favoredMount = this.player1.findCardByName('favored-mount');

                this.player1.playAttachment(this.favoredMount, this.investigator);

                this.game.rings.air.fate = 1;
                this.noMoreActions();
            });

            describe('base case', function() {
                beforeEach(function() {
                    this.initiateConflict({
                        province: this.shamefulDisplay,
                        ring: 'fire',
                        attackers: [this.yuikimi, this.investigator],
                        defenders: []
                    });
                });

                it('should trigger when province is broken', function() {
                    this.player2.pass();
                    this.player1.pass();
                    expect(this.player2).toHavePrompt('Triggered Abilities');
                    expect(this.player2).toBeAbleToSelect(this.strategicWeakpoint);
                });

                it('should not trigger if province is not broken', function() {
                    this.yuikimi.bowed = true;
                    this.player2.pass();
                    this.player1.pass();
                    expect(this.player1).toHavePrompt('Fire Ring');
                    expect(this.player2).not.toHavePrompt('Triggered Abilities');
                    expect(this.player2).not.toBeAbleToSelect(this.strategicWeakpoint);
                });

                it('should let opponent choose a participating character to discard', function() {
                    this.player2.pass();
                    this.player1.pass();
                    this.player2.clickCard(this.strategicWeakpoint);
                    expect(this.player1).toBeAbleToSelect(this.yuikimi);
                    expect(this.player1).toBeAbleToSelect(this.investigator);
                    expect(this.player1).not.toBeAbleToSelect(this.shug);
                    expect(this.player1).not.toBeAbleToSelect(this.yojimbo);
                });

                it('should discard the chosen character', function() {
                    this.player2.pass();
                    this.player1.pass();
                    this.player2.clickCard(this.strategicWeakpoint);
                    expect(this.player1).toBeAbleToSelect(this.investigator);
                    this.player1.clickCard(this.investigator);
                    expect(this.investigator.location).toBe('dynasty discard pile');
                });

                it('should not trigger when province is broken if it is facedown', function() {
                    this.strategicWeakpoint.facedown = true;
                    this.player2.pass();
                    this.player1.pass();
                    expect(this.player2).not.toBeAbleToSelect(this.strategicWeakpoint);
                });
            });

            describe('yuikimi tests', function() {
                beforeEach(function() {
                    this.initiateConflict({
                        province: this.shamefulDisplay,
                        ring: 'air',
                        attackers: [this.yuikimi]
                    });
                });

                it('should not trigger when province is broken if there is no valid targets', function() {
                    this.player1.clickCard(this.yuikimi);
                    this.player2.clickPrompt('Done');
                    this.player2.pass();
                    this.player1.pass();
                    expect(this.player2).not.toBeAbleToSelect(this.strategicWeakpoint);
                });

                it('should not let you select yuikimi when province is broken', function() {
                    this.player1.clickCard(this.yuikimi);
                    this.player2.clickPrompt('Done');
                    this.player2.pass();
                    this.player1.clickCard(this.favoredMount);
                    this.player2.pass();
                    this.player1.pass();
                    expect(this.player2).toBeAbleToSelect(this.strategicWeakpoint);
                    this.player2.clickCard(this.strategicWeakpoint);
                    expect(this.player1).not.toBeAbleToSelect(this.yuikimi);
                    expect(this.player1).toBeAbleToSelect(this.investigator);
                });
            });

            describe('armor tests', function() {
                beforeEach(function() {
                    this.initiateConflict({
                        province: this.shamefulDisplay,
                        ring: 'fire',
                        attackers: [this.yuikimi, this.investigator, this.shug],
                        defenders: []
                    });
                });

                it('finger of jade should prevent discard', function() {
                    this.player2.pass();
                    this.player1.clickCard(this.foj);
                    this.player1.clickCard(this.yuikimi);
                    this.player2.pass();
                    this.player1.pass();
                    expect(this.player2).toBeAbleToSelect(this.strategicWeakpoint);
                    this.player2.clickCard(this.strategicWeakpoint);
                    expect(this.player1).toBeAbleToSelect(this.yuikimi);
                    expect(this.player1).toBeAbleToSelect(this.investigator);
                    expect(this.player1).toBeAbleToSelect(this.shug);
                    expect(this.player1).not.toBeAbleToSelect(this.yojimbo);
                    this.player1.clickCard(this.yuikimi);
                    expect(this.player1).toBeAbleToSelect(this.foj);
                    this.player1.clickCard(this.foj);
                    expect(this.yuikimi.location).not.toBe('dynasty discard pile');
                });

                it('reprieve should prevent discard', function() {
                    this.player2.pass();
                    this.player1.clickCard(this.reprieve);
                    this.player1.clickCard(this.yuikimi);
                    this.player2.pass();
                    this.player1.pass();
                    expect(this.player2).toBeAbleToSelect(this.strategicWeakpoint);
                    this.player2.clickCard(this.strategicWeakpoint);
                    expect(this.player1).toBeAbleToSelect(this.yuikimi);
                    expect(this.player1).toBeAbleToSelect(this.investigator);
                    expect(this.player1).toBeAbleToSelect(this.shug);
                    expect(this.player1).not.toBeAbleToSelect(this.yojimbo);
                    this.player1.clickCard(this.yuikimi);
                    expect(this.player1).toBeAbleToSelect(this.reprieve);
                    this.player1.clickCard(this.reprieve);
                    expect(this.yuikimi.location).not.toBe('dynasty discard pile');
                });

                it('shiba yojimbo should prevent discard', function() {
                    this.player2.pass();
                    this.player1.pass();
                    expect(this.player2).toBeAbleToSelect(this.strategicWeakpoint);
                    this.player2.clickCard(this.strategicWeakpoint);
                    expect(this.player1).toBeAbleToSelect(this.yuikimi);
                    expect(this.player1).toBeAbleToSelect(this.investigator);
                    expect(this.player1).toBeAbleToSelect(this.shug);
                    expect(this.player1).not.toBeAbleToSelect(this.yojimbo);
                    this.player1.clickCard(this.shug);
                    expect(this.player1).toBeAbleToSelect(this.yojimbo);
                    this.player1.clickCard(this.yojimbo);
                    expect(this.shug.location).not.toBe('dynasty discard pile');
                });

                it('pathfinders blade should do nothing', function() {
                    this.player2.pass();
                    this.player1.clickCard(this.pfb);
                    this.player1.clickCard(this.yuikimi);
                    this.player2.pass();
                    this.player1.pass();
                    expect(this.player2).toBeAbleToSelect(this.strategicWeakpoint);
                    this.player2.clickCard(this.strategicWeakpoint);
                    expect(this.player1).toBeAbleToSelect(this.yuikimi);
                    expect(this.player1).toBeAbleToSelect(this.investigator);
                    this.player1.clickCard(this.yuikimi);
                    expect(this.player1).not.toBeAbleToSelect(this.pfb);
                    expect(this.yuikimi.location).toBe('dynasty discard pile');
                });
            });
        });
    });
});
