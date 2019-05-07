describe('Distinguished Dojo', function() {
    integration(function() {
        describe('Distinguished\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        dynastyDiscard: ['distinguished-dojo'],
                        inPlay: ['aspiring-challenger'],
                        hand: ['policy-debate', 'civil-discourse']
                    },
                    player2: {
                        inPlay: ['mirumoto-raitsugu']
                    }
                });
                this.distinguishedDojo = this.player1.placeCardInProvince('distinguished-dojo', 'province 1');
                this.aspiringChallenger = this.player1.findCardByName('aspiring-challenger');
                this.policyDebate = this.player1.findCardByName('policy-debate');
                this.civilDiscourse = this.player1.findCardByName('civil-discourse');

                this.mirumotoRaitsugu = this.player2.findCardByName('mirumoto-raitsugu');
                this.mirumotoRaitsugu.fate = 1;

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.aspiringChallenger],
                    defenders: [this.mirumotoRaitsugu],
                    type: 'political'
                });
            });

            it('should not trigger after you lose a duel', function() {
                this.player2.pass();
                this.player1.clickCard(this.aspiringChallenger);
                this.player1.clickCard(this.mirumotoRaitsugu);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('5');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should not trigger after you draw a duel', function() {
                this.player2.pass();
                this.player1.clickCard(this.aspiringChallenger);
                this.player1.clickCard(this.mirumotoRaitsugu);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should trigger after you win a duel', function() {
                this.player2.pass();
                this.player1.clickCard(this.aspiringChallenger);
                this.player1.clickCard(this.mirumotoRaitsugu);
                this.player1.clickPrompt('5');
                this.player2.clickPrompt('1');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.distinguishedDojo);
            });

            it('should add an honor to itself', function() {
                this.player2.pass();
                this.player1.clickCard(this.aspiringChallenger);
                this.player1.clickCard(this.mirumotoRaitsugu);
                this.player1.clickPrompt('5');
                this.player2.clickPrompt('1');
                this.player1.clickCard(this.distinguishedDojo);
                expect(this.distinguishedDojo.getTokenCount('honor')).toBe(1);
                expect(this.getChatLogs(1)).toContain('player1 uses Distinguished Dōjō to add a honor token to Distinguished Dōjō');
            });

            it('should prompt to optionally sacrifice itself', function() {
                this.player2.pass();
                this.player1.clickCard(this.aspiringChallenger);
                this.player1.clickCard(this.mirumotoRaitsugu);
                this.player1.clickPrompt('5');
                this.player2.clickPrompt('1');
                this.player1.clickCard(this.distinguishedDojo);
                expect(this.player1).toHavePrompt('Sacrifice Distinguished Dōjō?');
                expect(this.player1).toHavePromptButton('Yes');
                expect(this.player1).toHavePromptButton('No');
            });

            it('should, if \'No\' is chosen for sacrifice, have no further effect', function() {
                let honor = this.player1.player.honor;
                this.player2.pass();
                this.player1.clickCard(this.aspiringChallenger);
                this.player1.clickCard(this.mirumotoRaitsugu);
                this.player1.clickPrompt('5');
                this.player2.clickPrompt('1');
                expect(this.player1.player.honor).toBe(honor - 4);
                this.player1.clickCard(this.distinguishedDojo);
                this.player1.clickPrompt('No');
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.getChatLogs(4)).toContain('player1 chooses not to sacrifice Distinguished Dōjō');
                expect(this.player1.player.honor).toBe(honor - 4);
            });

            it('should, if \'Yes\' is chosen for sacrifice, sacrifice itself', function() {
                this.player2.pass();
                this.player1.clickCard(this.aspiringChallenger);
                this.player1.clickCard(this.mirumotoRaitsugu);
                this.player1.clickPrompt('5');
                this.player2.clickPrompt('1');
                this.player1.clickCard(this.distinguishedDojo);
                this.player1.clickPrompt('Yes');
                expect(this.distinguishedDojo.location).toBe('dynasty discard pile');
                expect(this.getChatLogs(5)).toContain('player1 chooses to sacrifice Distinguished Dōjō');
            });

            it('should, if \'Yes\' is chosen for sacrifice, gain honor equal to the number of honor tokens', function() {
                let honor = this.player1.player.honor;
                this.player2.pass();
                this.player1.clickCard(this.aspiringChallenger);
                this.player1.clickCard(this.mirumotoRaitsugu);
                this.player1.clickPrompt('3');
                this.player2.clickPrompt('1');
                expect(this.player1.player.honor).toBe(honor - 2);
                this.player1.clickCard(this.distinguishedDojo);
                this.player1.clickPrompt('No');
                expect(this.player1.player.honor).toBe(honor - 2);
                this.player2.clickCard(this.mirumotoRaitsugu);
                this.player2.clickCard(this.aspiringChallenger);
                this.player1.clickPrompt('3');
                this.player2.clickPrompt('1');
                expect(this.player1.player.honor).toBe(honor - 4);
                this.player1.clickCard(this.distinguishedDojo);
                this.player1.clickPrompt('Yes');
                expect(this.player1.player.honor).toBe(honor - 4 + 2);
                expect(this.getChatLogs(4)).toContain('player1 uses Distinguished Dōjō to gain 2 honor');
            });

            it('should be limited to 3 times per round', function() {
                this.player2.clickCard(this.mirumotoRaitsugu);
                this.player2.clickCard(this.aspiringChallenger);
                this.player1.clickPrompt('3');
                this.player2.clickPrompt('1');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.distinguishedDojo);
                this.player1.clickCard(this.distinguishedDojo);
                this.player1.clickPrompt('No');
                expect(this.distinguishedDojo.getTokenCount('honor')).toBe(1);
                this.player1.clickCard(this.aspiringChallenger);
                this.player1.clickCard(this.mirumotoRaitsugu);
                this.player1.clickPrompt('3');
                this.player2.clickPrompt('1');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.distinguishedDojo);
                this.player1.clickCard(this.distinguishedDojo);
                this.player1.clickPrompt('No');
                expect(this.distinguishedDojo.getTokenCount('honor')).toBe(2);
                this.player2.pass();
                this.player1.clickCard(this.civilDiscourse);
                this.player1.clickCard(this.aspiringChallenger);
                this.player2.clickCard(this.mirumotoRaitsugu);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.distinguishedDojo);
                this.player1.clickCard(this.distinguishedDojo);
                this.player1.clickPrompt('No');
                expect(this.distinguishedDojo.getTokenCount('honor')).toBe(3);
                this.player2.pass();
                this.player1.clickCard(this.policyDebate);
                this.player1.clickCard(this.aspiringChallenger);
                this.player1.clickCard(this.mirumotoRaitsugu);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.distinguishedDojo.getTokenCount('honor')).toBe(3);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });
        });
    });
});
