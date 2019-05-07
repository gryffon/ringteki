describe('Akodo Makoto', function() {
    integration(function() {
        describe('Akodo Makoto\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['akodo-makoto']
                    },
                    player2: {
                        inPlay: ['meddling-mediator', 'shrine-maiden', 'naive-student']
                    }
                });

                this.makoto = this.player1.findCardByName('akodo-makoto');
                this.mediator = this.player2.findCardByName('meddling-mediator');
                this.shrineMaiden = this.player2.findCardByName('shrine-maiden');
                this.naiveStudent = this.player2.findCardByName('naive-student');

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.makoto],
                    defenders: [this.mediator, this.shrineMaiden]
                });
            });

            it('should discard the courtier if it does have any fate', function() {
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.clickCard(this.makoto);
                expect(this.player1).toHavePrompt('Akodo Makoto');
                expect(this.player1).toBeAbleToSelect(this.mediator);
                this.player1.clickCard(this.mediator);
                expect(this.mediator.location).toBe('dynasty discard pile');
            });

            it('should remove a fate if the character has any', function() {
                this.mediator.fate = 1;
                this.noMoreActions();
                this.player1.clickCard(this.makoto);
                this.player1.clickCard(this.mediator);
                expect(this.mediator.fate).toBe(0);
                expect(this.mediator.location).toBe('play area');
            });

            it('should work only on courtiers', function() {
                this.noMoreActions();
                this.player1.clickCard(this.makoto);
                expect(this.player1).not.toBeAbleToSelect(this.shrineMaiden);
            });

            it('should not let you select coutiers that were not in the conflict', function() {
                this.noMoreActions();
                this.player1.clickCard(this.makoto);
                expect(this.player1).not.toBeAbleToSelect(this.naiveStudent);
            });
        });
    });
});

