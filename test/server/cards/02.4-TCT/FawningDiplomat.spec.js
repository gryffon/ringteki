describe('Fawning Diplomat', function() {
    integration(function() {
        describe('Fawning Diplomat\'s ability', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['fawning-diplomat'],
                    }
                });
                this.fawningDiplomat = this.player1.findCardByName('fawning-diplomat');
            });

            it('should allow to claim the favor after she leaves play during the fate phase', function () {
                expect(this.player1.player.imperialFavor).toBe('');

                this.flow.finishConflictPhase();
                this.player1.clickPrompt('Done');

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.fawningDiplomat);

                this.player1.clickCard(this.fawningDiplomat);
                this.player1.clickPrompt('military');
                expect(this.player1.player.imperialFavor).toBe('military');
                expect(this.getChatLogs(10)).toContain('player1 claims the Emperor\'s military favor!')
            });
        });
    });
});

