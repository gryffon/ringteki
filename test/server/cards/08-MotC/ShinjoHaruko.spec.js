describe('Shinjo Haruko', function() {
    integration(function() {
        describe('Shinjo Haruko\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shinjo-haruko', 'solemn-scholar']
                    },
                    player2: {
                        inPlay: ['honest-challenger', 'shrine-maiden']
                    }
                });

                this.haruko = this.player1.findCardByName('shinjo-haruko');
                this.honestChallenger = this.player2.findCardByName('honest-challenger');
                this.solemnScholar = this.player1.findCardByName('solemn-scholar');
                this.shrineMaiden = this.player2.findCardByName('shrine-maiden');

                this.shrineMaiden.honor();
                this.solemnScholar.honor();

                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.haruko],
                    defenders: [this.honestChallenger]
                });

                this.player2.pass();
            });

            it('should pull in your opponents honored characters', function() {
                this.player1.clickCard(this.haruko);
                expect(this.player1).toHavePrompt('Shinjo Haruko');
                expect(this.player1).toBeAbleToSelect(this.shrineMaiden);
                this.player1.clickCard(this.shrineMaiden);
                expect(this.shrineMaiden.inConflict).toBe(true);
            });
        });
    });
});
