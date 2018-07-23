describe('Bustling Academy', function() {
    integration(function() {
        describe('Bustling Academy\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['naive-student','bustling-academy','kanjo-district']
                    },
                    player2: {
                        inPlay: ['shiotome-encampment','moto-youth','moto-juro','shinjo-scout'],
                        hand: ['noble-sacrifice']
                    }
                });

                this.ba = this.player1.placeCardInProvince('bustling-academy','province 1');
                this.kd = this.player1.placeCardInProvince('kanjo-district','province 2');
                this.naive = this.player1.findCardByName('naive-student');

                this.shio = this.player2.placeCardInProvince('shiotome-encampment','province 1');
                this.youth = this.player2.placeCardInProvince('moto-youth','province 2');
                this.juro = this.player2.findCardByName('moto-juro');
                this.scout = this.player2.findCardByName('shinjo-scout');
            });

            it('should correctly target cards in provinces', function() {
                this.player1.clickCard(this.ba);
                expect(this.player1).toHavePrompt('Choose a card');
                expect(this.player1).toBeAbleToSelect(this.ba);
                expect(this.player1).toBeAbleToSelect(this.kd);
                expect(this.player1).toBeAbleToSelect(this.shio);
                expect(this.player1).toBeAbleToSelect(this.youth);
            });

            it('should correctly discard the targeted card', function() {
                this.player1.clickCard(this.ba);
                this.player1.clickCard(this.shio);
                expect(this.shio.location).toBe('dynasty discard pile');
            });

            it('should correctly refill the province faceup', function() {
                this.player2.moveCard('shinjo-scout', 'dynasty deck');
                this.player1.clickCard(this.ba);
                this.player1.clickCard(this.shio);
                expect(this.shio.location).toBe('dynasty discard pile');
                expect(this.scout.location).toBe('province 1');
            });

            it('should correctly discard itself', function() {
                this.player1.clickCard(this.ba);
                this.player1.clickCard(this.ba);
                expect(this.ba.location).toBe('dynasty discard pile');
            });

            it('should not work if a scholar is not in play', function() {
                this.naive.dishonor();
                this.juro.honor();
                this.player1.pass();
                this.player2.clickCard('noble-sacrifice');
                expect(this.player2).toBeAbleToSelect(this.naive);
                this.player2.clickCard(this.naive);
                expect(this.player2).toBeAbleToSelect(this.juro);
                this.player2.clickCard(this.juro);
                expect(this.naive.location).toBe('dynasty discard pile');
                this.player1.clickCard(this.ba);
                expect(this.player1).not.toHavePrompt('Choose a card');
            });
        });
    });
});
