describe('Asako Takahiro', function() {
    integration(function() {
        describe('Asako Takahiro\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['asako-takahiro', 'brash-samurai', 'doji-challenger'],
                        hand: ['way-of-the-crane', 'way-of-the-crane', 'way-of-the-scorpion', 'way-of-the-scorpion', 'soul-beyond-reproach']
                    },
                    player2: {
                        inPlay: ['doji-whisperer', 'asahina-artisan'],
                        hand: ['way-of-the-crane', 'way-of-the-crane', 'way-of-the-scorpion', 'mark-of-shame']
                    }
                });
                this.takahiro = this.player1.findCardByName('asako-takahiro');
                this.brash = this.player1.findCardByName('brash-samurai');
                this.challenger = this.player1.findCardByName('doji-challenger');

                this.whisperer = this.player2.findCardByName('doji-whisperer');
                this.artisan = this.player2.findCardByName('asahina-artisan');

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.takahiro, this.brash],
                    defenders: [this.whisperer]
                });

            });

            it('should give +2 pol for each honored character in the conflict', function() {
                expect(this.takahiro.getPoliticalSkill()).toBe(1);
                this.player2.clickCard('way-of-the-crane');
                this.player2.clickCard(this.whisperer);
                expect(this.takahiro.getPoliticalSkill()).toBe(3);
                this.player1.clickCard('way-of-the-crane');
                this.player1.clickCard(this.challenger);
                expect(this.takahiro.getPoliticalSkill()).toBe(3);
                this.player2.pass();
                this.player1.clickCard('way-of-the-crane', 'hand');
                this.player1.clickCard(this.brash);
                expect(this.takahiro.getPoliticalSkill()).toBe(5);
            });

            it('should give +2 mil for each dishonored character in the conflict', function() {
                expect(this.takahiro.getMilitarySkill()).toBe(1);
                this.player2.clickCard('way-of-the-scorpion');
                this.player2.clickCard(this.whisperer);
                expect(this.takahiro.getMilitarySkill()).toBe(3);
                this.player1.clickCard('way-of-the-scorpion');
                this.player1.clickCard(this.brash);
                expect(this.takahiro.getMilitarySkill()).toBe(5);
                this.player2.playAttachment('mark-of-shame', this.challenger);
                this.player2.clickCard('mark-of-shame');
                expect(this.takahiro.getMilitarySkill()).toBe(5);
            });

            it('should not give skill pump if takahiro is honored or dishonored', function() {
                this.player2.clickCard('way-of-the-scorpion');
                this.player2.clickCard(this.takahiro);
                expect(this.takahiro.getMilitarySkill()).toBe(0);
                this.player1.clickCard('soul-beyond-reproach');
                this.player1.clickCard(this.takahiro);
                expect(this.takahiro.getPoliticalSkill()).toBe(3);
            });
        });
    });
});
