describe('Moto Outrider', function() {
    integration(function() {
        describe('Moto Outrider\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['moto-outrider'],
                        hand: ['retreat']
                    },
                    player2: {
                        inPlay: ['doji-whisperer'],
                        hand: ['mirumoto-s-fury']
                    }
                });
                this.moto = this.player1.findCardByName('moto-outrider');
                this.retreat = this.player1.findCardByName('retreat');
                this.whisperer = this.player2.findCardByName('doji-whisperer');
                this.fury = this.player2.findCardByName('mirumoto-s-fury');
                this.noMoreActions();
            });

            it('should ready in a mil conflict', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.moto],
                    defenders: [this.whisperer]
                });
                this.player2.clickCard(this.fury);
                this.player2.clickCard(this.moto);
                expect(this.moto.bowed).toBe(true);
                this.player1.clickCard(this.moto);
                expect(this.moto.bowed).toBe(false);
            });

            it('should not ready in a pol conflict', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.moto],
                    defenders: [this.whisperer]
                });
                this.player2.clickCard(this.fury);
                this.player2.clickCard(this.moto);
                expect(this.moto.bowed).toBe(true);
                this.player1.clickCard(this.moto);
                expect(this.moto.bowed).toBe(true);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });


            it('should not work if not participating', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.moto],
                    defenders: [this.whisperer]
                });
                this.player2.clickCard(this.fury);
                this.player2.clickCard(this.moto);
                expect(this.moto.bowed).toBe(true);
                expect(this.game.currentConflict.attackers).toContain(this.moto);
                this.player1.clickCard(this.retreat);
                this.player1.clickCard(this.moto);
                expect(this.game.currentConflict.attackers).not.toContain(this.moto);
                this.player2.pass();
                this.player1.clickCard(this.moto);
                expect(this.moto.bowed).toBe(true);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });
        });
    });
});
