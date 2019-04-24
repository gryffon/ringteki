describe('Visiting Advisor', function() {
    integration(function() {
        describe('Visiting Advisor\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['visiting-advisor', 'battle-maiden-recruit', 'border-rider']
                    },
                    player2: {
                        inPlay: ['wandering-ronin']
                    }
                });

                this.visitingAdvisor = this.player1.findCardByName('visiting-advisor');
                this.battleMaidenRecruit = this.player1.findCardByName('battle-maiden-recruit');
                this.borderRider = this.player1.findCardByName('border-rider');

                this.wanderingRonin = this.player2.findCardByName('wandering-ronin');
            });

            it('should not trigger outside of a conflict', function() {
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.visitingAdvisor);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should not trigger in a conflict if Visiting Advisor is not participating', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.battleMaidenRecruit],
                    defenders: [this.wanderingRonin]
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.visitingAdvisor);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should trigger during a conflict where Visiting Advisor is participating', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.visitingAdvisor, this.battleMaidenRecruit, this.borderRider],
                    defenders: [this.wanderingRonin]
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.visitingAdvisor);
                expect(this.player1).toHavePrompt('Visiting Advisor');
            });

            it('should allow you to choose 0 characters', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.visitingAdvisor, this.battleMaidenRecruit, this.borderRider],
                    defenders: [this.wanderingRonin]
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.visitingAdvisor);
                expect(this.player1).toHavePromptButton('Done');
            });

            it('should allow you to choose up to 1 other character you control', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.visitingAdvisor, this.battleMaidenRecruit, this.borderRider],
                    defenders: [this.wanderingRonin]
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.visitingAdvisor);
                expect(this.player1).toHavePrompt('Choose a character');
                expect(this.player1).not.toBeAbleToSelect(this.visitingAdvisor);
                expect(this.player1).toBeAbleToSelect(this.battleMaidenRecruit);
                expect(this.player1).toBeAbleToSelect(this.borderRider);
                expect(this.player1).not.toBeAbleToSelect(this.wanderingRonin);
            });

            it('should send Visiting Advisor home if 0 characters chosen', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.visitingAdvisor, this.battleMaidenRecruit, this.borderRider],
                    defenders: [this.wanderingRonin]
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.visitingAdvisor);
                this.player1.clickPrompt('Done');
                expect(this.visitingAdvisor.isParticipating()).toBe(false);
                expect(this.battleMaidenRecruit.isParticipating()).toBe(true);
                expect(this.borderRider.isParticipating()).toBe(true);
                expect(this.getChatLogs(3)).toContain('player1 uses Visiting Advisor to send Visiting Advisor home');
            });

            it('should send both Visiting Advisor and the chosen character home if 1 character is chosen', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.visitingAdvisor, this.battleMaidenRecruit, this.borderRider],
                    defenders: [this.wanderingRonin]
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.visitingAdvisor);
                this.player1.clickCard(this.borderRider);
                expect(this.visitingAdvisor.isParticipating()).toBe(false);
                expect(this.battleMaidenRecruit.isParticipating()).toBe(true);
                expect(this.borderRider.isParticipating()).toBe(false);
                expect(this.getChatLogs(3)).toContain('player1 uses Visiting Advisor to send Border Rider and Visiting Advisor home');
            });

            it('should work if Visiting Advisor is your only participating character', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.visitingAdvisor],
                    defenders: [this.wanderingRonin]
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.visitingAdvisor);
                this.player1.clickPrompt('Done');
                expect(this.visitingAdvisor.isParticipating()).toBe(false);
                expect(this.getChatLogs(3)).toContain('player1 uses Visiting Advisor to send Visiting Advisor home');
            });
        });
    });
});

