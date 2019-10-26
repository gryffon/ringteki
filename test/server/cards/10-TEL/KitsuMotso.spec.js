describe('Kitsu Motso', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['kitsu-motso'],
                    hand: ['assassination']
                },
                player2: {
                    inPlay: ['mirumoto-raitsugu', 'agasha-swordsmith'],
                    hand: ['assassination']
                }
            });

            this.kitsuMotso = this.player1.findCardByName('kitsu-motso');
            this.assassination = this.player1.findCardByName('assassination');

            this.mirumotoRaitsugu = this.player2.findCardByName('mirumoto-raitsugu');
            this.agashaSwordsmith = this.player2.findCardByName('agasha-swordsmith');
        });

        it('should not allow you to pull someone in when you have the same amount or more cards', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.kitsuMotso],
                defenders: []
            });

            this.player2.pass();
            this.player1.clickCard(this.kitsuMotso);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });

        it('should allow you to pull someone in when you have less cards', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.kitsuMotso],
                defenders: []
            });

            this.player2.pass();
            this.player1.clickCard(this.assassination);
            this.player1.clickCard(this.agashaSwordsmith);

            this.player2.pass();
            this.player1.clickCard(this.kitsuMotso);
            expect(this.agashaSwordsmith.location).toBe('dynasty discard pile');
            expect(this.player1).toHavePrompt('Choose a character');
            this.player1.clickCard(this.mirumotoRaitsugu);
            expect(this.mirumotoRaitsugu.isParticipating()).toBe(true);
        });

        it('should allow you to pull someone in when you have less cards on defense as well', function() {
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.agashaSwordsmith],
                defenders: [this.kitsuMotso]
            });

            this.player1.clickCard(this.assassination);
            this.player1.clickCard(this.agashaSwordsmith);

            this.player2.pass();
            this.player1.clickCard(this.kitsuMotso);
            expect(this.agashaSwordsmith.location).toBe('dynasty discard pile');
            expect(this.player1).toHavePrompt('Choose a character');
            this.player1.clickCard(this.mirumotoRaitsugu);
            expect(this.mirumotoRaitsugu.isParticipating()).toBe(true);
        });
    });
});
