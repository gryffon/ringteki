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
                        inPlay: ['doji-whisperer','brash-samurai', 'moto-youth'],
                        hand: ['noble-sacrifice']
                    }
                });
                this.aramoro = this.player1.findCardByName('bayushi-aramoro');
                this.soshi = this.player1.findCardByName('sinister-soshi');

                this.whisperer = this.player2.findCardByName('doji-whisperer');
                this.brash = this.player2.findCardByName('brash-samurai');
                this.motoYouth = this.player2.findCardByName('moto-youth');
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

            it('should kill moto youth if his skill is at 2 or lower', function() {
                this.motoYouth.dishonor();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.aramoro],
                    defenders: [this.motoYouth]
                });

                this.player2.pass();
                expect(this.motoYouth.getMilitarySkill()).toBe(2);
                this.player1.clickCard(this.aramoro);
                this.player1.clickCard(this.motoYouth);
                expect(this.motoYouth.location).toBe('dynasty discard pile');
                expect(this.aramoro.isDishonored).toBe(true);
            });

            it('should not kill moto youth at the end of the conflict', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.aramoro],
                    defenders: [this.motoYouth]
                });

                this.player2.pass();
                this.player1.clickCard(this.aramoro);
                this.player1.clickCard(this.motoYouth);
                expect(this.motoYouth.getMilitarySkill()).toBe(1);
                expect(this.motoYouth.location).toBe('play area');
                expect(this.aramoro.isDishonored).toBe(true);
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Air Ring');
                expect(this.motoYouth.location).toBe('play area');
                this.player1.clickPrompt('Gain 2 Honor');
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.motoYouth.location).toBe('play area');
            });
        });
    });
});
