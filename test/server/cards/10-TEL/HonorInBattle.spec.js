describe('Honor in Battle', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['matsu-seventh-legion', 'akodo-kage'],
                    hand: ['honor-in-battle']
                },
                player2: {
                    inPlay: ['mirumoto-raitsugu']
                }
            });

            this.matsuSeventhLegion = this.player1.findCardByName('matsu-seventh-legion');
            this.akodoKage = this.player1.findCardByName('akodo-kage');
            this.honorInBattle = this.player1.findCardByName('honor-in-battle');

            this.mirumotoRaitsugu = this.player2.findCardByName('mirumoto-raitsugu');
        });

        it('should not be able the trigger if you don\'t have a ring claimed', function() {
            this.player1.clickCard(this.honorInBattle);
            expect(this.player1).toHavePrompt('Action Window');
        });

        it('should not be able the trigger if you have a political ring claimed', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.akodoKage],
                defenders: [this.mirumotoRaitsugu]
            });

            this.noMoreActions();
            this.player1.clickPrompt('Don\'t Resolve');

            this.player1.clickCard(this.honorInBattle);
            expect(this.player1).toHavePrompt('Action Window');
        });

        it('should allow you to honor one of your characters if you have a military ring claimed', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.matsuSeventhLegion],
                defenders: [this.mirumotoRaitsugu]
            });

            this.noMoreActions();
            this.player1.clickPrompt('No');
            this.player1.clickPrompt('Don\'t Resolve');

            this.player1.clickCard(this.honorInBattle);
            this.player1.clickCard(this.matsuSeventhLegion);
            expect(this.matsuSeventhLegion.isHonored).toBe(true);
        });

        it('should allow you to honor one of the opponent\'s characters if you have a military ring claimed', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.matsuSeventhLegion],
                defenders: [this.mirumotoRaitsugu]
            });

            this.noMoreActions();
            this.player1.clickPrompt('No');
            this.player1.clickPrompt('Don\'t Resolve');

            this.player1.clickCard(this.honorInBattle);
            this.player1.clickCard(this.mirumotoRaitsugu);
            expect(this.mirumotoRaitsugu.isHonored).toBe(true);
        });
    });
});
