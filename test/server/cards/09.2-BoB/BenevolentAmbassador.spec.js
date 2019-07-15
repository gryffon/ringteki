describe('Benevolent Ambassador', function () {
    integration(function () {
        describe('Benevolent Ambassador\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['benevolent-ambassador'],
                        honor: 8
                    },
                    player2: {
                        inPlay: ['yogo-hiroue', 'shrine-maiden'],
                        hand: ['fine-katana'],
                        honor: 12
                    }
                });

                this.ambassador = this.player1.findCardByName('benevolent-ambassador');
                this.yogoHiroue = this.player2.findCardByName('yogo-hiroue');
                this.noMoreActions();
            });

            it('should trigger if the ambassador wins the conflict', function() {
                this.initiateConflict({
                    attackers: [this.ambassador],
                    defenders: ['shrine-maiden']
                }),

                this.noMoreActions();
                expect(this.player1).toBeAbleToSelect(this.ambassador);
            });

            it('should give both players one honor', function() {
                this.initiateConflict({
                    attackers: [this.ambassador],
                    defenders: ['shrine-maiden']
                }),
                this.noMoreActions();
                let player1Honor = this.player1.honor;
                let opponentHonor = this.player2.honor;
                this.player1.clickCard(this.ambassador);
                expect(this.player1.honor).toBe(player1Honor + 1);
                expect(this.player2.honor).toBe(opponentHonor + 1);
            });
        });
    });
});
