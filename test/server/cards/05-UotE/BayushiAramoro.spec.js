describe('Bayushi Aramoro', function() {
    integration(function() {
        describe('Bayushi Aramoro\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['bayushi-aramoro','sinister-soshi']
                    },
                    player2: {
                        inPlay: ['doji-whisperer','brash-samurai'],
                        hand: ['noble-sacrifice']
                    }
                });
                this.aramoro = this.player1.findCardByName('bayushi-aramoro');
                this.soshi = this.player1.findCardByName('sinister-soshi');

                this.whisperer = this.player2.findCardByName('doji-whisperer');
                this.brash = this.player2.findCardByName('brash-samurai');
                this.noMoreActions();
            });

            it('should correctly dishonor Aramoro', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.aramoro],
                    defenders: [this.brash]
                });
                this.player2.pass();
                this.player1.clickCard(this.aramoro);
                expect(this.player1).toHavePrompt('Bayushi Aramoro');
                this.player1.clickCard(this.brash);
                expect(this.aramoro.isDishonored).toBe(true);
            });

            it('should correctly discard targeted character if its skill reaches 0', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.aramoro],
                    defenders: [this.brash]
                });
                this.player2.pass();
                this.player1.clickCard(this.aramoro);
                expect(this.player1).toHavePrompt('Bayushi Aramoro');
                this.player1.clickCard(this.brash);
                expect(this.brash.location).toBe('dynasty discard pile');
            });

            it('should still work if Aramoro is discarded after its action fired', function() {
                this.whisperer.honor();
                this.brash.honor();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.aramoro],
                    defenders: [this.brash]
                });
                this.player2.pass();
                this.player1.clickCard(this.aramoro);
                this.player1.clickCard(this.brash);
                expect(this.brash.location).toBe('play area');
                this.player2.clickCard('noble-sacrifice');
                this.player2.clickCard(this.aramoro);
                this.player2.clickCard(this.whisperer);
                expect(this.aramoro.location).toBe('dynasty discard pile');
                this.player1.clickCard(this.soshi);
                this.player1.clickCard(this.brash);
                expect(this.brash.location).toBe('dynasty discard pile');
            });

            it('should not be able to trigger if Aramoro is already dishonored', function() {
                this.aramoro.dishonor();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.aramoro],
                    defenders: [this.brash]
                });
                this.player2.pass();
                this.player1.clickCard(this.aramoro);
                expect(this.player1).not.toHavePrompt('Bayushi Aramoro');
            });
        });
    });
});
