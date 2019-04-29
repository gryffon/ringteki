describe('Defend Your Honor', function() {
    integration(function() {
        describe('Defend Your Honor\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['border-rider'],
                        hand: ['defend-your-honor']
                    },
                    player2: {
                        inPlay: ['doji-challenger', 'doji-whisperer'],
                        hand: ['way-of-the-crane']
                    }
                });
                this.borderRider = this.player1.findCardByName('border-rider');
                this.defendYourHonor = this.player1.findCardByName('defend-your-honor');

                this.dojiChallenger = this.player2.findCardByName('doji-challenger');
                this.dojiWhisperer = this.player2.findCardByName('doji-whisperer');
                this.wayOfTheCrane = this.player2.findCardByName('way-of-the-crane');
            });

            it('should not be able to be triggered outside of a conflict', function() {
                this.player1.pass();
                expect(this.player2).toHavePrompt('Action Window');
                this.player2.clickCard(this.wayOfTheCrane);
                this.player2.clickCard(this.dojiChallenger);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.dojiChallenger.isHonored).toBe(true);
            });

            it('should trigger when your opponent plays an event', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.borderRider],
                    defenders: [this.dojiChallenger],
                    type: 'political'
                });
                this.player2.clickCard(this.wayOfTheCrane);
                this.player2.clickCard(this.dojiChallenger);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.defendYourHonor);
            });

            it('should initiate a duel with your opponent choosing the duel target', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.borderRider],
                    defenders: [this.dojiChallenger],
                    type: 'political'
                });
                this.player2.clickCard(this.wayOfTheCrane);
                this.player2.clickCard(this.dojiChallenger);
                this.player1.clickCard(this.defendYourHonor);
                expect(this.player1).toHavePrompt('Choose a character');
                expect(this.player1).toBeAbleToSelect(this.borderRider);
                expect(this.player1).not.toBeAbleToSelect(this.dojiChallenger);
                expect(this.player1).not.toBeAbleToSelect(this.dojiWhisperer);
                this.player1.clickCard(this.borderRider);
                expect(this.player2).toHavePrompt('Choose a character');
                expect(this.player2).not.toBeAbleToSelect(this.borderRider);
                expect(this.player2).toBeAbleToSelect(this.dojiChallenger);
                expect(this.player2).not.toBeAbleToSelect(this.dojiWhisperer);
                this.player2.clickCard(this.dojiChallenger);
                expect(this.player1).toHavePrompt('Choose your bid for the duel\nBorder Rider: 2 vs 3: Doji Challenger');
            });

            it('should cancel the event if you win the duel', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.borderRider],
                    defenders: [this.dojiChallenger],
                    type: 'political'
                });
                this.player2.clickCard(this.wayOfTheCrane);
                this.player2.clickCard(this.dojiChallenger);
                this.player1.clickCard(this.defendYourHonor);
                this.player1.clickCard(this.borderRider);
                this.player2.clickCard(this.dojiChallenger);
                this.player1.clickPrompt('5');
                this.player2.clickPrompt('1');
                expect(this.getChatLogs(3)).toContain('Duel Effect: cancel the effects of Way of the Crane');
                expect(this.dojiChallenger.isHonored).toBe(false);
            });

            it('should not cancel the event if you do not win the duel', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.borderRider],
                    defenders: [this.dojiChallenger],
                    type: 'political'
                });
                this.player2.clickCard(this.wayOfTheCrane);
                this.player2.clickCard(this.dojiChallenger);
                this.player1.clickCard(this.defendYourHonor);
                this.player1.clickCard(this.borderRider);
                this.player2.clickCard(this.dojiChallenger);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('5');
                expect(this.dojiChallenger.isHonored).toBe(true);
            });
        });
    });
});
