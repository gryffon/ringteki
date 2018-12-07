describe('Kami Unleashed', function() {
    integration(function() {
        describe('Kami Unleashed\'s triggered abililty', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['kami-unleashed', 'kami-unleashed']
                    },
                    player2: {
                        inPlay: ['doji-whisperer']
                    }
                });

                this.kamiUnleashed = this.player1.filterCardsByName('kami-unleashed')[0];
                this.kamiUnleashed2 = this.player1.filterCardsByName('kami-unleashed')[1];

                this.dojiWhisperer = this.player2.findCardByName('doji-whisperer');

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.kamiUnleashed, this.kamiUnleashed2],
                    defenders: [this.dojiWhisperer],
                    ring: 'fire'
                });
                this.player2.pass();
            });

            it('should be triggerable when attacking', function() {
                this.player1.clickCard(this.kamiUnleashed);
                expect(this.player1).toHavePrompt('Fire Ring');
            });

            it('should sacrifice itself', function() {
                this.player1.clickCard(this.kamiUnleashed);
                expect(this.kamiUnleashed.location).toBe('conflict discard pile');
            });

            it('should allow you to resolve the contested ring', function() {
                this.player1.clickCard(this.kamiUnleashed);
                expect(this.player1).toHavePrompt('Fire Ring');
                expect(this.player1).toBeAbleToSelect(this.dojiWhisperer);
                expect(this.player1).toBeAbleToSelect(this.kamiUnleashed2);
                this.player1.clickCard(this.dojiWhisperer);
                this.player1.clickPrompt('Dishonor Doji Whisperer');
                expect(this.dojiWhisperer.isDishonored).toBe(true);
            });

            it('should be max 1 per conflict', function() {
                this.player1.clickCard(this.kamiUnleashed);
                this.player1.clickCard(this.dojiWhisperer);
                this.player1.clickPrompt('Dishonor Doji Whisperer');
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.kamiUnleashed2);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });
        });
    });
});
