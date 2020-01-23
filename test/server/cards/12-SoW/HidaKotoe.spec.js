describe('Hida Kotoe', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-kuwanan'],
                    hand: ['fine-katana']
                },
                player2: {
                    inPlay: ['hida-kotoe', 'hida-kisada'],
                    hand: ['fine-katana']
                }
            });

            this.kotoe = this.player2.findCardByName('hida-kotoe');
            this.kisada = this.player2.findCardByName('hida-kisada');
            this.katana = this.player2.findCardByName('fine-katana');

            this.kuwanan = this.player1.findCardByName('doji-kuwanan');
            this.katana2 = this.player1.findCardByName('fine-katana');

            this.player1.playAttachment(this.katana2, this.kuwanan);
            this.player2.playAttachment(this.katana, this.kisada);
        });

        it('should allow discarding an attachment if you win on defense', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.kuwanan],
                defenders: [this.kotoe, this.kisada],
                type: 'military'
            });

            this.noMoreActions();
            expect(this.player2).toHavePrompt('Triggered Abilities');
            this.player2.clickCard(this.kotoe);
            expect(this.player2).toBeAbleToSelect(this.katana);
            expect(this.player2).toBeAbleToSelect(this.katana2);

            this.player2.clickCard(this.katana);
            expect(this.katana.location).toBe('conflict discard pile');
        });

        it('should not trigger if not participating', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.kuwanan],
                defenders: [this.kisada],
                type: 'military'
            });

            this.noMoreActions();
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
        });

        it('should not trigger if win not attacking', function() {
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.kisada, this.kotoe],
                defenders: [this.kuwanan],
                type: 'military'
            });

            this.noMoreActions();
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
        });
    });
});
