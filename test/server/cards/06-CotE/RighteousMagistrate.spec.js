describe('Righteous magistrate', function() {
    integration(function() {
        describe('Righteous magistrate\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 11,
                        inPlay: ['shinjo-outrider', 'shiba-tsukune'],
                        hand: ['assassination', 'fine-katana']
                    },
                    player2: {
                        honor: 9,
                        inPlay: ['righteous-magistrate', 'shrine-maiden'],
                        hand: ['assassination', 'noble-sacrifice', 'watch-commander']
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

            it('players should lose or gain honor when honored/dishonored characters leaving play', function() {
                this.shrineMaiden.honor();
                this.shibaTsukune.dishonor();
                this.player2.clickCard('noble-sacrifice');
                this.player2.clickPrompt('Pay Costs First');
                this.player2.clickCard(this.shrineMaiden);
                this.player2.clickCard(this.shibaTsukune);
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
        });
    });
});
