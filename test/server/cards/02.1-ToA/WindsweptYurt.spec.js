describe('Windswept Yurt', function () {
    integration(function () {
        describe('Windswept Yurt\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        dynastyDiscard: ['windswept-yurt']
                    },
                    player2: {
                    }
                });
                this.windsweptYurt = this.player1.placeCardInProvince('windswept-yurt', 'province 1');
            });

            it('should prompt to choose', function () {
                this.player1.clickCard(this.windsweptYurt);
                expect(this.player1).toHavePrompt('Windswept Yurt');
            });

            it('should give both players 2 fate if chosen', function () {
                var player1StartingFate = this.player1.fate;
                var player2StartingFate = this.player2.fate;
                this.player1.fate = player1StartingFate;
                this.player2.fate = player2StartingFate;
                this.player1.clickCard(this.windsweptYurt);
                this.player1.clickPrompt('Each player gains 2 fate');
                expect(this.player1.fate).toBe(player1StartingFate + 2);
                expect(this.player2.fate).toBe(player2StartingFate + 2);
            });

            it('should give both players 2 honor if chosen', function () {
                var player1StartingHonor = this.player1.honor;
                var player2StartingHonor = this.player2.honor;
                this.player1.honor = player1StartingHonor;
                this.player2.honor = player2StartingHonor;
                this.player1.clickCard(this.windsweptYurt);
                this.player1.clickPrompt('Each player gains 2 honor');
                expect(this.player1.honor).toBe(player1StartingHonor + 2);
                expect(this.player2.honor).toBe(player2StartingHonor + 2);
            });

            it('should sacrifice itself', function () {
                this.player1.clickCard(this.windsweptYurt);
                this.player1.clickPrompt('Each player gains 2 fate');
                expect(this.windsweptYurt.location).toBe('dynasty discard pile');
            });

            it('should refill faceup', function () {
                this.player1.clickCard(this.windsweptYurt);
                this.player1.clickPrompt('Each player gains 2 fate');
                this.newCard = this.player1.player.getDynastyCardInProvince('province 1');
                expect(this.newCard.facedown).toBe(false);
            });

        });
    });
});
