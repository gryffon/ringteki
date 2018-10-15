describe('Court of Deception', function() {
    integration(function() {
        describe('Court of Deception\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['bayushi-liar','bayushi-yojiro'],
                        dynastyDiscard: ['court-of-deception']
                    },
                    player2: {
                        inPlay: ['moto-youth']
                    }
                });
                this.CoD = this.player1.placeCardInProvince('court-of-deception','province 1');
                this.liar = this.player1.findCardByName('bayushi-liar');
                this.yojiro = this.player1.findCardByName('bayushi-yojiro');
                this.youth = this.player2.findCardByName('moto-youth');
            });

            it('should correctly trigger at 6 honor', function() {
                this.player1.honor = 6;
                this.liar.dishonor();
                this.yojiro.dishonor();
                this.player1.clickCard(this.CoD);
                expect(this.player1).toHavePrompt('Court of Deception');
            });

            it('should correctly trigger below 6 honor', function() {
                this.player1.honor = 3;
                this.liar.dishonor();
                this.yojiro.dishonor();
                this.player1.clickCard(this.CoD);
                expect(this.player1).toHavePrompt('Court of Deception');
            });

            it('should not trigger above 6 honor', function() {
                this.player1.honor = 7;
                this.liar.dishonor();
                this.yojiro.dishonor();
                this.player1.clickCard(this.CoD);
                expect(this.player1).not.toHavePrompt('Court of Deception');
            });

            it('should only target dishonored characters at home', function() {
                this.player1.honor = 6;
                this.liar.dishonor();
                this.yojiro.dishonor();
                this.youth.dishonor();
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: ['bayushi-yojiro'],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.CoD);
                expect(this.player1).toHavePrompt('Court of Deception');
                expect(this.player1).not.toBeAbleToSelect(this.yojiro);
                expect(this.player1).toBeAbleToSelect(this.liar);
                expect(this.player1).not.toBeAbleToSelect(this.youth);
            });

            it('should correctly discard the status token', function() {
                this.player1.honor = 6;
                this.yojiro.dishonor();
                this.player1.clickCard(this.CoD);
                this.player1.clickCard(this.yojiro);
                expect(this.yojiro.isDishonored).toBe(false);
            });
        });
    });
});
