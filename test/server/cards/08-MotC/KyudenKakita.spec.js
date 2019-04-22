describe('Kyuden Kakita', function() {
    integration(function() {
        describe('kyuden Kakita\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        stronghold: 'kyuden-kakita',
                        inPlay: ['sincere-challenger']
                    },
                    player2: {
                        inPlay: ['honest-challenger', 'shrine-maiden']
                    }
                });

                this.sincereChallenger = this.player1.findCardByName(
                    'sincere-challenger');
                this.shrineMaiden = this.player2.findCardByName(
                    'shrine-maiden');

                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.sincereChallenger],
                    defenders: [this.shrineMaiden]
                });
                this.player2.pass();
                this.player1.clickCard(this.sincereChallenger);
                this.player1.clickCard(this.shrineMaiden);
            });

            it('should let you honor your character after winning a duel', function() {
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('2');
                expect(this.player1).toBeAbleToSelect('kyuden-kakita');
                this.player1.clickCard('kyuden-kakita');
                expect(this.player1).toHavePrompt('Kyūden Kakita');
                expect(this.player1).toBeAbleToSelect(this.sincereChallenger);
                expect(this.player1).not.toBeAbleToSelect(this.shrineMaiden);
                this.player1.clickCard(this.sincereChallenger);
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.sincereChallenger.isHonored).toBe(true);
            });
        });
    });
});
