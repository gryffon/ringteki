describe('Blackmail Artist', function () {
    integration(function () {
        describe('Blackmail Artist\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['blackmail-artist', 'bayushi-liar']
                    },
                    player2: {
                        inPlay: ['yogo-hiroue']
                    }
                });

                this.blackmailArtist = this.player1.findCardByName('blackmail-artist');
                this.bayushiLiar = this.player1.findCardByName('bayushi-liar');
                this.yogoHiroue = this.player2.findCardByName('yogo-hiroue');
                this.noMoreActions();
            });

            it('should take one honor from the opponent when winning a political conflict', function () {
                let honorPlayer1 = this.player1.player.honor;
                let honorPlayer2 = this.player2.player.honor;
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.blackmailArtist, this.bayushiLiar],
                    defenders: [this.yogoHiroue]
                });
                this.player2.pass();
                this.player1.pass();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.blackmailArtist);
                this.player1.clickCard(this.blackmailArtist);
                expect(this.player1.player.honor).toBe(honorPlayer1 + 1);
                expect(this.player2.player.honor).toBe(honorPlayer2 - 1);
            });

            it('can\'t trigger in military conflicts', function () {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.blackmailArtist],
                    defenders: []
                });
                this.player2.pass();
                this.player1.pass();
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
            });

            it('can\'t trigger at home', function () {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.bayushiLiar],
                    defenders: []
                });
                this.player2.pass();
                this.player1.pass();
                expect(this.player1).not.toHavePrompt('Triggered Abilites');
            });

            it('can\'t trigger after losing the conflict', function () {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.blackmailArtist],
                    defenders: [this.yogoHiroue]
                });
                this.player2.pass();
                this.player1.pass();
                expect(this.player1).not.toHavePrompt('Triggered Abilites');
            });
        });
    });
});
