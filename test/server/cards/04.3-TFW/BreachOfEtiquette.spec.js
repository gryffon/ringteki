describe('Breach of Etiquette', function() {
    integration(function() {
        describe('Breach of Etiquette\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 10,
                        inPlay: ['yogo-hiroue', 'soshi-illusionist', 'bayushi-yunako'],
                        hand: ['watch-commander']
                    },
                    player2: {
                        honor: 11,
                        inPlay: ['brash-samurai', 'doji-whisperer'],
                        hand: ['breach-of-etiquette', 'banzai']
                    }
                });
                this.brashSamurai = this.player2.findCardByName('brash-samurai');
                this.dojiWhisperer = this.player2.findCardByName('doji-whisperer');
                this.soshiIllusionist = this.player1.findCardByName('soshi-illusionist');
                this.yogoHiroue = this.player1.findCardByName('yogo-hiroue');
                this.watchCommander = this.player1.playAttachment('watch-commander', 'yogo-hiroue');
                this.banzai = this.player2.findCardByName('banzai', 'hand');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: ['yogo-hiroue', 'bayushi-yunako'],
                    defenders: ['brash-samurai']
                });
                this.player2.clickCard('breach-of-etiquette');
                this.player1.pass();
            });

            it('should trigger when the opponent uses a non-courtier ability', function() {
                this.player1.clickCard('bayushi-yunako');
                this.player1.clickCard(this.brashSamurai);
                expect(this.player1.honor).toBe(9);
                expect(this.brashSamurai.militarySkill).toBe(1);
            });

            it('should not trigger when an opponent cancels a non-courtier ability', function() {
                this.player1.clickCard('bayushi-yunako');
                this.player1.clickPrompt('Cancel');
                expect(this.player1.honor).toBe(10);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should trigger when the player uses a non-courtier ability', function() {
                this.player1.pass();
                this.player2.clickCard(this.brashSamurai);
                expect(this.player2.honor).toBe(10);
                expect(this.brashSamurai.militarySkill).toBe(4);
            });

            it('should not trigger when a courtier uses an ability', function() {
                this.player1.clickCard(this.yogoHiroue);
                this.player1.clickCard(this.dojiWhisperer);
                expect(this.player1.honor).toBe(10);
                expect(this.dojiWhisperer.inConflict).toBe(true);
            });

            it('should trigger when a non-courtier outside the conflict uses an ability', function() {
                this.player1.pass();
                this.player2.clickCard(this.brashSamurai);
                this.player1.clickCard(this.soshiIllusionist);
                this.player1.clickCard(this.brashSamurai);
                expect(this.player1.honor).toBe(9);
                expect(this.brashSamurai.militarySkill).toBe(2);
            });

            it('should not trigger when an event is played', function () {
                this.player1.pass();
                let honorBefore = this.player2.honor;
                this.player2.clickCard(this.banzai);
                this.player2.clickCard(this.brashSamurai);
                this.player2.clickPrompt('Done');
                expect(this.player2.honor).toBe(honorBefore);
            });

            it('should have no effect after the conflict ends', function () {
                this.player1.pass();
                this.player2.clickCard(this.brashSamurai);
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Break Shameful Display');
                this.player1.clickPrompt('No');
                this.player1.clickPrompt('Don\'t Resolve');
                let honorBefore = this.player1.honor;
                this.player1.clickCard(this.soshiIllusionist);
                this.player1.clickCard(this.brashSamurai);
                expect(this.player1.honor).toBe(honorBefore);
            });
        });
    });
});
