describe('Curved Blade', function() {
    integration(function() {
        describe('Curved Blade\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shinjo-outrider', 'border-rider'],
                        hand: ['curved-blade']
                    },
                    player2: {
                        inPlay: ['matsu-berserker', 'venerable-historian']
                    }
                });

                this.outrider = this.player1.findCardByName('shinjo-outrider');
                this.borderRider = this.player1.findCardByName('border-rider');
                this.blade = this.player1.findCardByName('curved-blade');

                this.matsu = this.player2.findCardByName('matsu-berserker');
                this.historian = this.player2.findCardByName('venerable-historian');
            });

            it('should only attach to Unicorn characters', function() {
                this.player1.clickCard(this.blade);
                expect(this.player1).not.toBeAbleToSelect(this.historian);
                expect(this.player1).not.toBeAbleToSelect(this.matsu);
                expect(this.player1).toBeAbleToSelect(this.outrider);
                expect(this.player1).toBeAbleToSelect(this.borderRider);
            });

            it('should not work on defense', function() {
                this.player1.clickCard(this.blade);
                this.player1.clickCard(this.borderRider);
                this.riderMil = this.borderRider.getMilitarySkill();
                this.noMoreActions();
                this.player1.clickPrompt('Pass Conflict');
                this.player1.clickPrompt('Yes');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.matsu],
                    defenders: [this.borderRider]
                });
                expect(this.borderRider.getMilitarySkill()).toBe(this.riderMil);
            });

            it('should work on offense', function() {
                this.player1.clickCard(this.blade);
                this.player1.clickCard(this.borderRider);
                this.riderMil = this.borderRider.getMilitarySkill();
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.borderRider]
                });
                expect(this.borderRider.getMilitarySkill()).toBe(this.riderMil + 2);
            });
        });
    });
});
