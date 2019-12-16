describe('Ichiro', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['ichiro', 'doji-challenger'],
                    hand: ['way-of-the-scorpion', 'way-of-the-crane', 'mark-of-shame', 'fine-katana']
                },
                player2: {
                    inPlay: ['doji-kuwanan'],
                    hand: ['way-of-the-scorpion', 'way-of-the-crane', 'mark-of-shame', 'fine-katana']
                }
            });

            this.ichiro = this.player1.findCardByName('ichiro');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.scorpion = this.player1.findCardByName('way-of-the-scorpion');
            this.crane = this.player1.findCardByName('way-of-the-crane');
            this.shame = this.player1.findCardByName('mark-of-shame');
            this.katana = this.player1.findCardByName('fine-katana');

            this.kuwanan = this.player2.findCardByName('doji-kuwanan');
            this.scorpion2 = this.player2.findCardByName('way-of-the-scorpion');
            this.crane2 = this.player2.findCardByName('way-of-the-crane');
            this.shame2 = this.player2.findCardByName('mark-of-shame');
            this.katana2 = this.player2.findCardByName('fine-katana');
        });

        it('should allow dishonoring people without attachments', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.ichiro, this.challenger],
                defenders: [this.kuwanan],
                type: 'military'
            });

            this.player2.clickCard(this.scorpion2);
            expect(this.player2).toBeAbleToSelect(this.ichiro);
            expect(this.player2).toBeAbleToSelect(this.challenger);
            expect(this.player2).toBeAbleToSelect(this.kuwanan);
        });

        it('should allow honoring people without attachments', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.ichiro, this.challenger],
                defenders: [this.kuwanan],
                type: 'military'
            });

            this.player2.clickCard(this.crane2);
            expect(this.player2).toBeAbleToSelect(this.kuwanan);
        });

        it('should not allow dishonoring people with attachments', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.ichiro, this.challenger],
                defenders: [this.kuwanan],
                type: 'military'
            });

            this.player2.clickCard(this.katana2);
            this.player2.clickCard(this.kuwanan);
            this.player1.clickCard(this.katana);
            this.player1.clickCard(this.ichiro);
            this.player2.clickCard(this.scorpion2);

            expect(this.player2).not.toBeAbleToSelect(this.ichiro);
            expect(this.player2).toBeAbleToSelect(this.challenger);
            expect(this.player2).not.toBeAbleToSelect(this.kuwanan);
        });

        it('should not allow honoring people with attachments', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.ichiro, this.challenger],
                defenders: [this.kuwanan],
                type: 'military'
            });

            this.player2.clickCard(this.katana2);
            this.player2.clickCard(this.kuwanan);
            this.player1.clickCard(this.katana);
            this.player1.clickCard(this.challenger);
            this.player2.clickCard(this.crane2);
            expect(this.player2).toHavePrompt('Conflict Action Window');
            this.player2.pass();

            this.player1.clickCard(this.crane);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });

        it('should prevent going from DH to Neutral', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.ichiro, this.challenger],
                defenders: [this.kuwanan],
                type: 'military'
            });

            this.player2.clickCard(this.scorpion2);
            this.player2.clickCard(this.challenger);
            expect(this.challenger.isDishonored).toBe(true);
            this.player1.clickCard(this.katana);
            this.player1.clickCard(this.challenger);
            this.player2.pass();

            this.player1.clickCard(this.crane);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });

        it('should prevent going from honored to Neutral', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.ichiro, this.challenger],
                defenders: [this.kuwanan],
                type: 'military'
            });

            this.player2.pass();

            this.player1.clickCard(this.crane);
            this.player1.clickCard(this.challenger);
            expect(this.challenger.isHonored).toBe(true);
            this.player2.pass();
            this.player1.clickCard(this.katana);
            this.player1.clickCard(this.challenger);
            this.player2.clickCard(this.scorpion2);

            expect(this.player2).toBeAbleToSelect(this.ichiro);
            expect(this.player2).not.toBeAbleToSelect(this.challenger);
            expect(this.player2).toBeAbleToSelect(this.kuwanan);
        });

        it('should not allow triggering Mark of Shame', function() {
            this.player1.clickCard(this.shame);
            this.player1.clickCard(this.kuwanan);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player2).toHavePrompt('Action Window');
        });
    });
});
