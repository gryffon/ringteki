describe('Alluring Patron', function() {
    integration(function() {
        describe('Alluring Patron\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['alluring-patron', 'adept-of-shadows']
                    },
                    player2: {
                        inPlay: ['mirumoto-raitsugu', 'kitsuki-investigator', 'otomo-courtier']
                    }
                });
                this.alluringPatron = this.player1.findCardByName('alluring-patron');
                this.adeptOfShadows = this.player1.findCardByName('adept-of-shadows');
                this.mirumotoRaitsugu = this.player2.findCardByName('mirumoto-raitsugu');
                this.kitsukiInvestigator = this.player2.findCardByName('kitsuki-investigator');
                this.otomoCourtier = this.player2.findCardByName('otomo-courtier');
            });

            it('should not be able to be triggered outside of a conflict', function() {
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.alluringPatron);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should not be able to be triggered in a conflict if Alluring Patron is not participating', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.adeptOfShadows],
                    defenders: []
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.alluringPatron);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should prompt to choose a character your opponent controls at home', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.alluringPatron],
                    defenders: [this.mirumotoRaitsugu]
                });
                this.player2.pass();
                this.player1.clickCard(this.alluringPatron);
                expect(this.player1).toHavePrompt('Choose a character');
                expect(this.player1).not.toBeAbleToSelect(this.mirumotoRaitsugu);
                expect(this.player1).toBeAbleToSelect(this.kitsukiInvestigator);
                expect(this.player1).toBeAbleToSelect(this.otomoCourtier);
            });

            it('should prompt your opponent to choose to move to the conflict or dishonor', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.alluringPatron],
                    defenders: [this.mirumotoRaitsugu]
                });
                this.player2.pass();
                this.player1.clickCard(this.alluringPatron);
                this.player1.clickCard(this.kitsukiInvestigator);
                expect(this.player2).toHavePrompt('Select one');
                expect(this.player2).toHavePromptButton('Move this character to the conflict');
                expect(this.player2).toHavePromptButton('Dishonor this character');
            });

            it('should move the character to the conflict if chosen', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.alluringPatron],
                    defenders: [this.mirumotoRaitsugu]
                });
                this.player2.pass();
                this.player1.clickCard(this.alluringPatron);
                this.player1.clickCard(this.kitsukiInvestigator);
                this.player2.clickPrompt('Move this character to the conflict');
                expect(this.kitsukiInvestigator.isParticipating()).toBe(true);
                expect(this.getChatLogs(3)).toContain('player1 uses Alluring Patron to move Kitsuki Investigator into the conflict');
            });

            it('should dishonor the character if chosen', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.alluringPatron],
                    defenders: [this.mirumotoRaitsugu]
                });
                this.player2.pass();
                this.player1.clickCard(this.alluringPatron);
                this.player1.clickCard(this.kitsukiInvestigator);
                this.player2.clickPrompt('Dishonor this character');
                expect(this.kitsukiInvestigator.isDishonored).toBe(true);
                expect(this.getChatLogs(3)).toContain('player1 uses Alluring Patron to dishonor Kitsuki Investigator');
            });

            it('should not allow you to target a character that cannot be dishonored or moved to the conflict', function() {
                this.otomoCourtier.dishonor();
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.alluringPatron],
                    defenders: [this.mirumotoRaitsugu]
                });
                this.player2.pass();
                this.player1.clickCard(this.alluringPatron);
                expect(this.player1).toHavePrompt('Choose a character');
                expect(this.player1).not.toBeAbleToSelect(this.mirumotoRaitsugu);
                expect(this.player1).toBeAbleToSelect(this.kitsukiInvestigator);
                expect(this.player1).not.toBeAbleToSelect(this.otomoCourtier);
            });

            it('should not prompt to move the conflict if the target is not eligible', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.alluringPatron],
                    defenders: [this.mirumotoRaitsugu]
                });
                this.player2.pass();
                this.player1.clickCard(this.alluringPatron);
                this.player1.clickCard(this.otomoCourtier);
                expect(this.otomoCourtier.isDishonored).toBe(true);
            });

            it('should not prompt to dishonor if the target is not eligible', function() {
                this.kitsukiInvestigator.dishonor();
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.alluringPatron],
                    defenders: [this.mirumotoRaitsugu]
                });
                this.player2.pass();
                this.player1.clickCard(this.alluringPatron);
                this.player1.clickCard(this.kitsukiInvestigator);
                expect(this.kitsukiInvestigator.isParticipating()).toBe(true);
            });
        });
    });
});
