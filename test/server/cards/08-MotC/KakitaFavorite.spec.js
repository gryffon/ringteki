describe('Kakita Favorite', function() {
    integration(function() {
        describe('Kakita Favorite\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 10,
                        inPlay: ['border-rider']
                    },
                    player2: {
                        honor: 10,
                        inPlay: ['kakita-favorite'],
                        hand: ['policy-debate']
                    }
                });

                this.kakitaFavorite = this.player2.findCardByName(
                    'kakita-favorite'
                );
                this.policyDebate = this.player2.findCardByName(
                    'policy-debate'
                );

                this.borderRider = this.player1.findCardByName('border-rider');

                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['border-rider'],
                    defenders: ['kakita-favorite']
                });
            });

            it('should not have extra political outside of a duel', function() {
                expect(this.kakitaFavorite.politicalSkill).toBe(1);
            });

            it('should have extra political during a duel', function() {
                this.player2.clickCard(this.policyDebate);
                this.player2.clickCard(this.kakitaFavorite);
                this.player2.clickCard(this.borderRider);
                expect(this.kakitaFavorite.politicalSkill).toBe(3);
            });
        });
    });
});
