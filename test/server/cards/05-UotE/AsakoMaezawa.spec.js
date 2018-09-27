describe('Asako Maezawa', function() {
    integration(function() {
        describe('Asako Maezawa\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['asako-maezawa', 'adept-of-the-waves']
                    },
                    player2: {
                        inPlay: ['shinjo-outrider','shinjo-scout']
                    }
                });
                this.asako = this.player1.findCardByName('asako-maezawa');
                this.adept = this.player1.findCardByName('adept-of-the-waves');
                this.outrider = this.player2.findCardByName('shinjo-outrider');
                this.scout = this.player2.findCardByName('shinjo-scout');
            });

            it('should trigger if the player has more readied and participating glory', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.asako],
                    defenders: [this.scout]
                });

                this.player2.pass();
                this.player1.clickCard(this.asako);
                expect(this.player1).toHavePrompt('Choose a character');
            });

            it('should not trigger when the opponent has equal or greater readied and participating glory', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.asako],
                    defenders: [this.outrider]
                });

                this.player2.pass();
                this.player1.clickCard(this.asako);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not trigger when Maezawa is not present', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.adept],
                    defenders: []
                });

                this.player2.pass();
                this.player1.clickCard(this.asako);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should have double the target\'s base political skill', function() {
                this.basePol = this.asako.getBasePoliticalSkill();

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.asako],
                    defenders: [this.scout]
                });

                this.player2.pass();
                this.player1.clickCard(this.asako);
                expect(this.player1).toHavePrompt('Choose a character');
                this.player1.clickCard(this.asako);
                expect(this.asako.getBasePoliticalSkill()).toBe(this.basePol * 2);
            });
        });
    });
});
