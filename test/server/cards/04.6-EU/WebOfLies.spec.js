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
                        inPlay: ['bayushi-kachiko'],
                        hand: ['policy-debate'],
                        provinces: ['web-of-lies']
                    }
                });
                this.borderlandsDefender = this.player1.findCardByName('borderlands-defender');

                this.webOfLies = this.player2.findCardByName('web-of-lies');
                this.bayushiKachiko = this.player2.findCardByName('bayushi-kachiko');
                this.player2.showBid = 3;

                this.noMoreActions();
            });

            it('province strength should be 6', function() {
                this.webOfLies.facedown = false;
                this.game.checkGameState(true);
                expect(this.webOfLies.getStrength()).toBe(6);
            });

            it('provice should update if the players bid changes', function() {

            });
        });
    });
});
