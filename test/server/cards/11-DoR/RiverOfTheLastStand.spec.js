describe('River of the Last Stand', function() {
    integration(function() {
        describe('River of the Last Stand\'s Action', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-kuwanan'],
                        hand: ['assassination', 'duty'],
                        dynastyDiscard: ['northern-curtain-wall']
                    },
                    player2: {
                        inPlay: ['hida-kisada'],
                        dynastyDiscard: ['river-of-the-last-stand', 'northern-curtain-wall', 'imperial-storehouse']
                    }
                });

                this.kuwanan = this.player1.findCardByName('doji-kuwanan');
                this.kisada = this.player2.findCardByName('hida-kisada');
                this.river = this.player2.placeCardInProvince('river-of-the-last-stand', 'province 1');
                this.wall = this.player2.placeCardInProvince('northern-curtain-wall', 'province 2');
                this.storehouse = this.player2.placeCardInProvince('imperial-storehouse', 'province 3');

                this.player1Wall = this.player1.placeCardInProvince('northern-curtain-wall', 'province 1');
                this.assassination = this.player1.findCardByName('assassination');
                this.duty = this.player1.findCardByName('duty');

                this.p1 = this.player2.findCardByName('shameful-display', 'province 1');
                this.p2 = this.player2.findCardByName('shameful-display', 'province 2');
                this.p3 = this.player2.findCardByName('shameful-display', 'province 3');
                this.p4 = this.player2.findCardByName('shameful-display', 'province 4');

                this.player1p1 = this.player1.findCardByName('shameful-display', 'province 1');
            });

            it('should make your opponent discard two cards & draw a card during a conflict at itself', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.kuwanan],
                    defenders: [this.kisada],
                    province: this.p1
                });

                let hand = this.player1.hand.length;
                expect(hand).toBe(2);
                this.player2.clickCard(this.river);
                expect(this.player1.hand.length).toBe(1);
                expect(this.assassination.location).toBe('conflict discard pile');
                expect(this.duty.location).toBe('conflict discard pile');
            });

            it('should work during a conflict at another kaiu wall', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.kuwanan],
                    defenders: [this.kisada],
                    province: this.p2
                });

                let hand = this.player1.hand.length;
                expect(hand).toBe(2);
                this.player2.clickCard(this.river);
                expect(this.player1.hand.length).toBe(1);
                expect(this.assassination.location).toBe('conflict discard pile');
                expect(this.duty.location).toBe('conflict discard pile');
            });

            it('should not work during a conflict not at a kaiu wall', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.kuwanan],
                    defenders: [this.kisada],
                    province: this.p3
                });

                let hand = this.player1.hand.length;
                expect(hand).toBe(2);
                this.player2.clickCard(this.river);
                expect(this.player1.hand.length).toBe(2);
            });

            it('should not work during a conflict not at a holding', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.kuwanan],
                    defenders: [this.kisada],
                    province: this.p4
                });

                let hand = this.player1.hand.length;
                expect(hand).toBe(2);
                this.player2.clickCard(this.river);
                expect(this.player1.hand.length).toBe(2);
            });

            it('should not work on attack', function () {
                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.kisada],
                    defenders: [this.kuwanan]
                });

                this.player1.pass();
                let hand = this.player1.hand.length;
                expect(hand).toBe(2);
                this.player2.clickCard(this.river);
                expect(this.player1.hand.length).toBe(2);
            });
        });
    });
});
