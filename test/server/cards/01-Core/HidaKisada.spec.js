describe('Hida Kisada', function() {
    integration(function() {
        describe('Hida Kisada\'s constant effect', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['hida-kisada'],
                        conflictDiscard: ['defend-your-honor']
                    },
                    player2: {
                        inPlay: ['akodo-toturi'],
                        hand: ['banzai', 'iuchi-wayfinder']
                    }
                });
                this.hidaKisada = this.player1.findCardByName('hida-kisada');
                this.defendYourHonor = this.player1.findCardByName('defend-your-honor');

                this.akodoToturi = this.player2.findCardByName('akodo-toturi');
                this.banzai = this.player2.findCardByName('banzai');
                this.iuchiWayfinder = this.player2.findCardByName('iuchi-wayfinder');
                this.shamefulDisplay = this.player2.findCardByName('shameful-display', 'province 1');
            });

            it('should cancel the first action ability triggered by your opponent', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.hidaKisada],
                    defenders: [this.akodoToturi]
                });
                this.player2.clickCard(this.banzai);
                this.player2.clickCard(this.akodoToturi);
                expect(this.getChatLogs(3)).toContain('player2 attempts to initiate Banzai!, but Hida Kisada cancels it');
                expect(this.akodoToturi.getMilitarySkill()).toBe(6);
            });

            it('should not cancel the second action ability triggered by your opponent', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.hidaKisada],
                    defenders: [this.akodoToturi]
                });
                this.player2.clickCard(this.shamefulDisplay);
                this.player2.clickCard(this.akodoToturi);
                this.player2.clickCard(this.hidaKisada);
                this.player2.clickPrompt('Done');
                expect(this.getChatLogs(3)).toContain('player2 attempts to initiate Shameful Display\'s ability, but Hida Kisada cancels it');
                this.player1.pass();
                this.player2.clickCard(this.banzai);
                this.player2.clickCard(this.akodoToturi);
                this.player2.clickPrompt('Done');
                expect(this.akodoToturi.getMilitarySkill()).toBe(8);
            });

            it('should not cancel reactions triggered by your opponent', function() {
                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.akodoToturi],
                    defenders: []
                });
                this.noMoreActions();
                this.player2.clickPrompt('No');
                this.player2.clickPrompt('Don\'t Resolve');
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.akodoToturi);
                this.player2.clickCard(this.akodoToturi);
                expect(this.player2).toHavePrompt('Air Ring');
            });

            it('should not cancel actions once you have lost a conflict', function() {
                this.noMoreActions();
                this.player1.passConflict();
                this.player1.pass();
                this.player2.clickCard(this.iuchiWayfinder);
                this.player2.clickPrompt('0');
                this.player2.clickPrompt('Pass');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.iuchiWayfinder],
                    defenders: []
                });
                this.noMoreActions();
                this.player2.clickPrompt('Don\'t Resolve');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.hidaKisada],
                    defenders: [this.akodoToturi],
                    ring: 'fire'
                });
                this.player2.clickCard(this.banzai);
                this.player2.clickCard(this.akodoToturi);
                this.player2.clickPrompt('Done');
                expect(this.akodoToturi.getMilitarySkill()).toBe(8);
            });

            it('should not cancel the second action if the first is cancelled', function() {
                this.player1.moveCard(this.defendYourHonor, 'hand');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.hidaKisada],
                    defenders: [this.akodoToturi]
                });
                this.player2.clickCard(this.banzai);
                this.player2.clickCard(this.akodoToturi);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.defendYourHonor);
                this.player1.clickCard(this.defendYourHonor);
                this.player1.clickCard(this.hidaKisada);
                this.player2.clickCard(this.akodoToturi);
                this.player1.clickPrompt('5');
                this.player2.clickPrompt('1');
                expect(this.getChatLogs(3)).toContain('Duel Effect: cancel the effects of Banzai!');
                expect(this.akodoToturi.getMilitarySkill()).toBe(6);
                this.player1.pass();
                this.player2.clickCard(this.shamefulDisplay);
                this.player2.clickCard(this.akodoToturi);
                this.player2.clickCard(this.hidaKisada);
                this.player2.clickPrompt('Done');
                expect(this.player2).toHavePrompt('Shameful Display');
            });
        });
    });
});
