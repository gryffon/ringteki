describe('Doji Hotaru 2', function () {
    integration(function () {
        describe('Doji Hotaru 2\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-hotaru-2'],
                        hand: ['way-of-the-crane', 'against-the-waves'],
                        honor: 10
                    },
                    player2: {
                        inPlay: ['solemn-scholar'],
                        hand: ['clarity-of-purpose', 'supernatural-storm']
                    }
                });

                this.dojiHotaru = this.player1.findCardByName('doji-hotaru-2');
                this.against = this.player1.findCardByName('against-the-waves');
                this.wotc = this.player1.findCardByName('way-of-the-crane');

                this.storm = this.player2.findCardByName('supernatural-storm');
                this.clarity = this.player2.findCardByName('clarity-of-purpose');
                this.solemn = this.player2.findCardByName('solemn-scholar');

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.dojiHotaru],
                    defenders: [this.solemn]
                });
            });

            it('should trigger when an opponent plays a card (unlimited)', function() {
                this.player2.clickCard(this.clarity);
                this.player2.clickCard(this.solemn);

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.dojiHotaru);

                this.player1.clickCard(this.dojiHotaru);
                expect(this.player1.honor).toBe(11);

                this.player1.pass();

                this.player2.clickCard(this.storm);
                this.player2.clickCard(this.solemn);

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.dojiHotaru);

                this.player1.clickCard(this.dojiHotaru);
                expect(this.player1.honor).toBe(12);
            });

            it('should not trigger when the player plays a card', function() {
                this.player2.pass();

                this.player1.clickCard(this.wotc);
                this.player1.clickCard(this.dojiHotaru);

                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).not.toBeAbleToSelect(this.dojiHotaru);
            });
        });
        describe('Doji Hotaru doesn\'t like Kuwanan', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'dynasty',
                    fate: 15,
                    player1: {
                        inPlay: ['doji-hotaru-2'],
                        dynastyDeck: ['doji-kuwanan']
                    }
                });

                this.dojiHotaruV2 = this.player1.findCardByName('doji-hotaru-2');
                this.kuwanan = this.player1.placeCardInProvince('doji-kuwanan', 'province 1');
            });

            it('and Kuwanan doesn\'t like Hotaru so they kill each other if they are both in play.', function() {
                this.player1.clickCard(this.kuwanan);
                this.player1.clickPrompt('0');

                expect(this.kuwanan.location).toBe('dynasty discard pile');
                expect(this.dojiHotaruV2.location).toBe('dynasty discard pile');
            });
        });
    });
});
