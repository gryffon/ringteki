describe('Kaito Nobukai', function () {
    integration(function () {
        describe('Kaito Nobukai\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        dynastyDiscard: ['favorable-ground'],
                        inPlay: ['kaito-nobukai', 'asako-diplomat', 'naive-student','adept-of-the-waves']
                    },
                    player2: {
                        inPlay: ['bayushi-manipulator'],
                        dynastyDiscard: ['favorable-ground']
                    }
                });
                this.favorableGroundP1 = this.player1.placeCardInProvince('favorable-ground', 'province 1');
                this.favorableGroundP2 = this.player2.placeCardInProvince('favorable-ground', 'province 1');

                this.kaitoNobukai = this.player1.findCardByName('kaito-nobukai');
                this.adeptOfTheWaves = this.player1.findCardByName('adept-of-the-waves');
                this.asakoDiplomat = this.player1.findCardByName('asako-diplomat');
                this.naiveStudent = this.player1.findCardByName('naive-student');

                this.bayushiManipulator = this.player2.findCardByName('bayushi-manipulator');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: ['kaito-nobukai'],
                    defenders: []
                });
            });

            it('should not work work if not participating', function () {
                this.player2.pass();
                this.player1.clickCard(this.favorableGroundP1);
                this.player1.clickCard(this.kaitoNobukai);
                this.player2.pass();
                this.player1.clickCard(this.kaitoNobukai);
                expect(this.adeptOfTheWaves.bowed).toBe(false);
                expect(this.bayushiManipulator.bowed).toBe(false);
                expect(this.asakoDiplomat.bowed).toBe(false);
                expect(this.naiveStudent.bowed).toBe(false);
                expect(this.kaitoNobukai.location).not.toBe('dynasty discard pile');
            });

            it('should be sacrified as a cost', function () {
                this.player2.pass();
                this.player1.clickCard(this.kaitoNobukai);
                expect(this.kaitoNobukai.location).toBe('dynasty discard pile');
            });

            it('should bow each participating characters', function () {
                this.player2.clickCard(this.favorableGroundP2);
                this.player2.clickCard(this.bayushiManipulator);
                this.player1.clickCard(this.favorableGroundP1);
                this.player1.clickCard(this.adeptOfTheWaves);
                this.player2.pass();
                this.player1.clickCard(this.kaitoNobukai);
                expect(this.adeptOfTheWaves.bowed).toBe(true);
                expect(this.bayushiManipulator.bowed).toBe(true);
                expect(this.asakoDiplomat.bowed).toBe(false);
                expect(this.naiveStudent.bowed).toBe(false);
                expect(this.kaitoNobukai.location).toBe('dynasty discard pile');
            });

            it('should prevent characters from moving in the conflict', function () {
                this.player2.pass();
                this.player1.clickCard(this.kaitoNobukai);
                expect(this.kaitoNobukai.location).toBe('dynasty discard pile');
                this.player2.clickCard(this.favorableGroundP2);
                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.player2.pass();
                this.player1.clickCard(this.favorableGroundP1);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });
        });
    });
});
