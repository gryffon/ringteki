describe('Shinomen Wayfinders', function() {
    integration(function() {
        describe('Shinomen Wayfinders\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 4,
                        inPlay: ['border-rider', 'kudaka', 'battle-maiden-recruit'],
                        hand: ['shinomen-wayfinders']
                    },
                    player2: {
                        honor: 11,
                        inPlay: ['iuchi-wayfinder'],
                        hand: ['infiltrator']
                    }
                });
                this.borderRider = this.player1.findCardByName('border-rider');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.borderRider, 'kudaka', 'battle-maiden-recruit'],
                    defenders: []
                });
                this.player2.pass();
            });

            it('should reduce the cost only for unicorn charaters participating', function () {
                this.player1.clickCard('shinomen-wayfinders');
                this.player1.clickPrompt('1');
                expect(this.player1.player.fate).toBe(1);
                expect(this.game.currentConflict.attackers).toContain(this.shinomenWayfinders);
            });

        });
    });
});
