describe('Natural Negotatior', function() {
    integration(function() {
        describe('Natural Negotatior\'s ability', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['ide-tadaji', 'moto-youth'],
                        hand: ['natural-negotiator'],
                        honor: 10
                    },
                    player2: {
                        inPlay: ['bayushi-shoju'],
                        honor: 10
                    }
                });
                this.ideTadaji = this.player1.findCardByName('ide-tadaji');
                this.motoYouth = this.player1.findCardByName('moto-youth');
                this.naturalNegotiator = this.player1.findCardByName('natural-negotiator');

                this.bayushiShoju = this.player2.findCardByName('bayushi-shoju');

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.ideTadaji, this.motoYouth],
                    defenders: [this.bayushiShoju]
                });
            });

            it('should only be able to be attached to a corutier you control', function () {
                this.player2.pass();

                this.player1.clickCard(this.naturalNegotiator);

                expect(this.player1).toBeAbleToSelect(this.ideTadaji);
                expect(this.player1).not.toBeAbleToSelect(this.motoYouth);
                expect(this.player1).not.toBeAbleToSelect(this.bayushiShoju);
            });

            it('should give the opponent 1 honor and switch the attached character\'s base skills', function () {
                this.player2.pass();

                this.player1.clickCard(this.naturalNegotiator);
                this.player1.clickCard(this.ideTadaji);
                this.player2.pass();
                this.player1.clickCard(this.naturalNegotiator);

                expect(this.player1.honor).toBe(9);
                expect(this.player2.honor).toBe(11);
                expect(this.ideTadaji.getMilitarySkill()).toBe(4);
                expect(this.ideTadaji.getPoliticalSkill()).toBe(1);

                expect(this.getChatLogs(10)).toContain('player1 uses Natural Negotiator, giving 1 honor to player2 to switch Ide Tadaji\'s base military and political skill');
            });
        });
    });
});

