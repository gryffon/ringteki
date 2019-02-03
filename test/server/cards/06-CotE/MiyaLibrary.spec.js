fdescribe('Miya Library', function () {
    integration(function () {
        describe('Miya Library\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        inPlay: [],
                        dynastyDeck: ['kanjo-district', 'shiba-tsukune', 'miya-satoshi', 'adept-of-the-waves', 'kudaka']
                    },
                    player2: {
                    }
                });
                this.miyaLibrary = this.player1.placeCardInProvince('miya-library', 'province 1');

            });

            it('should allow you to replace the library for satoshi', function () {
                this.player1.clicksCard(this.miyaLibrary);
                expect(this.player1).toHavePrompt('select an imperial character to replace miya library.');
                this.player1.clicksCard('miya-satoshi');
                expect(this.player1).toHavePrompt('Which card would you like to put back now');
                this.player1.clicksCard('kanjo-district');
                expect(this.player1).toHavePrompt('Which card would you like to put back now');
                this.player1.clicksCard('shiba-tsukune');
                expect(this.player1).toHavePrompt('Which card would you like to put back now');
                this.player1.clicksCard('adept-of-the-waves');
                expect(this.player1).toHavePrompt('Which card would you like to put back now');
                this.player1.clicksCard('kudaka');
                expect(this.player1).toHavePrompt('Which card would you like to put back now');
                this.player1.clicksCard(this.miyaLibrary);
                expect(this.player2).toHavePrompt('Dynasty Action Window');
                this.player2.pass();
                this.player1.clicksCard('miya-satoshi');
            });
        });
    });
});
