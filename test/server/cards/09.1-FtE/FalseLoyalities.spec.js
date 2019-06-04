describe('False Loyalites', function() {
    integration(function() {
        describe('False Loyalites\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['matsu-berserker','shinjo-shono'],
                        honor: 10
                    },
                    player2: {
                        inPlay: ['venerable-historian'],
                        hand: ['false-loyalties'],
                        honor: 8
                    }
                });

                this.berserker = this.player1.findCardByName('matsu-berserker');
                this.shono = this.player1.findCardByName('shinjo-shono');

                this.historian = this.player2.findCardByName('venerable-historian');

                this.noMoreActions();
            });

            it('should trigger after a opponent wins a conflict', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.shono],
                    defenders: []
                });
                this.noMoreActions();
                expect(this.player2).toHavePrompt('Any Reactions');
                expect(this.player2).toBeAbleToSelect('false-loyalities');
            });
        });
    });
});
