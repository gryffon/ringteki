describe('Licensed Quarter', function() {
    integration(function() {
        describe('Licensed Quarter\'s ability', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['borderlands-defender'],
                        dynastyDeck: ['licensed-quarter']
                    },
                    player2: {
                        inPlay: ['bayushi-aramoro', 'shrine-maiden'],
                        hand: ['fiery-madness', 'i-can-swim']
                    }
                });
                this.borderlandsDefender = this.player1.findCardByName('borderlands-defender');
                this.licensedQuarter = this.player1.placeCardInProvince('licensed-quarter', 'province 1');

                this.bayushiAramoro = this.player2.findCardByName('bayushi-aramoro');
                this.shrineMaiden = this.player2.findCardByName('shrine-maiden');
                this.fieryMadness = this.player2.findCardByName('fiery-madness');

                this.player2.moveCard(this.fieryMadness, 'conflict deck');
            });

            it('should be able to discard the top card if the controller of Licensed Quarter wins a conflict', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.borderlandsDefender],
                    defenders: [this.shrineMaiden]
                });

                this.player2.pass();
                this.player1.pass();

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.licensedQuarter);

                this.player1.clickCard(this.licensedQuarter);
                expect(this.fieryMadness.location).toBe('conflict discard pile');
                expect(this.getChatLogs(6)).toContain('player1 uses Licensed Quarter to discard the top card of player2\'s conflict deck');
            });

            it('should not be able to discard the top card if the controller of Licensed Quarter loses a conflict', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.borderlandsDefender],
                    defenders: [this.bayushiAramoro]
                });

                this.player2.pass();
                this.player1.pass();

                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).not.toBeAbleToSelect(this.licensedQuarter);
            });
        });
    });
});

