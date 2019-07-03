describe('Command Respect\'s', function() {
    integration(function() {
        describe('ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['matsu-berserker'],
                        hand: ['command-respect'],
                        honor: 18
                    },
                    player2: {
                        inPlay: ['serene-warrior'],
                        hand: ['banzai', 'fine-katana'],
                        honor: 10
                    }
                });

                this.berserker = this.player1.findCardByName('matsu-berserker');
                this.commandRespect = this.player1.findCardByName('command-respect');

                this.serene = this.player2.findCardByName('serene-warrior');
                this.banzai = this.player2.findCardByName('banzai');
                this.katana = this.player2.findCardByName('fine-katana');

                this.noMoreActions();
            });

            it('should cause the opponent to lose honor when playing events', function() {
                this.opponentHonor = this.player2.honor;
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.berserker],
                    defenders: [this.serene]
                });
                this.player2.pass();
                this.player1.clickCard(this.commandRespect);
                this.player2.clickCard(this.banzai);
                this.player2.clickCard(this.serene);
                this.player2.clickPrompt('Done');
                expect(this.player2.honor).toBe(this.opponentHonor - 1);
            });

            it('should not cause the opponent to lose honor for attachments', function() {
                this.opponentHonor = this.player2.honor;
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.berserker],
                    defenders: [this.serene]
                });
                this.player2.pass();
                this.player1.clickCard(this.commandRespect);
                this.player2.clickCard(this.katana);
                this.player2.clickCard(this.serene);
                expect(this.player2.honor).toBe(this.opponentHonor);
            });
        });
    });
});
