describe('Borderlands Fortification', function () {
    integration(function () {
        describe('Borderlands Fortification\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        dynastyDiscard: ['iron-mine', 'borderlands-fortifications']
                    },
                    player2: {
                    }
                });

                this.ironMine = this.player1.placeCardInProvince('iron-mine', 'province 1');
                this.borderlandsFortification = this.player1.placeCardInProvince('borderlands-fortifications', 'province 2');
            });

            it('should switch it with a faceup card', function () {
                this.player1.clickCard(this.borderlandsFortification);
                expect(this.player1).toHavePrompt('Borderlands Fortifications');
                this.player1.clickCard(this.ironMine);
                expect(this.ironMine.location).toBe('province 2');
                expect(this.borderlandsFortification.location).toBe('province 1');
            });

            it('should switch it with a facedown card', function () {
                this.facedownCard = this.player1.player.getDynastyCardInProvince('province 3');
                this.player1.clickCard(this.borderlandsFortification);
                expect(this.player1).toHavePrompt('Borderlands Fortifications');
                this.player1.clickCard(this.facedownCard);
                expect(this.facedownCard.location).toBe('province 2');
                expect(this.borderlandsFortification.location).toBe('province 3');
            });

        });
    });
});
