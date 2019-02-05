describe('Miya Library', function () {
    integration(function () {
        describe('Miya Library\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        inPlay: ['miya-library', 'kanjo-district', 'miya-satoshi', 'adept-of-the-waves', 'kudaka', 'naive-student']
                    },
                    player2: {
                    }
                });
                this.miyaLibrary = this.player1.findCardByName('miya-library');
                this.player1.placeCardInProvince('miya-library', 'province 1');
                this.player1.moveCard('miya-satoshi', 'dynasty deck');
                this.player1.moveCard('kanjo-district', 'dynasty deck');
                this.player1.moveCard('adept-of-the-waves', 'dynasty deck');
                this.player1.moveCard('kudaka', 'dynasty deck');

            });

            it('should allow you to replace the library for satoshi', function () {
                this.player1.clickCard(this.miyaLibrary);
                expect(this.player1).toHavePrompt('select an imperial character to replace miya library');
                this.player1.clickPrompt('Miya Satoshi');
                expect(this.player1).toHavePrompt('Select the card you would like to place on top of your dynasty deck');
                this.player1.clickPrompt('Kanjo District');
                expect(this.player1).toHavePrompt('Which card would you like to put back now');
                this.player1.clickPrompt('Adept of the Waves');
                expect(this.player1).toHavePrompt('Which card would you like to put back now');
                this.player1.clickPrompt('Kudaka');
                expect(this.player2).toHavePrompt('Play cards from provinces');
                this.player2.pass();
                this.player1.clickCard('miya-satoshi');
            });

            it('should not let you select an imperial holding', function () {
                this.player1.clickCard(this.miyaLibrary);
                expect(this.player1).not.toBeAbleToSelect('kanjo-district');
            });

            it('should still let you rearrange your deck if there is not an imperial character', function () {
                this.player1.moveCard('naive-student', 'dynasty deck');
                this.player1.clickCard(this.miyaLibrary);
                expect(this.player1).not.toBeAbleToSelect('miya-satoshi');
                expect(this.player1).toHavePrompt('select an imperial character to replace miya library');
                this.player1.clickPrompt('Do not replace Miya Library');
                expect(this.player1).toHavePrompt('Which card would you like to put back now');
            });
        });
    });
});
