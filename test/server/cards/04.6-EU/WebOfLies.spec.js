describe('Web of Lies', function() {
    integration(function() {
        describe('Web of Lies\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['borderlands-defender']
                    },
                    player2: {
                        inPlay: [],
                        hand: ['maze-of-illusion'],
                        provinces: ['web-of-lies']
                    }
                });
                this.borderlandsDefender = this.player1.findCardByName('borderlands-defender');

                this.webOfLies = this.player2.findCardByName('web-of-lies');
                this.player2.showBid = 3;

                this.noMoreActions();
            });

            it('province strength should be 6', function() {
                this.webOfLies.facedown = false;
                this.game.checkGameState(true);
                expect(this.webOfLies.getStrength()).toBe(6);
            });

            it('provice should update if the players bid changes', function() {
                this.initiateConflict({
                    type: 'military',
                    province: 'web-of-lies',
                    attackers: [this.borderlandsDefender],
                    defenders: []
                });
                this.player2.clickCard('maze-of-illusion');
                this.player2.clickCard(this.borderlandsDefender);
                this.player2.clickPrompt('1');
                this.player1.clickPrompt('Odd');
                expect(this.matsuBerserker.isDishonored).toBe(false);
                expect(this.matsuBerserker.bowed).toBe(false);
                expect(this.webOfLies.getStrength()).toBe(2);
            });
        });
    });
});
