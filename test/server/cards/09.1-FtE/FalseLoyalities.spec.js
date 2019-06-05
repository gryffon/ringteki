describe('False Loyalites', function() {
    integration(function() {
        describe('False Loyalites\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['matsu-berserker','shinjo-shono', 'shrine-maiden'],
                        honor: 10
                    },
                    player2: {
                        inPlay: ['venerable-historian', 'solemn-scholar'],
                        hand: ['false-loyalties'],
                        honor: 8
                    }
                });

                this.berserker = this.player1.findCardByName('matsu-berserker');
                this.shono = this.player1.findCardByName('shinjo-shono');
                this.maiden = this.player1.findCardByName('shrine-maiden');

                this.historian = this.player2.findCardByName('venerable-historian');
                this.scholar = this.player2.findCardByName('solemn-scholar');

                this.noMoreActions();
            });

            it('should trigger after a opponent wins a conflict', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.shono],
                    defenders: []
                });
                this.noMoreActions();
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect('false-loyalties');
            });

            it('should let you switch the character in the conflicts', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.shono],
                    defenders: []
                });
                this.noMoreActions();
                this.player2.clickCard('false-loyalties');
                this.player2.clickCard(this.shono);
                expect(this.player2).toBeAbleToSelect(this.maiden);
                this.player2.clickCard(this.maiden);
                expect(this.shono.inConflict).toBe(false);
                expect(this.maiden.inConflict).toBe(true);
            });

            it('should not let you move in dash characters', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.shono],
                    defenders: []
                });
                this.noMoreActions();
                this.player2.clickCard('false-loyalties');
                this.player2.clickCard(this.shono);
                expect(this.player2).not.toBeAbleToSelect(this.berserker);
            });

            it('should only work for opponents characters', function () {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.shono],
                    defenders: [this.historian]
                });
                this.noMoreActions();
                this.player2.clickCard('false-loyalties');
                expect(this.player2).toBeAbleToSelect(this.shono);
                expect(this.player2).not.toBeAbleToSelect(this.historian);
            });
        });
    });
});
