describe('Seventh Tower', function() {
    integration(function() {
        describe('Seventh Tower\'s Reaction', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-kuwanan'],
                        dynastyDiscard: ['northern-curtain-wall']
                    },
                    player2: {
                        inPlay: ['hida-kisada'],
                        dynastyDiscard: ['seventh-tower', 'northern-curtain-wall', 'imperial-storehouse']
                    }
                });

                this.kuwanan = this.player1.findCardByName('doji-kuwanan');
                this.kisada = this.player2.findCardByName('hida-kisada');
                this.tower = this.player2.placeCardInProvince('seventh-tower', 'province 1');
                this.wall = this.player2.placeCardInProvince('northern-curtain-wall', 'province 2');
                this.storehouse = this.player2.placeCardInProvince('imperial-storehouse', 'province 3');

                this.player1Wall = this.player1.placeCardInProvince('northern-curtain-wall', 'province 1');

                this.p1 = this.player2.findCardByName('shameful-display', 'province 1');
                this.p2 = this.player2.findCardByName('shameful-display', 'province 2');
                this.p3 = this.player2.findCardByName('shameful-display', 'province 3');
                this.p4 = this.player2.findCardByName('shameful-display', 'province 4');

                this.player1p1 = this.player1.findCardByName('shameful-display', 'province 1');
            });

            it('should trigger the ring if you win on defense at itself', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.kuwanan],
                    defenders: [this.kisada],
                    province: this.p1,
                    ring: 'fire'
                });

                this.player2.pass();
                this.player1.pass();

                expect(this.player2).toBeAbleToSelect(this.tower);
                this.player2.clickCard(this.tower);
                expect(this.player2).toHavePrompt('Fire Ring');
                this.player2.clickCard(this.kuwanan);
                this.player2.clickPrompt('Dishonor Doji Kuwanan');
                expect(this.kuwanan.isDishonored).toBe(true);
            });

            it('should trigger the ring if you win on defense at another kaiu wall', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.kuwanan],
                    defenders: [this.kisada],
                    province: this.p2,
                    ring: 'fire'
                });

                this.player2.pass();
                this.player1.pass();

                expect(this.player2).toBeAbleToSelect(this.tower);
                this.player2.clickCard(this.tower);
                expect(this.player2).toHavePrompt('Fire Ring');
                this.player2.clickCard(this.kuwanan);
                this.player2.clickPrompt('Dishonor Doji Kuwanan');
                expect(this.kuwanan.isDishonored).toBe(true);
            });

            it('should not trigger the ring if you win on defense at a non-kaiu wall holding', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.kuwanan],
                    defenders: [this.kisada],
                    province: this.p3,
                    ring: 'fire'
                });

                this.player2.pass();
                this.player1.pass();

                expect(this.player2).not.toBeAbleToSelect(this.tower);
            });

            it('should not resolve the ring if you win on defense at a non-holding', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.kuwanan],
                    defenders: [this.kisada],
                    province: this.p4,
                    ring: 'fire'
                });

                this.player2.pass();
                this.player1.pass();

                expect(this.player2).not.toBeAbleToSelect(this.tower);
            });

            it('should not trigger the ring if you win on attack', function () {
                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.kisada],
                    defenders: [this.kuwanan]
                });

                this.player1.pass();
                this.player2.pass();

                expect(this.player2).not.toBeAbleToSelect(this.tower);
            });

            it('should not trigger the ring if you lose on defense', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.kuwanan],
                    defenders: [this.kisada],
                    province: this.p2
                });

                this.player2.pass();
                this.player1.pass();

                expect(this.player2).not.toBeAbleToSelect(this.tower);
            });
        });
    });
});
