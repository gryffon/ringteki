describe('Greater Understanding', function() {
    integration(function() {
        describe('Greater Understanding\'s functionality', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['togashi-yokuni', 'master-alchemist', 'miya-mystic'],
                        hand: ['let-go', 'greater-understanding', 'fine-katana', 'ornate-fan', 'hand-to-hand'],
                        fate: 10
                    },
                    player2: {
                        inPlay: ['bayushi-shoju', 'bayushi-collector'],
                        hand: [],
                        dynastyDeck: ['karada-district'],
                        provinces: ['manicured-garden']
                    }
                });


                this.togashiYokuni = this.player1.findCardByName('togashi-yokuni');
                this.letGo = this.player1.findCardByName('let-go');
                this.miyaMystic = this.player1.findCardByName('miya-mystic');
                this.ornateFan = this.player1.findCardByName('ornate-fan');
                this.fineKatana = this.player1.findCardByName('fine-katana');
                this.masterAlchemist = this.player1.findCardByName('master-alchemist');
                this.greaterUnderstanding = this.player1.findCardByName('greater-understanding');
                this.handToHand = this.player1.findCardByName('hand-to-hand');
                this.karadaDistrict = this.player2.placeCardInProvince('karada-district', 'province 1');
                this.bayushiShoju = this.player2.findCardByName('bayushi-shoju');
                this.bayushiSCollector = this.player2.findCardByName('bayushi-collector');
                this.manicuredGarden = this.player2.findCardByName('manicured-garden');
            });

            it('should allow you to play general attachment removal on Greater Understanding', function() {
                this.player1.clickCard(this.greaterUnderstanding);
                this.player1.clickRing('fire');
                expect(this.game.rings['fire'].attachments).toContain(this.greaterUnderstanding);

                this.player2.pass();
                this.player1.clickCard(this.letGo);
                expect(this.player1).toBeAbleToSelect(this.greaterUnderstanding);
            });

            it('should not be able to be discarded when attachment removal references attached to a character', function() {
                this.player1.clickCard(this.greaterUnderstanding);
                this.player1.clickRing('fire');
                this.player2.pass();

                this.player1.clickCard(this.fineKatana);
                this.player1.clickCard(this.togashiYokuni);

                this.player2.clickCard(this.karadaDistrict);
                expect(this.player2).toHavePrompt('Choose an attachment');
                expect(this.player2).not.toBeAbleToSelect(this.greaterUnderstanding);
            });

            it('should not be able to be discarded by Bayushi Collector', function() {
                this.togashiYokuni.dishonor();

                this.player1.clickCard(this.greaterUnderstanding);
                this.player1.clickRing('fire');
                this.player2.pass();

                this.player1.clickCard(this.fineKatana);
                this.player1.clickCard(this.togashiYokuni);

                this.player2.clickCard(this.bayushiSCollector);
                expect(this.player2).toHavePrompt('Choose an attachment');
                expect(this.player2).toBeAbleToSelect(this.fineKatana);
                expect(this.player2).not.toBeAbleToSelect(this.greaterUnderstanding);
            });

            it('should allow you to trigger Greater Understanding when fate is placed upon the attached ring outside the fate phase', function() {
                this.player1.clickCard(this.greaterUnderstanding);
                this.player1.clickRing('fire');

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.togashiYokuni],
                    defenders: [],
                    ring: 'fire',
                    type: 'military'
                });

                this.player2.pass();
                this.player1.clickCard(this.masterAlchemist);
                this.player1.clickPrompt('Pay costs first');
                this.player1.clickRing('fire');
                expect(this.player1).toBeAbleToSelect(this.greaterUnderstanding);
            });
        });
    });
});
