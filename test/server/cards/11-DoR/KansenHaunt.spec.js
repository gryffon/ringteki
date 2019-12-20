describe('Kansen Haunt', function() {
    integration(function() {
        describe('Kansen Haunt\'s Reaction', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-kuwanan'],
                        honor: 20
                    },
                    player2: {
                        inPlay: ['hida-kisada'],
                        dynastyDiscard: ['kansen-haunt', 'kansen-haunt'],
                        honor: 10
                    }
                });

                this.kuwanan = this.player1.findCardByName('doji-kuwanan');
                this.kisada = this.player2.findCardByName('hida-kisada');

                this.haunt = this.player2.filterCardsByName('kansen-haunt')[0];
                this.haunt2 = this.player2.filterCardsByName('kansen-haunt')[1];

                this.player2.placeCardInProvince(this.haunt, 'province 2');
                this.player2.placeCardInProvince(this.haunt2, 'province 3');

                this.p1 = this.player2.findCardByName('shameful-display', 'province 1');
                this.p2 = this.player2.findCardByName('shameful-display', 'province 2');
                this.p3 = this.player2.findCardByName('shameful-display', 'province 3');
                this.p4 = this.player2.findCardByName('shameful-display', 'province 4');

                this.player1p1 = this.player1.findCardByName('shameful-display', 'province 1');
            });

            it('should give negative strength to the province', function () {
                expect(this.p1.getStrength()).toBe(3);
                expect(this.p2.getStrength()).toBe(1);
                expect(this.p3.getStrength()).toBe(1);
                expect(this.p4.getStrength()).toBe(3);
            });

            it('should trigger if you claim a ring on defense', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    ring: 'air',
                    attackers: [this.kuwanan],
                    defenders: [this.kisada],
                    province: this.p1
                });

                this.player2.pass();
                this.player1.pass();

                let honor = this.player2.honor;
                expect(this.player2).toBeAbleToSelect(this.haunt);
                this.player2.clickCard(this.haunt);
                expect(this.player2.honor).toBe(honor - 2);
                expect(this.player2).toHavePrompt('Air Ring');
                this.player2.clickPrompt('Gain 2 honor');
                expect(this.player2.honor).toBe(honor);
            });

            it('should be able to use multiple in the same conflict', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.kuwanan],
                    defenders: [this.kisada],
                    province: this.p2
                });

                this.player2.pass();
                this.player1.pass();

                let honor = this.player2.honor;
                expect(this.player2).toBeAbleToSelect(this.haunt);
                this.player2.clickCard(this.haunt);
                expect(this.player2.honor).toBe(honor - 2);
                expect(this.player2).toHavePrompt('Air Ring');
                this.player2.clickPrompt('Gain 2 honor');
                expect(this.player2.honor).toBe(honor);

                expect(this.player2).toBeAbleToSelect(this.haunt2);
                this.player2.clickCard(this.haunt2);
                expect(this.player2.honor).toBe(honor - 2);
                expect(this.player2).toHavePrompt('Air Ring');
                this.player2.clickPrompt('Gain 2 honor');
                expect(this.player2.honor).toBe(honor);
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

                let honor = this.player2.honor;
                expect(this.player2).not.toBeAbleToSelect(this.haunt);
                this.player2.clickCard(this.haunt);
                expect(this.player2.honor).toBe(honor);
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

                let honor = this.player2.honor;
                expect(this.player2).not.toBeAbleToSelect(this.haunt);
                this.player2.clickCard(this.haunt);
                expect(this.player2.honor).toBe(honor);
            });

            it('should not trigger if you are more honorable than opponent', function () {
                this.player1.player.honor = 5;
                this.player2.player.honor = 11;

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    ring: 'air',
                    attackers: [this.kuwanan],
                    defenders: [this.kisada],
                    province: this.p1
                });

                this.player2.pass();
                this.player1.pass();

                let honor = this.player2.honor;
                expect(this.player2).not.toBeAbleToSelect(this.haunt);
                this.player2.clickCard(this.haunt);
                expect(this.player2.honor).toBe(honor);
            });

            it('should not trigger if you are equally honorable to your opponent', function () {
                this.player1.player.honor = 11;
                this.player2.player.honor = 11;

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    ring: 'air',
                    attackers: [this.kuwanan],
                    defenders: [this.kisada],
                    province: this.p1
                });

                this.player2.pass();
                this.player1.pass();

                let honor = this.player2.honor;
                expect(this.player2).not.toBeAbleToSelect(this.haunt);
                this.player2.clickCard(this.haunt);
                expect(this.player2.honor).toBe(honor);
            });
        });
    });
});

