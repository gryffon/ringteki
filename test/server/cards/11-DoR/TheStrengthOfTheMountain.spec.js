describe('The Strength of the Mountain', function () {
    integration(function () {
        describe('The Strength of the Mountain', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['hida-guardian', 'lion-s-pride-brawler', 'doji-kuwanan'],
                        hand: ['rout', 'retreat']
                    },
                    player2: {
                        inPlay: ['hida-guardian', 'lion-s-pride-brawler', 'doji-kuwanan'],
                        hand: ['rout', 'retreat', 'the-strength-of-the-mountain']
                    }
                });

                this.hidaGuardian = this.player1.findCardByName('hida-guardian');
                this.brawler = this.player1.findCardByName('lion-s-pride-brawler');
                this.kuwanan = this.player1.findCardByName('doji-kuwanan');

                this.rout = this.player1.findCardByName('rout');
                this.retreat = this.player1.findCardByName('retreat');

                this.hidaGuardian2 = this.player2.findCardByName('hida-guardian');
                this.brawler2 = this.player2.findCardByName('lion-s-pride-brawler');
                this.kuwanan2 = this.player2.findCardByName('doji-kuwanan');

                this.rout2 = this.player2.findCardByName('rout');
                this.retreat2 = this.player2.findCardByName('retreat');
                this.mountain = this.player2.findCardByName('the-strength-of-the-mountain');
                this.noMoreActions();
            });

            it('should not apply if there are no defenders', function () {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.hidaGuardian, this.brawler, this.kuwanan],
                    defenders: []
                });
                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.player2.clickCard(this.mountain);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should not be able to be bowed by opponent\'s card effects as a defender', function () {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.hidaGuardian, this.brawler, this.kuwanan],
                    defenders: [this.hidaGuardian2, this.brawler2, this.kuwanan2]
                });
                this.player2.clickCard(this.mountain);
                this.player1.clickCard(this.kuwanan);
                expect(this.player1).toBeAbleToSelect(this.hidaGuardian);
                expect(this.player1).toBeAbleToSelect(this.brawler);
                expect(this.player1).not.toBeAbleToSelect(this.hidaGuardian2);
                expect(this.player1).not.toBeAbleToSelect(this.brawler2);
            });

            it('should not be able to be sent home by opponent\'s card effects as a defender', function () {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.hidaGuardian, this.brawler, this.kuwanan],
                    defenders: [this.hidaGuardian2, this.brawler2, this.kuwanan2]
                });
                this.player2.clickCard(this.mountain);
                this.player1.clickCard(this.rout);
                expect(this.player1).not.toHavePrompt('Rout');
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should be able to be sent home by your own card effects as a defender', function () {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.hidaGuardian, this.brawler, this.kuwanan],
                    defenders: [this.hidaGuardian2, this.brawler2, this.kuwanan2]
                });
                this.player2.clickCard(this.mountain);
                this.player1.pass();
                this.player2.clickCard(this.retreat2);
                expect(this.player2).toBeAbleToSelect(this.hidaGuardian2);
                expect(this.player2).toBeAbleToSelect(this.brawler2);
                expect(this.player2).toBeAbleToSelect(this.kuwanan2);
                this.player2.clickCard(this.brawler2);
                expect(this.brawler2.isParticipating()).toBe(false);
            });

            it('should be able to be bowed by your own card effects', function () {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.hidaGuardian, this.brawler, this.kuwanan],
                    defenders: [this.hidaGuardian2, this.brawler2, this.kuwanan2]
                });
                this.player2.clickCard(this.mountain);
                this.player1.pass();
                this.player2.clickCard(this.kuwanan2);
                expect(this.player2).toBeAbleToSelect(this.hidaGuardian);
                expect(this.player2).toBeAbleToSelect(this.brawler);
                expect(this.player2).toBeAbleToSelect(this.hidaGuardian2);
                expect(this.player2).toBeAbleToSelect(this.brawler2);
            });

            it('should not apply to non-participating characters', function () {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.hidaGuardian, this.brawler, this.kuwanan],
                    defenders: [this.brawler2, this.kuwanan2]
                });
                this.player2.clickCard(this.mountain);
                this.player1.clickCard(this.brawler);
                expect(this.player1).toBeAbleToSelect(this.hidaGuardian);
                expect(this.player1).toBeAbleToSelect(this.brawler);
                expect(this.player1).toBeAbleToSelect(this.hidaGuardian2);
                expect(this.player1).not.toBeAbleToSelect(this.brawler2);
            });

            it('should not bow as a result of resolution', function () {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.hidaGuardian, this.brawler, this.kuwanan],
                    defenders: [this.hidaGuardian2, this.brawler2, this.kuwanan2]
                });
                this.player2.clickCard(this.mountain);
                this.player1.pass();
                this.player2.pass();
                this.player1.clickPrompt('Don\'t Resolve');

                expect(this.hidaGuardian.bowed).toBe(true);
                expect(this.brawler.bowed).toBe(true);
                expect(this.kuwanan.bowed).toBe(true);
                expect(this.hidaGuardian2.bowed).toBe(false);
                expect(this.brawler2.bowed).toBe(false);
                expect(this.kuwanan2.bowed).toBe(false);
            });

            it('should apply to opponents characters if you are attacking', function () {
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.hidaGuardian2, this.brawler2, this.kuwanan2],
                    defenders: [this.hidaGuardian, this.brawler, this.kuwanan]
                });

                this.player1.pass();
                this.player2.clickCard(this.mountain);

                this.player1.pass();
                this.player2.pass();
                this.player2.clickPrompt('Don\'t Resolve');

                expect(this.hidaGuardian.bowed).toBe(false);
                expect(this.brawler.bowed).toBe(false);
                expect(this.kuwanan.bowed).toBe(false);
                expect(this.hidaGuardian2.bowed).toBe(true);
                expect(this.brawler2.bowed).toBe(true);
                expect(this.kuwanan2.bowed).toBe(true);
            });

            it('should still restrict opponents card effects (bow)', function () {
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.hidaGuardian2, this.brawler2, this.kuwanan2],
                    defenders: [this.hidaGuardian, this.brawler, this.kuwanan]
                });

                this.player1.pass();
                this.player2.clickCard(this.mountain);

                this.player1.clickCard(this.kuwanan);
                expect(this.player1).not.toBeAbleToSelect(this.hidaGuardian);
                expect(this.player1).not.toBeAbleToSelect(this.brawler);
                expect(this.player1).toBeAbleToSelect(this.hidaGuardian2);
                expect(this.player1).toBeAbleToSelect(this.brawler2);
            });

            it('should still restrict opponents card effects (move)', function () {
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.hidaGuardian2, this.brawler2, this.kuwanan2],
                    defenders: [this.hidaGuardian, this.brawler, this.kuwanan]
                });

                this.player1.pass();
                this.player2.clickCard(this.mountain);

                this.player1.clickCard(this.retreat);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not restrict my card effects (bow)', function () {
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.hidaGuardian2, this.brawler2, this.kuwanan2],
                    defenders: [this.hidaGuardian, this.brawler, this.kuwanan]
                });

                this.player1.pass();
                this.player2.clickCard(this.mountain);
                this.player1.pass();
                this.player2.clickCard(this.kuwanan2);
                expect(this.player2).toBeAbleToSelect(this.hidaGuardian);
                expect(this.player2).toBeAbleToSelect(this.brawler);
                expect(this.player2).toBeAbleToSelect(this.hidaGuardian2);
                expect(this.player2).toBeAbleToSelect(this.brawler2);
            });

            it('should not restrict my card effects (move)', function () {
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.hidaGuardian2, this.brawler2, this.kuwanan2],
                    defenders: [this.hidaGuardian, this.brawler, this.kuwanan]
                });

                this.player1.pass();
                this.player2.clickCard(this.mountain);
                this.player1.pass();
                this.player2.clickCard(this.rout2);
                expect(this.player2).toBeAbleToSelect(this.hidaGuardian);
                expect(this.player2).toBeAbleToSelect(this.brawler);
            });
        });
    });
});
