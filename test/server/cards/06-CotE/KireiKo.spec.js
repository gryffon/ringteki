describe('KireiKo', function() {
    integration(function() {
        describe('KireiKo\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['honored-general','moto-juro','kitsu-spiritcaller'],
                        dynastyDiscard: ['windswept-yurt'],
                        hand: ['fine-katana','charge']
                    },
                    player2: {
                        inPlay: [],
                        hand: ['kirei-ko']
                    }
                });
                this.juro = this.player1.findCardByName('moto-juro');
                this.general = this.player1.placeCardInProvince('honored-general', 'province 1');
                this.kitsu = this.player1.findCardByName('kitsu-spiritcaller');

                this.kireiko = this.player2.findCardByName('kirei-ko');
            });

            it('should work after a character triggers an action ability', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['moto-juro'],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.juro);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.kireiko);
                this.player2.clickCard(this.kireiko);
                expect(this.juro.bowed).toBe(true);
            });

            it('should work after a character triggers a reaction ability', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['moto-juro'],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard('charge');
                this.player1.clickCard(this.general);
                this.player1.clickCard(this.general);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.kireiko);
                this.player2.clickCard(this.kireiko);
                expect(this.general.bowed).toBe(true);
            });

            it('should not work after a character bows as a cost', function() {
                this.player1.player.moveCard(this.juro,'dynasty discard pile');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['kitsu-spiritcaller'],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.kitsu);
                this.player1.clickCard(this.juro);
                expect(this.juro.inConflict).toBe(true);
                expect(this.kitsu.bowed).toBe(true);
                expect(this.player2).not.toHavePrompt('Triggered Abilities');
                expect(this.player2).not.toBeAbleToSelect(this.kireiko);
            });
        });
    });
});
