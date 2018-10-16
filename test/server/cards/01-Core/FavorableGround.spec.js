describe('Favorable Ground', function () {
    integration(function () {
        describe('Favorable Ground\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        dynastyDiscard: ['favorable-ground'],
                        inPlay: ['adept-of-the-waves', 'asako-diplomat', 'naive-student','shiba-peacemaker']
                    },
                    player2: {
                        inPlay: ['bayushi-manipulator']
                    }
                });
                this.favorableGround = this.player1.placeCardInProvince('favorable-ground', 'province 1');

                this.adeptOfTheWaves = this.player1.findCardByName('adept-of-the-waves');
                this.asakoDiplomat = this.player1.findCardByName('asako-diplomat');
                this.naiveStudent = this.player1.findCardByName('naive-student');
                this.shibaPeacemaker = this.player1.findCardByName('shiba-peacemaker');

                this.bayushiManipulatorr = this.player2.findCardByName('bayushi-manipulator');
            });

            it('should not be triggered outside of a conflict', function () {
                this.player1.clickCard(this.favorableGround);
                expect(this.player1).toHavePrompt('Initiate an action');
            });

            describe('during a conflict', function () {
                beforeEach(function () {
                    this.noMoreActions();
                    this.initiateConflict({
                        type: 'military',
                        attackers: ['adept-of-the-waves'],
                        defenders: []
                    });
                    this.player2.clickPrompt('Pass');
                    this.player1.clickCard(this.favorableGround);
                });

                it('should prompt to select a character', function () {
                    expect(this.player1).toHavePrompt('Choose a character');
                });

                it('should only target a unit you control', function () {
                    expect(this.player1).not.toBeAbleToSelect(this.bayushiManipulatorr);
                });

                it('should not allow selecting a character which is unable to participate in the conflict due to a dash', function () {
                    expect(this.player1).not.toBeAbleToSelect(this.naiveStudent);
                });

                it('should not allow selecting a character which is unable to participate in the conflict due to a constant ability', function () {
                    expect(this.player1).not.toBeAbleToSelect(this.shibaPeacemaker);
                });

                describe('if a participarting character is selected', function () {
                    beforeEach(function () {
                        this.player1.clickCard(this.adeptOfTheWaves);
                    });

                    it('should move the target home', function () {
                        expect(this.adeptOfTheWaves.inConflict).toBe(false);
                        expect(this.game.currentConflict.attackers).not.toContain(this.adeptOfTheWaves);
                    });
                });

                describe('if a non-participarting character is selected', function () {
                    beforeEach(function () {
                        this.player1.clickCard(this.asakoDiplomat);
                    });

                    it('should move the target to the conflict', function () {
                        expect(this.asakoDiplomat.inConflict).toBe(true);
                        expect(this.game.currentConflict.attackers).toContain(this.asakoDiplomat);
                    });
                });

                describe('if it resolves', function () {
                    beforeEach(function () {
                        this.player1.clickCard(this.adeptOfTheWaves);
                    });

                    it('should refill the province', function () {
                        this.player1.clickCard(this.favorableGround);
                        this.newCard = this.player1.player.getDynastyCardInProvince('province 1');
                        expect(this.newCard).not.toBeUndefined();
                    });

                    it('should sacrifice itself', function () {
                        this.player1.clickCard(this.favorableGround);
                        expect(this.favorableGround.location).toBe('dynasty discard pile');
                    });
                });
            });

        });
    });
});
