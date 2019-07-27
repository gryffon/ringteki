describe('Niten Pupil', function() {
    integration(function() {
        describe('Niten Pupil\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        inPlay: ['niten-pupil', 'kitsuki-investigator'],
                        conflictDiscard: ['defend-your-honor']
                    },
                    player2: {
                        inPlay: ['mirumoto-raitsugu'],
                        conflictDiscard: ['contingency-plan']
                    }
                });

                this.nitenPupil = this.player1.findCardByName('niten-pupil');
                this.kitsukiInvestigator = this.player1.findCardByName('kitsuki-investigator');
                this.defendYourHonor = this.player1.findCardByName('defend-your-honor');

                this.mirumotoRaitsugu = this.player2.findCardByName('mirumoto-raitsugu');
                this.contingencyPlan = this.player2.findCardByName('contingency-plan');
            });

            it('should trigger when dials are revealed for a duel Niten Pupil is participating in', function() {
                this.advancePhases('conflict');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.nitenPupil],
                    defenders: [this.mirumotoRaitsugu]
                });
                this.player2.clickCard(this.mirumotoRaitsugu);
                this.player2.clickCard(this.nitenPupil);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.nitenPupil);
            });

            it('should not trigger when dials are revealed for not a duel', function() {
                this.noMoreActions();
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should not trigger when dials are revealed for a duel Niten Pupil is not participating in', function() {
                this.advancePhases('conflict');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.nitenPupil],
                    defenders: [this.mirumotoRaitsugu]
                });
                this.player2.clickCard(this.mirumotoRaitsugu);
                this.player2.clickCard(this.nitenPupil);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.nitenPupil);
            });

            it('should not trigger when dials are revealed for a nested duel Niten Pupil is not participating in', function() {
                this.advancePhases('conflict');
                this.player1.moveCard(this.defendYourHonor, 'hand');
                this.player2.moveCard(this.contingencyPlan, 'hand');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.nitenPupil, this.kitsukiInvestigator],
                    defenders: [this.mirumotoRaitsugu]
                });
                this.player2.clickCard(this.mirumotoRaitsugu);
                this.player2.clickCard(this.nitenPupil);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                this.player1.clickPrompt('Pass');
                this.player2.clickCard(this.contingencyPlan);
                this.player1.clickCard(this.defendYourHonor);
                this.player1.clickCard(this.kitsukiInvestigator);
                this.player2.clickCard(this.mirumotoRaitsugu);
                this.player1.clickPrompt('2');
                this.player2.clickPrompt('2');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player2).toHavePrompt('Contingency Plan');
            });

            it('should double both base skills until the end of the phase', function() {
                this.advancePhases('conflict');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.nitenPupil],
                    defenders: [this.mirumotoRaitsugu]
                });
                this.player2.clickCard(this.mirumotoRaitsugu);
                this.player2.clickCard(this.nitenPupil);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                this.player1.clickCard(this.nitenPupil);
                expect(this.nitenPupil.getBaseMilitarySkill()).toBe(4);
                expect(this.nitenPupil.getBasePoliticalSkill()).toBe(4);
                expect(this.getChatLogs(5)).toContain('player1 uses Niten Pupil to double Niten Pupil\'s base military and political skills');
                this.noMoreActions();
                this.player1.clickPrompt('No');
                this.player1.clickPrompt('Don\'t Resolve');
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.nitenPupil.getBaseMilitarySkill()).toBe(4);
                expect(this.nitenPupil.getBasePoliticalSkill()).toBe(4);
                this.advancePhases('fate');
                expect(this.nitenPupil.getBaseMilitarySkill()).toBe(2);
                expect(this.nitenPupil.getBasePoliticalSkill()).toBe(2);
            });
        });
    });
});

