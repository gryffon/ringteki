describe('Chisei District', function () {
    integration(function () {
        describe('Chisei District\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['adept-of-the-waves', 'seppun-guardsman']
                    },
                    player2: {
                        provinces: ['pilgrimage'],
                        dynastyDeck: ['chisei-district']
                    }
                });

                this.adeptOfTheWaves = this.player1.findCardByName('adept-of-the-waves');
                this.seppunGuardsman = this.player1.findCardByName('seppun-guardsman');

                this.pilgrimage = this.player2.findCardByName('pilgrimage');
                this.chiseiDistrict = this.player2.placeCardInProvince('chisei-district', 'province 1');

                this.noMoreActions();
            });

            it('should not allow military conflicts to be declared against it\'s province', function () {
                let _this = this;
                expect(function () {
                    _this.initiateConflict({
                        type: 'military',
                        province: this.pilgrimage,
                        attackers: [this.adeptOfTheWaves],
                        defenders: []
                    });
                }).toThrow();
                expect(this.player1).toHavePrompt('Choose province to attack');
            });

            it('should allow political conflicts to be declared against it\'s province', function () {
                this.initiateConflict({
                    type: 'political',
                    province: this.pilgrimage,
                    attackers: [this.adeptOfTheWaves],
                    defenders: []
                });
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should deselect the province if the conflict type is changed during declaring a conflict', function() {
                this.player1.clickCard(this.adeptOfTheWaves);
                this.player1.clickRing('air');
                this.player1.clickRing('air');
                this.player1.clickCard(this.pilgrimage);
                expect(this.player1).toHavePromptButton('Initiate Conflict');
                this.player1.clickRing('air');
                expect(this.player1).not.toHavePromptButton('Initiate Conflict');
            });
        });
    });
});

