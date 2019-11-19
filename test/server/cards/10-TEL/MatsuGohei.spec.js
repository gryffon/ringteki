describe('Matsu Gohei', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['matsu-gohei', 'brash-samurai', 'shrine-maiden', 'serene-warrior']
                },
                player2: {
                    inPlay: ['mirumoto-raitsugu'],
                    hand: ['assassination']
                }
            });

            this.gohei = this.player1.findCardByName('matsu-gohei');
            this.brash = this.player1.findCardByName('brash-samurai');
            this.maiden = this.player1.findCardByName('shrine-maiden');
            this.serene = this.player1.findCardByName('serene-warrior');

            this.mirumotoRaitsugu = this.player2.findCardByName('mirumoto-raitsugu');

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.gohei, this.brash, this.maiden, this.serene],
                defenders: [this.mirumotoRaitsugu]
            });
        });

        it('should not bow as a result of conflict resolution if player has two other bushi attacking', function() {
            this.noMoreActions();
            this.player1.clickPrompt('Yes');
            this.player1.clickPrompt('Don\'t resolve');
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.gohei.bowed).toBe(false);
        });

        it('should bow if their are less than two other bushis attacking', function() {
            this.player2.clickCard('assassination');
            this.player2.clickCard(this.brash);
            this.noMoreActions();
            this.player1.clickPrompt('Yes');
            this.player1.clickPrompt('Don\'t resolve');
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.gohei.bowed).toBe(true);
        });

        it('should bow if defending with gohei', function() {
            this.noMoreActions();
            this.player1.clickPrompt('Yes');
            this.player1.clickPrompt('Don\'t resolve');
            this.serene.ready();
            this.brash.ready();
            this.mirumotoRaitsugu.ready();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.mirumotoRaitsugu],
                ring: 'fire',
                defenders: [this.gohei, this.serene, this.brash]
            });
            this.noMoreActions();
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.gohei.bowed).toBe(true);
        });
    });
});
