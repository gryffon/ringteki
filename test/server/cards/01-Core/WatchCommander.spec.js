describe('Watch Commander', function () {
    integration(function () {
        describe('Watch Commander\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['wandering-ronin'],
                        hand: ['watch-commander', 'watch-commander']
                    },
                    player2: {
                        inPlay: ['adept-of-the-waves'],
                        hand: ['let-go', 'banzai']
                    }
                });
                this.wanderingRonin = this.player1.findCardByName('wandering-ronin');
                this.watchCommander = this.player1.filterCardsByName('watch-commander')[0];
                this.watchCommander2 = this.player1.filterCardsByName('watch-commander')[1];

                this.adeptOfTheWaves = this.player2.findCardByName('adept-of-the-waves');
                this.letGo = this.player2.findCardByName('let-go');
                this.banzai = this.player2.findCardByName('banzai');
            });

            // This test list is incomplete; you can help by expanding it.

            it('should attach to a character you control', function () {
                this.player1.clickCard(this.watchCommander);
                expect(this.player1).toHavePrompt('Watch Commander');
                expect(this.player1).toBeAbleToSelect(this.wanderingRonin);
                expect(this.player1).not.toBeAbleToSelect(this.adeptOfTheWaves);
                this.player1.clickCard(this.wanderingRonin);
                expect(this.wanderingRonin.attachments.toArray()).toContain(this.watchCommander);
            });

            it('should deatch if a second Watch Commander is attached to a character you control', function () {
                this.player1.clickCard(this.watchCommander);
                this.player1.clickCard(this.wanderingRonin);
                this.player2.pass();
                this.player1.clickCard(this.watchCommander2);
                this.player1.clickCard(this.wanderingRonin);
                expect(this.wanderingRonin.attachments.toArray()).toContain(this.watchCommander2);
                expect(this.player1.conflictDiscard).toContain(this.watchCommander);

            });

            it('should trigger when your opponent plays a card when attached character is participating', function () {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.wanderingRonin],
                    defenders: [this.adeptOfTheWaves]
                });
                this.player2.pass();
                this.player1.clickCard(this.watchCommander);
                this.player1.clickCard(this.wanderingRonin);
                expect(this.wanderingRonin.attachments.toArray()).toContain(this.watchCommander);
                this.player2.clickCard(this.banzai);
                this.player2.clickCard(this.adeptOfTheWaves);
                this.player2.clickPrompt('Done');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.watchCommander);
            });

            it('should make you opponent lose 1 honor', function () {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.wanderingRonin],
                    defenders: [this.adeptOfTheWaves]
                });
                this.player2.pass();
                this.player1.clickCard(this.watchCommander);
                this.player1.clickCard(this.wanderingRonin);
                expect(this.wanderingRonin.attachments.toArray()).toContain(this.watchCommander);
                let honor = this.player2.player.honor;
                this.player2.clickCard(this.banzai);
                this.player2.clickCard(this.adeptOfTheWaves);
                this.player2.clickPrompt('Done');
                this.player1.clickCard(this.watchCommander);
                expect(this.player2.player.honor).toBe(honor - 1);
            });

            it('should not trigger before let go places it in the discard pile', function () {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.wanderingRonin],
                    defenders: [this.adeptOfTheWaves]
                });
                this.player2.pass();
                this.player1.clickCard(this.watchCommander);
                this.player1.clickCard(this.wanderingRonin);
                expect(this.wanderingRonin.attachments.toArray()).toContain(this.watchCommander);
                this.player2.clickCard(this.letGo);
                this.player2.clickCard(this.watchCommander);
                expect(this.watchCommander.location).toBe('conflict discard pile');
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

        });
    });
});
