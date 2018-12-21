describe('Sanpuku Seido', function() {
    integration(function() {
        describe('Sanpuku Seido\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-hotaru']
                    },
                    player2: {
                        provinces: ['sanpuku-seido'],
                        inPlay: ['serene-warrior']
                    }
                });
                this.dojiHotaru = this.player1.findCardByName('doji-hotaru');

                this.sanpukuSeido = this.player2.findCardByName('sanpuku-seido');
                this.sereneWarrior = this.player2.findCardByName('serene-warrior');

                this.noMoreActions();
            });

            it('should resolve conflicts using glory instead of skill', function() {
                this.initiateConflict({
                    attackers: [this.dojiHotaru],
                    defenders: [this.sereneWarrior],
                    ring: 'air',
                    type: 'political',
                    province: this.sanpukuSeido
                });
                this.noMoreActions();
                expect(this.player2.claimedRings.includes('air')).toBe(true);
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.flow.getChatLog()).toBe('player2 won a political conflict 4 vs 3');
            });
        });

        describe('during setup', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'setup',
                    player1: {
                        provinces: ['sanpuku-seido']
                    },
                    skipAutoSetup: true
                });
                this.sanpukuSeido = this.player1.findCardByName('sanpuku-seido');

                this.selectFirstPlayer(this.player1);
            });

            it('cannot be stronghold province', function() {
                expect(this.player1).toHavePrompt('Select stronghold province');
                this.player1.clickCard(this.sanpukuSeido);
                expect(this.player1).toHavePrompt('Select stronghold province');
            });
        });
    });
});
