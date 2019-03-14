describe('Shinomen Wayfinders', function() {
    integration(function() {
        describe('Shinomen Wayfinders\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 4,
                        inPlay: ['border-rider', 'kudaka', 'battle-maiden-recruit',
                            'shinjo-outrider', 'moto-youth', 'ide-messenger'],
                        hand: ['shinomen-wayfinders']
                    },
                    player2: {
                        fate: 11,
                        inPlay: ['iuchi-wayfinder'],
                        hand: ['infiltrator']
                    }
                });
                this.borderRider = this.player1.findCardByName('border-rider');
                this.shinomenWayfinders = this.player1.findCardByName('shinomen-wayfinders');
                this.player1.player.showBid = 4;
                this.player2.player.showBid = 5;
                this.noMoreActions();
            });

            it('should reduce the cost only for unicorn charaters participating', function () {
                this.initiateConflict({
                    attackers: [this.borderRider, 'kudaka', 'battle-maiden-recruit'],
                    defenders: ['iuchi-wayfinder']
                });
                this.player2.pass();
                this.player1.clickCard(this.shinomenWayfinders);
                this.player1.clickPrompt('1');
                this.player1.clickPrompt('Conflict');
                expect(this.player1.player.fate).toBe(1);
                expect(this.game.currentConflict.attackers).toContain(this.shinomenWayfinders);
            });

            it('should work for your opponent with infiltrator as well', function () {
                this.initiateConflict({
                    attackers: [this.borderRider, 'kudaka', 'battle-maiden-recruit'],
                    defenders: ['iuchi-wayfinder']
                });
                this.player2.playAttachment('infiltrator', 'iuchi-wayfinder');
                this.player1.moveCard(this.shinomenWayfinders, 'conflict deck');
                this.player1.pass();
                this.player2.clickCard('infiltrator');
                expect(this.player2).toHavePrompt('Choose an action for Shinomen Wayfinders');
                this.player2.clickPrompt('Play this card');
                this.player2.clickPrompt('1');
                this.player2.clickPrompt('Conflict');
                expect(this.player2.player.fate).toBe(6);
                expect(this.game.currentConflict.defenders).toContain(this.shinomenWayfinders);
            });

            it('should only reduce the cost to zero if the amount is greater than 4', function () {
                this.initiateConflict({
                    attackers: [this.borderRider, 'battle-maiden-recruit',
                        'shinjo-outrider', 'moto-youth', 'ide-messenger'],
                    defenders: ['iuchi-wayfinder']
                });
                this.player2.pass();
                this.player1.clickCard(this.shinomenWayfinders);
                this.player1.clickPrompt('0');
                this.player1.clickPrompt('Conflict');
                expect(this.player1.player.fate).toBe(4);
            });

        });
    });
});
