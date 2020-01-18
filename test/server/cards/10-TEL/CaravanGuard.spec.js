describe('Caravan Guard', function() {
    integration(function() {
        describe('Caravan Guard\'s ability', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['caravan-guard', 'caravan-guard', 'doomed-shugenja'],
                        hand: ['against-the-waves']
                    },
                    player2: {
                    }
                });

                this.caravanGuard1 = this.player1.inPlay[0];
                this.caravanGuard2 = this.player1.inPlay[1];
                this.againstTheWaves = this.player1.findCardByName('against-the-waves');
                this.doomedShugenja = this.player1.findCardByName('doomed-shugenja');
            });

            it('should skip conflict if the player cannot pay for any attackers', function () {
                this.player1.fate = 1;
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.againstTheWaves);
                this.player1.clickCard(this.doomedShugenja);
                expect(this.doomedShugenja.bowed).toBe(true);
                this.noMoreActions();

                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should not let a player declare Caravan Guard when they have no fate', function () {
                this.player1.fate = 0;
                this.noMoreActions();

                expect(this.player1).toHavePrompt('Initiate Conflict');
                this.player1.clickCard(this.doomedShugenja);
                expect(this.doomedShugenja.inConflict).toBe(true);
                this.player1.clickCard(this.caravanGuard1);
                expect(this.caravanGuard1.inConflict).toBe(false);
                this.player1.clickCard(this.caravanGuard2);
                expect(this.caravanGuard2.inConflict).toBe(false);
            });

            it('should not allow a player to declare 2 Caravan Guards with only 1 fate', function () {
                this.player1.fate = 1;
                this.noMoreActions();

                expect(this.player1).toHavePrompt('Initiate Conflict');
                this.player1.clickCard(this.doomedShugenja);
                expect(this.doomedShugenja.inConflict).toBe(true);
                this.player1.clickCard(this.caravanGuard1);
                expect(this.caravanGuard1.inConflict).toBe(true);
                this.player1.clickCard(this.caravanGuard2);
                expect(this.caravanGuard2.inConflict).toBe(false);
            });

            it('should deduct fate correctly when Caravan Guard is declared as an attacker', function() {
                this.player1.fate = 7;
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.caravanGuard1, this.caravanGuard2, this.doomedShugenja]
                });

                expect(this.player2).toHavePrompt('Choose Defenders');
                expect(this.player1.fate).toBe(5);
            });
        });
    });
});
