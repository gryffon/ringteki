describe('Hall of Victories', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['matsu-berserker'],
                    dynastyDiscard: ['hall-of-victories'],
                    honor: 10
                },
                player2: {
                    inPlay: ['agasha-swordsmith'],
                    honor: 10
                }
            });
            this.hallOfVictories = this.player1.placeCardInProvince('hall-of-victories', 'province 3');

            this.matsuBerserker = this.player1.findCardByName('matsu-berserker');

            this.agashaSwordsmith = this.player2.findCardByName('agasha-swordsmith');
        });

        it('should give the winner of the conflict an honor regardless of player, multiple times per round', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.matsuBerserker],
                defenders: [],
                type: 'military'
            });

            this.noMoreActions();
            expect(this.getChatLogs(5)).toContain('player1 uses Hall of Victories to make player1 gain 1 honor');
            this.player1.clickPrompt('No');
            this.player1.clickPrompt('Don\'t Resolve');
            expect(this.player1.honor).toBe(11);

            this.noMoreActions();
            this.initiateConflict({
                ring: 'water',
                attackers: [this.agashaSwordsmith],
                defenders: []
            });

            this.noMoreActions();
            expect(this.getChatLogs(5)).toContain('player1 uses Hall of Victories to make player2 gain 1 honor');
            this.player2.clickPrompt('Don\'t Resolve');
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.player2.honor).toBe(10);
        });
    });
});
