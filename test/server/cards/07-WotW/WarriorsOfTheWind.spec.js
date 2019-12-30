describe('Warriors of the Wind', function() {
    integration(function() {
        describe('Warriors of the Wind\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['border-rider', 'miya-mystic', 'battle-maiden-recruit', 'wandering-ronin'],
                        hand: ['warriors-of-the-wind']
                    },
                    player2: {
                        inPlay: ['matsu-mitsuko']
                    }
                });

                this.borderRider = this.player1.findCardByName('border-rider');
                this.miyaMystic = this.player1.findCardByName('miya-mystic');
                this.battleMaidenRecruit = this.player1.findCardByName('battle-maiden-recruit');
                this.wanderingRonin = this.player1.findCardByName('wandering-ronin');
                this.warriorsOfTheWind = this.player1.findCardByName('warriors-of-the-wind');

                this.matsuMitsuko = this.player2.findCardByName('matsu-mitsuko');
            });

            it('should trigger even if you have no participating cavalry characters', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.miyaMystic],
                    defenders: [this.matsuMitsuko]
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.warriorsOfTheWind);
                expect(this.player1).toHavePrompt('Warriors of the Wind');
            });

            it('should send all participating cavalry characters you control home', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.borderRider, this.miyaMystic, this.battleMaidenRecruit],
                    defenders: [this.matsuMitsuko]
                });
                this.player2.pass();
                this.player1.clickCard(this.warriorsOfTheWind);
                expect(this.borderRider.isParticipating()).toBe(false);
                expect(this.miyaMystic.isParticipating()).toBe(true);
                expect(this.battleMaidenRecruit.isParticipating()).toBe(false);
                expect(this.wanderingRonin.isParticipating()).toBe(false);
                expect(this.matsuMitsuko.isParticipating()).toBe(true);
                expect(this.getChatLogs(1)).toContain('player1 plays Warriors of the Wind to send Border Rider and Battle Maiden Recruit home');
            });

            it('should allow you to choose multiple cavalry characters to send to the conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.borderRider, this.miyaMystic, this.battleMaidenRecruit],
                    defenders: [this.matsuMitsuko]
                });
                this.player2.pass();
                this.player1.clickCard(this.warriorsOfTheWind);
                expect(this.player1).toHavePrompt('Choose characters');
                expect(this.player1).toBeAbleToSelect(this.borderRider);
                expect(this.player1).not.toBeAbleToSelect(this.miyaMystic);
                expect(this.player1).toBeAbleToSelect(this.battleMaidenRecruit);
                expect(this.player1).not.toBeAbleToSelect(this.wanderingRonin);
                expect(this.player1).not.toBeAbleToSelect(this.matsuMitsuko);
                this.player1.clickCard(this.borderRider);
                expect(this.player1).toHavePrompt('Choose characters');
                this.player1.clickCard(this.battleMaidenRecruit);
                expect(this.player1).toHavePrompt('Choose characters');
                expect(this.player1).toHavePromptButton('Done');
            });

            it('should allow you to choose zero characters to send to the conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.borderRider, this.miyaMystic, this.battleMaidenRecruit],
                    defenders: [this.matsuMitsuko]
                });
                this.player2.pass();
                this.player1.clickCard(this.warriorsOfTheWind);
                expect(this.player1).toHavePrompt('Choose characters');
                expect(this.player1).toHavePromptButton('Done');
                this.player1.clickPrompt('Done');
                expect(this.borderRider.isParticipating()).toBe(false);
                expect(this.miyaMystic.isParticipating()).toBe(true);
                expect(this.battleMaidenRecruit.isParticipating()).toBe(false);
                expect(this.wanderingRonin.isParticipating()).toBe(false);
                expect(this.matsuMitsuko.isParticipating()).toBe(true);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should send all chosen characters to the conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.borderRider, this.miyaMystic, this.battleMaidenRecruit],
                    defenders: [this.matsuMitsuko]
                });
                this.player2.pass();
                this.player1.clickCard(this.warriorsOfTheWind);
                expect(this.player1).toHavePrompt('Choose characters');
                this.player1.clickCard(this.borderRider);
                this.player1.clickCard(this.battleMaidenRecruit);
                this.player1.clickPrompt('Done');
                expect(this.borderRider.isParticipating()).toBe(true);
                expect(this.miyaMystic.isParticipating()).toBe(true);
                expect(this.battleMaidenRecruit.isParticipating()).toBe(true);
                expect(this.wanderingRonin.isParticipating()).toBe(false);
                expect(this.matsuMitsuko.isParticipating()).toBe(true);
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.getChatLogs(3)).toContain('player1 chooses to move Border Rider and Battle Maiden Recruit to the conflict');
            });
        });
    });
});

