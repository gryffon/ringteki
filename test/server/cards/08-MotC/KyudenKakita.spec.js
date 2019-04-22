describe('Kyuden Kakita', function() {
    integration(function() {
        describe('kyuden Kakita\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        stronghold: 'kyuden-kakita',
                        inPlay: ['courtly-challenger']
                    },
                    player2: {
                        inPlay: ['sincere-challenger']
                    }
                });

                this.courtlyChallenger = this.player1.findCardByName(
                    'courtly-challenger');
                this.sincereChallenger = this.player2.findCardByName(
                    'sincere-challenger');

                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.courtlyChallenger],
                    defenders: [this.sincereChallenger]
                });
                this.player2.pass();
                this.player1.clickCard(this.courtlyChallenger);
                this.player1.clickCard(this.sincereChallenger);
            });

            it('should let you honor your character after winning a duel', function() {
                this.player1.clickPrompt('2');
                this.player2.clickPrompt('1');
                this.player1.clickCard('kyuden-kakita');
                expect(this.player1).toBeAbleToSelect(this.courtlyChallenger);
                this.player1.clickCard(this.courtlyChallenger);
                expect(this.courtlyChallenger.isHonored).toBe(true);
            });
        });
    });
});
