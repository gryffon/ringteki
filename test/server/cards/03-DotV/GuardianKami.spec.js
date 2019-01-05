describe('Guardian Kami', function() {
    integration(function() {
        describe('Guardian Kami\'s triggered abililty', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-whisperer']
                    },
                    player2: {
                        inPlay: ['guardian-kami', 'guardian-kami']
                    }
                });

                this.dojiWhisperer = this.player1.findCardByName('doji-whisperer');

                this.guardianKami = this.player2.filterCardsByName('guardian-kami')[0];
                this.guardianKami2 = this.player2.filterCardsByName('guardian-kami')[1];

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.dojiWhisperer],
                    defenders: [this.guardianKami, this.guardianKami2],
                    ring: 'fire'
                });
            });

            it('should be triggerable when defending', function() {
                this.player2.clickCard(this.guardianKami);
                expect(this.player2).toHavePrompt('Fire Ring');
            });

            it('should sacrifice itself', function() {
                this.player2.clickCard(this.guardianKami);
                expect(this.guardianKami.location).toBe('conflict discard pile');
            });

            it('should allow you to resolve the contested ring', function() {
                this.player2.clickCard(this.guardianKami);
                expect(this.player2).toHavePrompt('Fire Ring');
                expect(this.player2).toBeAbleToSelect(this.dojiWhisperer);
                expect(this.player2).toBeAbleToSelect(this.guardianKami2);
                this.player2.clickCard(this.dojiWhisperer);
                this.player2.clickPrompt('Dishonor Doji Whisperer');
                expect(this.dojiWhisperer.isDishonored).toBe(true);
            });

            it('should be max 1 per conflict', function() {
                this.player2.clickCard(this.guardianKami);
                this.player2.clickCard(this.dojiWhisperer);
                this.player2.clickPrompt('Dishonor Doji Whisperer');
                this.player1.pass();
                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.player2.clickCard(this.guardianKami2);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });
        });
    });
});
