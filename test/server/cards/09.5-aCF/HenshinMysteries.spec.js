describe('Henshin Mysteries', function() {
    integration(function() {
        describe('Henshin Mysteries\' constant ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['agasha-swordsmith'],
                        hand: ['fine-katana', 'banzai']
                    },
                    player2: {
                        inPlay: ['shrine-maiden'],
                        provinces: ['henshin-mysteries'],
                        hand: ['fine-katana']
                    }
                });
                this.agashaSwordsmith = this.player1.findCardByName('agasha-swordsmith');
                this.banzai = this.player1.findCardByName('banzai');

                this.maiden = this.player2.findCardByName('shrine-maiden');
                this.henshinMysteries = this.player2.findCardByName('henshin-mysteries', 'province 1');

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.agashaSwordsmith],
                    defenders: [this.maiden],
                    province: this.henshinMysteries
                });
            });

            it('should stop the opponent from claiming the ring', function() {
                this.noMoreActions();
                this.player1.clickPrompt('Gain 2 Honor');
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.game.rings.air.claimed).toBe(false);
            });

            it('should also stop the controller from claiming the ring', function() {
                this.player2.playAttachment('fine-katana', this.maiden);
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.game.rings.air.claimed).toBe(false);
            });

            it('should not work if the province is broken', function() {
                this.player2.pass();
                this.player1.clickCard(this.banzai);
                this.player1.clickCard(this.agashaSwordsmith);
                this.player1.clickPrompt('Lose 1 honor to resolve this ability again');
                this.player1.clickCard(this.agashaSwordsmith);
                this.player1.clickPrompt('Done');
                this.player2.pass();
                this.player1.playAttachment('fine-katana', this.agashaSwordsmith);
                this.noMoreActions();
                this.player1.clickPrompt('No');
                this.player1.clickPrompt('Gain 2 Honor');
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.henshinMysteries.isBroken).toBe(true);
                expect(this.game.rings.air.claimed).toBe(true);
            });

            it('should not stop the ring effect', function() {
                let honor = this.player1.honor;
                this.noMoreActions();
                this.player1.clickPrompt('Gain 2 Honor');
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.player1.honor).toBe(honor + 2);
            });
        });
    });
});
