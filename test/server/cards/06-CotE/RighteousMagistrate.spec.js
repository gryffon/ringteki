describe('Righteous magistrate', function() {
    integration(function() {
        describe('Righteous magistrate\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 11,
                        inPlay: ['shinjo-outrider', 'shiba-tsukune'],
                        hand: ['assassination', 'fine-katana', 'game-of-sadane']
                    },
                    player2: {
                        honor: 9,
                        inPlay: ['righteous-magistrate', 'shrine-maiden'],
                        hand: ['assassination', 'noble-sacrifice', 'watch-commander', 'smuggling-deal']
                    }
                });
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    ring: 'air',
                    attackers: ['shinjo-outrider', 'shiba-tsukune'],
                    defenders: ['righteous-magistrate', 'shrine-maiden']
                });
                this.player1.player.optionSettings.orderForcedAbilities = true;
                this.righteousMagistrate = this.player2.findCardByName('righteous-magistrate');
                this.shrineMaiden = this.player2.findCardByName('shrine-maiden');
                this.shibaTsukune = this.player1.findCardByName('shiba-tsukune');
            });

            it('players shouldn\'t being able to play assassination or smuggling deal', function() {
                this.player2.clickCard('assassination');
                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.player2.clickCard('smuggling-deal');
                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.player2.pass();
                expect(this.player1.honor).toBe(11);
                expect(this.player2.honor).toBe(9);
            });

            it('players shouldn\'t lose or gain honor when honored/dishonored characters leaving play', function() {
                this.shrineMaiden.honor();
                this.shibaTsukune.dishonor();
                this.player2.clickCard('noble-sacrifice');
                this.player2.clickPrompt('Pay Costs First');
                this.player2.clickCard(this.shrineMaiden);
                this.player2.clickCard(this.shibaTsukune);
                expect(this.shrineMaiden.location).toBe('conflict discard pile');
                expect(this.shibaTsukune.location).toBe('dynasty discard pile');
                expect(this.player1.honor).toBe(11);
                expect(this.player2.honor).toBe(9);
            });

            it('watch commander shouldn\'t cause you players to lose honor', function() {
                this.player2.playAttachment('watch-commander', 'righteous-magistrate');
                this.player1.playAttachment('fine-katana', 'shiba-tsukune');
                this.player2.pass();
                expect(this.player1.honor).toBe(11);
                expect(this.player2.honor).toBe(9);
            });

            it('should stop players from lossing honor during duels', function() {
                this.player2.pass();
                this.player1.clickCard('game-of-sadane');
                this.player1.clickCard(this.shibaTsukune);
                this.player1.clickCard(this.shrineMaiden);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('5');
                expect(this.player1.honor).toBe(11);
                expect(this.player2.honor).toBe(9);
            });
        });
    });
});
