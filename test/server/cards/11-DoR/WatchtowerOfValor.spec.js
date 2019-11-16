describe('Watchtower of Valor', function() {
    integration(function() {
        describe('Watchtower of Valor\'s Reaction', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-kuwanan'],
                        dynastyDiscard: ['northern-curtain-wall']
                    },
                    player2: {
                        inPlay: ['hida-kisada'],
                        dynastyDiscard: ['watchtower-of-valor', 'northern-curtain-wall', 'imperial-storehouse'],
                        hand: ['captive-audience']
                    }
                });

                this.kuwanan = this.player1.findCardByName('doji-kuwanan');
                this.kisada = this.player2.findCardByName('hida-kisada');
                this.watchtower = this.player2.placeCardInProvince('watchtower-of-valor', 'province 1');
                this.wall = this.player2.placeCardInProvince('northern-curtain-wall', 'province 2');
                this.storehouse = this.player2.placeCardInProvince('imperial-storehouse', 'province 3');
                this.captive = this.player2.findCardByName('captive-audience');

                this.player1Wall = this.player1.placeCardInProvince('northern-curtain-wall', 'province 1');

                this.p1 = this.player2.findCardByName('shameful-display', 'province 1');
                this.p2 = this.player2.findCardByName('shameful-display', 'province 2');
                this.p3 = this.player2.findCardByName('shameful-display', 'province 3');
                this.p4 = this.player2.findCardByName('shameful-display', 'province 4');

                this.player1p1 = this.player1.findCardByName('shameful-display', 'province 1');
            });

            it('should draw a card if you win on defense at itself', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.kuwanan],
                    defenders: [this.kisada],
                    province: this.p1
                });

                this.player2.pass();
                this.player1.pass();

                let hand = this.player2.hand.length;
                expect(this.player2).toBeAbleToSelect(this.watchtower);
                this.player2.clickCard(this.watchtower);
                expect(this.player2.hand.length).toBe(hand + 1);
            });

            it('should draw a card if you win on defense at another kaiu wall', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.kuwanan],
                    defenders: [this.kisada],
                    province: this.p2
                });

                this.player2.pass();
                this.player1.pass();

                let hand = this.player2.hand.length;
                expect(this.player2).toBeAbleToSelect(this.watchtower);
                this.player2.clickCard(this.watchtower);
                expect(this.player2.hand.length).toBe(hand + 1);
            });

            it('should not draw a card if you win on defense at a non-kaiu wall holding', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.kuwanan],
                    defenders: [this.kisada],
                    province: this.p3
                });

                this.player2.pass();
                this.player1.pass();

                let hand = this.player2.hand.length;
                expect(this.player2).not.toBeAbleToSelect(this.watchtower);
                this.player2.clickCard(this.watchtower);
                expect(this.player2.hand.length).toBe(hand);
            });

            it('should not draw a card if you win on defense at a non-holding', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.kuwanan],
                    defenders: [this.kisada],
                    province: this.p4
                });

                this.player2.pass();
                this.player1.pass();

                let hand = this.player2.hand.length;
                expect(this.player2).not.toBeAbleToSelect(this.watchtower);
                this.player2.clickCard(this.watchtower);
                expect(this.player2.hand.length).toBe(hand);
            });

            it('should not draw a card if you win on attack', function () {
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

                let hand = this.player2.hand.length;
                expect(this.player2).not.toBeAbleToSelect(this.watchtower);
                this.player2.clickCard(this.watchtower);
                expect(this.player2.hand.length).toBe(hand);
            });

            it('should not draw a card if you lose on defense', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.kuwanan],
                    defenders: [this.kisada],
                    province: this.p2
                });

                this.player2.pass();
                this.player1.pass();

                let hand = this.player2.hand.length;
                expect(this.player2).not.toBeAbleToSelect(this.watchtower);
                this.player2.clickCard(this.watchtower);
                expect(this.player2.hand.length).toBe(hand);
            });

            it('should be able to trigger more than once', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.kuwanan],
                    defenders: [this.kisada],
                    province: this.p1
                });

                this.player2.pass();
                this.player1.pass();

                let hand = this.player2.hand.length;
                expect(this.player2).toBeAbleToSelect(this.watchtower);
                this.player2.clickCard(this.watchtower);
                expect(this.player2.hand.length).toBe(hand + 1);

                this.kuwanan.bowed = false;
                this.kisada.bowed = false;

                this.noMoreActions();
                this.player2.passConflict();

                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.kuwanan],
                    defenders: [this.kisada],
                    province: this.p1,
                    ring: 'fire'
                });

                this.player2.clickCard(this.captive);
                this.player1.pass();
                this.player2.pass();

                hand = this.player2.hand.length;
                expect(this.player2).toBeAbleToSelect(this.watchtower);
                this.player2.clickCard(this.watchtower);
                expect(this.player2.hand.length).toBe(hand + 1);
            });
        });
    });
});

