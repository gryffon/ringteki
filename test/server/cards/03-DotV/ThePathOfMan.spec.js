describe('The Path of Man', function() {
    integration(function() {
        describe('The Path of Man\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['asako-tsuki', 'fushicho'],
                        hand: ['the-path-of-man', 'banzai']
                    }
                });
                this.asakoTsuki = this.player1.findCardByName('asako-tsuki');
                this.fushicho = this.player1.findCardByName('fushicho');

                this.thePathOfMan = this.player1.findCardByName('the-path-of-man');
                this.banzai = this.player1.findCardByName('banzai');

                this.noMoreActions();
            });

            it('should not prompt if you win a conflict by less than 5', function() {
                this.initiateConflict({
                    attackers: [this.asakoTsuki],
                    defenders: []
                });
                this.noMoreActions();
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).toHavePrompt('Air Ring');
            });

            it('should prompt if you win a conflict by 5', function() {
                this.initiateConflict({
                    attackers: [this.asakoTsuki],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.banzai);
                this.player1.clickCard(this.asakoTsuki);
                this.player1.clickPrompt('Lose 1 honor to resolve this ability again');
                this.player1.clickCard(this.asakoTsuki);
                this.player1.clickPrompt('Done');
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.thePathOfMan);
            });

            it('should prompt if you win a conflict by more than 5', function() {
                this.initiateConflict({
                    attackers: [this.fushicho],
                    defenders: []
                });
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.thePathOfMan);
            });

            it('should give you 2 fate', function() {
                let fate = this.player1.player.fate;
                this.initiateConflict({
                    attackers: [this.fushicho],
                    defenders: []
                });
                this.noMoreActions();
                this.player1.clickCard(this.thePathOfMan);
                expect(this.player1.fate).toBe(fate + 2);
            });
        });
    });
});
