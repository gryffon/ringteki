describe('Court of Justice', function () {
    integration(function () {
        describe('Court of Justice\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        dynastyDiscard: ['court-of-justice'],
                        inPlay: ['isawa-heiko', 'valiant-oathkeeper']
                    },
                    player2: {
                        inPlay: ['akodo-makoto', 'bayushi-liar'],
                        hand: ['clarity-of-purpose']
                    }
                });

                this.courtOfJustice = this.shrine = this.player1.placeCardInProvince('court-of-justice', 'province 1');

                this.heiko = this.player1.findCardByName('isawa-heiko');
                this.oathkeeper = this.player1.findCardByName('valiant-oathkeeper');
                this.makoto = this.player2.findCardByName('akodo-makoto');
                this.liar = this.player2.findCardByName('bayushi-liar');

                this.noMoreActions();
            });

            it('should allow you to look at 3 cards in the opponents hand after you win a political conflict', function() {
                this.initiateConflict({
                    attackers: [this.heiko],
                    defenders: [this.makoto],
                    type: 'political'
                });

                this.player2.pass();
                this.player1.pass();

                this.chat = spyOn(this.game, 'addMessage');

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.courtOfJustice);
            });

            it('shouldn\'t allow you to look at 3 cards in the opponents hand after you lose a political conflict', function() {
                this.initiateConflict({
                    attackers: [this.oathkeeper],
                    defenders: [this.liar],
                    type: 'political'
                });

                this.player2.pass();
                this.player1.pass();

                this.chat = spyOn(this.game, 'addMessage');

                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).not.toBeAbleToSelect(this.courtOfJustice);
            });
        });
    });
});
