describe('Daidoji Harrier', function() {
    integration(function() {
        describe('Daidoji Harrier\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['golden-plains-raider'],
                        dynastyDiscard: ['favorable-ground', 'border-rider']
                    },
                    player2: {
                        inPlay: ['doji-whisperer'],
                        dynastyDiscard: ['imperial-storehouse', 'young-warrior', 'aranat']
                    }
                });

                this.raider = this.player1.findCardByName('golden-plains-raider');
                this.favorable = this.player1.findCardByName('favorable-ground');
                this.rider = this.player1.findCardByName('border-rider');

                this.whisperer = this.player2.findCardByName('doji-whisperer');

                this.storehouse = this.player2.findCardByName('imperial-storehouse');
                this.warrior = this.player2.findCardByName('young-warrior');
                this.aranat = this.player2.findCardByName('aranat');

                this.player1.placeCardInProvince(this.favorable, 'province 1');
                this.player1.placeCardInProvince(this.rider, 'province 2');
                this.player2.placeCardInProvince(this.storehouse, 'province 1');
                this.player2.placeCardInProvince(this.warrior, 'province 2');
                this.player2.placeCardInProvince(this.aranat, 'province 3');
                this.favorable.facedown = false;
                this.rider.facedown = false;
                this.storehouse.facedown = false;
                this.warrior.facedown = false;
                this.aranat.facedown = true;
            });

            it('should prompt after you win a conflict on attack', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.raider],
                    defenders: []
                });
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.raider);
            });

            it('should not prompt after you win a conflict on defense', function() {
                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.whisperer],
                    defenders: [this.raider]
                });
                this.noMoreActions();
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
            });

            it('should prompt you to discard a faceup card in an opponents province', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.raider],
                    defenders: []
                });
                this.noMoreActions();
                this.player1.clickCard(this.raider);
                expect(this.player1).not.toBeAbleToSelect(this.favorable);
                expect(this.player1).not.toBeAbleToSelect(this.rider);
                expect(this.player1).toBeAbleToSelect(this.storehouse);
                expect(this.player1).toBeAbleToSelect(this.warrior);
                expect(this.player1).not.toBeAbleToSelect(this.aranat);

                this.player1.clickCard(this.warrior);
                expect(this.warrior.location).toBe('dynasty discard pile');
            });
        });
    });
});
