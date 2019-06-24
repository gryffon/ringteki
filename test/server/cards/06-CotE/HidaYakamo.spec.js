describe('Hida Yakamo', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['hida-yakamo']
                },
                player2: {
                    inPlay: ['mirumoto-raitsugu','agasha-sumiko'],
                    hand: ['game-of-sadane']
                }
            });

            this.hidaYakamo = this.player1.findCardByName('hida-yakamo');

            this.mirumotoRaitsugu = this.player2.findCardByName('mirumoto-raitsugu');
            this.agashaSumiko = this.player2.findCardByName('agasha-sumiko');
            this.gameOfSadane = this.player2.findCardByName('game-of-sadane');

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.hidaYakamo],
                defenders: [this.mirumotoRaitsugu, this.agashaSumiko]
            });
        });

        it('should bow as a result of military conflict resolution when equally honorable as opponent', function() {
            this.player2.pass();
            expect(this.player1.player.honor).toBeGreaterThanOrEqual(this.player2.player.honor);
            expect(this.hidaYakamo.bowed).toBe(false);
            this.player1.pass();
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.hidaYakamo.bowed).toBe(true);
        });

        it('should be the loser of a duel when equally honorable as opponent', function() {
            this.player2.clickCard(this.mirumotoRaitsugu);
            this.player2.clickCard(this.hidaYakamo);
            this.player1.clickPrompt('1');
            this.player2.clickPrompt('5');
            expect(this.player1.player.honor).toBeGreaterThanOrEqual(this.player2.player.honor);
            expect(this.hidaYakamo.location).toBe('dynasty discard pile');
        });

        it('should not bow as a result of military conflict resolution when less honorable than opponent', function() {
            this.player2.clickCard(this.mirumotoRaitsugu);
            this.player2.clickCard(this.hidaYakamo);
            this.player1.clickPrompt('5');
            this.player2.clickPrompt('1');
            expect(this.player1.player.honor).toBeLessThan(this.player2.player.honor);
            expect(this.hidaYakamo.location).toBe('play area');
            this.player1.pass();
            this.player2.pass();
            this.player1.clickPrompt('Don\'t Resolve');
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.hidaYakamo.bowed).toBe(false);
        });

        it('should not be the loser of a duel when less honorable than opponent (winner should still be winner)', function() {
            this.player2.clickCard(this.gameOfSadane);
            this.player2.clickCard(this.agashaSumiko);
            this.player2.clickCard(this.hidaYakamo);
            this.player1.clickPrompt('2');
            this.player2.clickPrompt('1');
            expect(this.player1.player.honor).toBeLessThan(this.player2.player.honor);
            expect(this.hidaYakamo.isDishonored).toBe(false);
            expect(this.agashaSumiko.isHonored).toBe(true);
        });
    });
});
