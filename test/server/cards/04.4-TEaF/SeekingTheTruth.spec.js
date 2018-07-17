describe('Seeking The Truth', function() {
    integration(function() {
        describe('Seeking The Truth\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['matsu-berserker'],
                        hand: ['fine-katana']
                    },
                    player2: {
                        inPlay: ['eager-scout'],
                        provinces: ['seeking-the-truth']
                    }
                });

                this.scout = this.player2.findCardByName('eager-scout');

                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['matsu-berserker'],
                    defenders: ['eager-scout'],
                    jumpTo: 'afterConflict'
                });
            });

            it('should trigger when it is broken', function() {
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect('seeking-the-truth');
            });

            it('should correctly target the defending character', function() {
                this.player2.clickCard('seeking-the-truth');
                expect(this.player2).toBeAbleToSelect('eager-scout');
            });

            it('should correctly send the defending character home', function() {
                this.player2.clickCard('seeking-the-truth');
                this.player2.clickCard('eager-scout');
                expect(this.scout.inConflict).toBe(false);
                expect(this.scout.bowed).toBe(false);
            });

        });
    });
});
