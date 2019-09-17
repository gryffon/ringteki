describe('Sharpened Tsuruhashi', function() {
    integration(function() {
        describe('Sharpened Tsuruhashi\'s ability', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['vanguard-warrior', 'eager-scout'],
                        hand: ['sharpened-tsuruhashi', 'assassination']
                    }
                });

                this.vanguardWarrior = this.player1.findCardByName('vanguard-warrior');
                this.eagerScout = this.player1.findCardByName('eager-scout');
                this.sharpenedTsuruhashi = this.player1.playAttachment('sharpened-tsuruhashi', this.vanguardWarrior);
                this.assassination = this.player1.findCardByName('assassination');

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.vanguardWarrior, this.eagerScout],
                    defenders: []
                });
            });

            it('should be able to return to your hand if you sacrifice something', function () {
                this.player2.pass();

                this.player1.clickCard(this.vanguardWarrior);
                this.player1.clickCard(this.eagerScout);

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.sharpenedTsuruhashi);

                this.player1.clickCard(this.sharpenedTsuruhashi);
                expect(this.sharpenedTsuruhashi.location).toBe('hand');
            });
        });
    });
});

