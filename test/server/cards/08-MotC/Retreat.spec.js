describe('Retreat', function() {
    integration(function() {
        describe('Retreat\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['matsu-mitsuko'],
                        hand: ['retreat']
                    },
                    player2: {
                        inPlay: ['moto-nergui']
                    }
                });

                this.matsuMitsuko = this.player1.findCardByName('matsu-mitsuko');
                this.retreat = this.player1.findCardByName('retreat');

                this.motoNergui = this.player2.findCardByName('moto-nergui');
            });

            it('should not work if you have no characters in the conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.matsuMitsuko],
                    defenders: [this.motoNergui]
                });
                this.player2.clickCard(this.motoNergui);
                this.player2.clickCard(this.matsuMitsuko);
                this.player1.clickCard(this.retreat);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not work during political conflicts', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.matsuMitsuko],
                    defenders: [this.motoNergui]
                });
                this.player2.pass();
                this.player1.clickCard(this.retreat);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should send the chosen character home', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.matsuMitsuko],
                    defenders: [this.motoNergui]
                });
                this.player2.pass();
                this.player1.clickCard(this.retreat);
                expect(this.player1).toHavePrompt('Choose a character');
                expect(this.player1).toBeAbleToSelect(this.matsuMitsuko);
                expect(this.player1).not.toBeAbleToSelect(this.motoNergui);
                this.player1.clickCard(this.matsuMitsuko);
                expect(this.matsuMitsuko.inConflict).toBe(false);
            });
        });
    });
});

