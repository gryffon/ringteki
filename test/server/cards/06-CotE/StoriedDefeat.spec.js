describe('Storied Defeat', function() {
    integration(function() {
        describe('Storied Defeat\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['mirumoto-raitsugu','doomed-shugenja'],
                        hand: ['magnificent-triumph', 'storied-defeat']
                    },
                    player2: {
                        inPlay: ['doji-whisperer', 'doji-challenger'],
                        hand: ['banzai']
                    }
                });
                this.mirumotoRaitsugu = this.player1.findCardByName('mirumoto-raitsugu');
                this.doomedShugenja = this.player1.findCardByName('doomed-shugenja');
                this.magnificentTriumph = this.player1.findCardByName('magnificent-triumph');
                this.storiedDefeat = this.player1.findCardByName('storied-defeat');
                this.dojiWhisperer = this.player2.findCardByName('doji-whisperer');
                this.dojiChallenger = this.player2.findCardByName('doji-challenger');
                this.banzai = this.player2.findCardByName('banzai');
                this.dojiWhisperer.fate = 1;

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.mirumotoRaitsugu, this.doomedShugenja],
                    defenders: [this.dojiWhisperer, this.dojiChallenger]
                });
                this.player2.pass();
                this.player1.clickCard(this.mirumotoRaitsugu);
                this.player1.clickCard(this.dojiWhisperer);
                this.player1.clickPrompt('5');
                this.player2.clickPrompt('1');
            });

            it('should allow you to select characters that have lost a duel', function() {
                this.player2.pass();
                this.player1.clickCard(this.storiedDefeat);
                expect(this.player1).toHavePrompt('Storied Defeat');
                expect(this.player1).toBeAbleToSelect(this.dojiWhisperer);
                expect(this.player1).not.toBeAbleToSelect(this.mirumotoRaitsugu);
                expect(this.player1).not.toBeAbleToSelect(this.doomedShugenja);
                expect(this.player1).not.toBeAbleToSelect(this.dojiChallenger);
            });

            it('should bow the target', function() {
                this.player2.pass();
                this.player1.clickCard(this.storiedDefeat);
                this.player1.clickCard(this.dojiWhisperer);
                expect(this.dojiWhisperer.bowed).toBe(true);
                expect(this.dojiWhisperer.isDishonored).toBe(false);
            });

            it('should give the player the option to spend a fate', function() {
                this.player2.pass();
                this.player1.clickCard(this.storiedDefeat);
                this.player1.clickCard(this.dojiWhisperer);
                expect(this.player1).toHavePrompt('Storied Defeat');
                expect(this.player1).toHavePromptButton('Spend 1 fate to dishonor this character');
                expect(this.player1).toHavePromptButton('Done');
                this.player1.clickPrompt('Done');
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should dishonor the target if the player spends fate', function() {
                let fate = this.player1.fate;
                this.player2.pass();
                this.player1.clickCard(this.storiedDefeat);
                this.player1.clickCard(this.dojiWhisperer);
                this.player1.clickPrompt('Spend 1 fate to dishonor this character');
                expect(this.dojiWhisperer.isDishonored).toBe(true);
                expect(this.player1.fate).toBe(fate - 1);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should not give an option to spend fate when the player doesn`t have any', function() {
                this.player1.fate = 0;
                this.player2.pass();
                this.player1.clickCard(this.storiedDefeat);
                this.player1.clickCard(this.dojiWhisperer);
                expect(this.dojiWhisperer.bowed).toBe(true);
                expect(this.dojiWhisperer.isDishonored).toBe(false);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });
        });
    });
});

