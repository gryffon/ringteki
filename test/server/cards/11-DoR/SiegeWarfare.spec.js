describe('Siege Warfare', function() {
    integration(function() {
        describe('Siege Warfare Ability', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-kuwanan'],
                        hand: ['siege-warfare'],
                        dynastyDiscard: ['imperial-storehouse']
                    },
                    player2: {
                        hand: ['siege-warfare'],
                        dynastyDiscard: ['imperial-storehouse']
                    }
                });

                this.kuwanan = this.player1.findCardByName('doji-kuwanan');
                this.siegeWarfare = this.player1.findCardByName('siege-warfare');
                this.p2siege = this.player2.findCardByName('siege-warfare');
                this.storehouse = this.player1.placeCardInProvince('imperial-storehouse', 'province 3');
                this.player2.placeCardInProvince('imperial-storehouse', 'province 3');

                this.p1 = this.player2.findCardByName('shameful-display', 'province 1');

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.kuwanan],
                    defenders: [],
                    province: this.p1
                });
            });

            it('should reduce the strength of the attacked province by 2', function () {
                let strength = this.p1.getStrength();
                this.player2.pass();
                this.player1.clickCard(this.siegeWarfare);
                expect(this.p1.getStrength()).toBe(strength - 2);
                expect(this.getChatLogs(3)).toContain('player1 plays Siege Warfare to reduce the province strength of Shameful Display by 2');
            });

            it('should not reduce the strength of the attacked province below 0', function () {
                let strength = this.p1.getStrength();
                this.player2.pass();
                this.player1.clickCard(this.siegeWarfare);
                expect(this.p1.getStrength()).toBe(strength - 2);
                this.player1.moveCard(this.siegeWarfare, 'hand');
                this.player2.pass();
                this.player1.clickCard(this.siegeWarfare);
                expect(this.p1.getStrength()).toBe(0);
            });

            it('should not be playable if the province strength is already 0', function () {
                let strength = this.p1.getStrength();
                this.player2.pass();
                this.player1.clickCard(this.siegeWarfare);
                expect(this.p1.getStrength()).toBe(strength - 2);
                this.player1.moveCard(this.siegeWarfare, 'hand');
                this.player2.pass();
                this.player1.clickCard(this.siegeWarfare);
                expect(this.p1.getStrength()).toBe(0);
                this.player1.moveCard(this.siegeWarfare, 'hand');
                this.player2.pass();
                this.player1.clickCard(this.siegeWarfare);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not be playable on defense', function () {
                let strength = this.p1.getStrength();
                this.player2.clickCard(this.p2siege);
                expect(this.p1.getStrength()).toBe(strength);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should not be playable without a holding', function () {
                let strength = this.p1.getStrength();
                this.player1.moveCard(this.storehouse, 'dynasty discard pile');
                this.player2.pass();
                this.player1.clickCard(this.siegeWarfare);
                expect(this.p1.getStrength()).toBe(strength);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });
        });
    });
});
