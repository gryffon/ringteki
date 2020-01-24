describe('Perceptive Kitsuki', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['perceptive-kitsuki', 'doji-challenger']
                },
                player2: {
                    hand: ['way-of-the-scorpion', 'way-of-the-crane', 'mark-of-shame', 'fine-katana']
                }
            });

            this.kitsuki = this.player1.findCardByName('perceptive-kitsuki');
            this.challenger = this.player1.findCardByName('doji-challenger');

            this.scorpion2 = this.player2.findCardByName('way-of-the-scorpion');
            this.crane2 = this.player2.findCardByName('way-of-the-crane');
            this.shame2 = this.player2.findCardByName('mark-of-shame');
            this.katana2 = this.player2.findCardByName('fine-katana');
        });

        it('should allow returning a ring to look at your opponents hand', function() {
            this.player1.claimRing('earth');
            this.player1.claimRing('fire');

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.kitsuki],
                defenders: [],
                type: 'military'
            });

            this.player2.pass();
            this.player1.clickCard(this.kitsuki);
            expect(this.player1).toBeAbleToSelectRing('earth');
            expect(this.player1).toBeAbleToSelectRing('fire');
            this.player1.clickRing('earth');
            expect(this.getChatLogs(4)).toContain('player1 uses Perceptive Kitsuki to look at player2\'s hand');
            expect(this.getChatLogs(3)).toContain('Perceptive Kitsuki sees Fine Katana, Mark of Shame, Way of the Crane and Way of the Scorpion');
        });

        it('should not work when not participating', function() {
            this.player1.claimRing('earth');
            this.player1.claimRing('fire');

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [],
                type: 'military'
            });

            this.player2.pass();
            this.player1.clickCard(this.kitsuki);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });

        it('should not work with no rings', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.kitsuki],
                defenders: [],
                type: 'military'
            });

            this.player2.pass();
            this.player1.clickCard(this.kitsuki);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });
    });
});
