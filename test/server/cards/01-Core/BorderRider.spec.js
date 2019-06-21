describe('Border Rider', function () {
    integration(function () {
        describe('Border Rider\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['border-rider']
                    },
                    player2: {
                    }
                });

                this.borderRider = this.player1.findCardByName('border-rider');
                this.borderRider.bowed = true;
            });

            it('should ready itself', function () {
                this.player1.clickCard(this.borderRider);
                expect(this.borderRider.bowed).toBe(false);
            });
        });
    });
});
