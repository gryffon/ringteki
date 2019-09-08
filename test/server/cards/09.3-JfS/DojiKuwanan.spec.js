describe('Doji Kuwanan', function () {
    integration(function () {
        describe('Doji Kuwanan\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-kuwanan']
                    },
                    player2: {
                        inPlay: ['akodo-toturi', 'akodo-makoto', 'siege-captain', 'lion-s-pride-brawler']
                    }
                });

                this.kuwanan = this.player1.findCardByName('doji-kuwanan');

                this.toturi = this.player2.findCardByName('akodo-toturi');
                this.makoto = this.player2.findCardByName('akodo-makoto');
                this.siegeCaptain = this.player2.findCardByName('siege-captain');
                this.lionsPrideBrawler = this.player2.findCardByName('lion-s-pride-brawler');

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.kuwanan],
                    defenders: [this.makoto, this.toturi, this.siegeCaptain],
                    type: 'military'
                });
            });

            it('should allow you to bow characters with less military skill', function() {
                this.player2.pass();

                this.player1.clickCard(this.kuwanan);

                expect(this.player1).toBeAbleToSelect(this.makoto);
                this.player1.clickCard(this.makoto);
                expect(this.makoto.bowed).toBe(true);
            });

            it('should not allow you to bow participating characters with equal or more military skill', function() {
                this.player2.pass();

                this.player1.clickCard(this.kuwanan);

                expect(this.player1).not.toBeAbleToSelect(this.siegeCaptain);
                expect(this.player1).not.toBeAbleToSelect(this.toturi);
            });

            it('should not allow you to bow a non-participating character', function() {
                this.player2.pass();

                this.player1.clickCard(this.kuwanan);

                expect(this.player1).not.toBeAbleToSelect(this.lionsPrideBrawler);
            });
        });
        describe('Doji Kuwanan doesn\'t like Hotaru', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'dynasty',
                    fate: 15,
                    player1: {
                        inPlay: ['doji-kuwanan'],
                        dynastyDeck: ['doji-hotaru-2', 'doji-hotaru'],
                        hand: ['reprieve']
                    }
                });

                this.kuwanan = this.player1.findCardByName('doji-kuwanan');

                this.dojiHotaruV2 = this.player1.placeCardInProvince('doji-hotaru-2', 'province 1');
                this.dojiHotaru = this.player1.placeCardInProvince('doji-hotaru', 'province 2');
            });

            it('so he kills her if she enters play', function() {
                this.player1.clickCard(this.dojiHotaru);
                this.player1.clickPrompt('0');
                this.player2.pass();

                expect(this.dojiHotaru.location).toBe('dynasty discard pile');
            });

            it('so they both kill each other if Hotaru is also angry.', function() {
                this.player1.clickCard(this.dojiHotaruV2);
                this.player1.clickPrompt('0');
                this.player2.pass();

                expect(this.kuwanan.location).toBe('dynasty discard pile');
                expect(this.dojiHotaruV2.location).toBe('dynasty discard pile');
            });
        });
    });
});
