describe('Kyuden Bayushi', function() {
    integration(function() {
        describe('Kyuden Bayushi\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        stronghold: 'kyuden-bayushi',
                        inPlay: ['bayushi-aramoro']
                    },
                    player2: {
                        inPlay: []
                    }
                });
                this.kyuden = this.player1.findCardByName('kyuden-bayushi');
                this.aramoro = this.player1.findCardByName('bayushi-aramoro');
            });

            it('should give +1 to both stats if 6 or less honor', function() {
                this.aramoro.dishonor();
                this.aramoro.bow();
                this.player1.honor = 5;
                this.player1.clickCard(this.kyuden);
                expect(this.player1).toBeAbleToSelect(this.aramoro);
                this.player1.clickCard(this.aramoro);
                expect(this.aramoro.bowed).toBe(false);
                expect(this.aramoro.militarySkill).toBe(4);
                expect(this.aramoro.politicalSkill).toBe(1);
                expect(this.getChatLogs(1)).toContain('player1 uses Kyūden Bayushi, bowing Kyūden Bayushi to ready and give +1/+1 until the end of phase to Bayushi Aramoro');
            });

            it('should not give +1 to both stats if more than 6 honor', function() {
                this.aramoro.dishonor();
                this.aramoro.bow();
                this.player1.honor = 7;
                this.player1.clickCard(this.kyuden);
                expect(this.player1).toBeAbleToSelect(this.aramoro);
                this.player1.clickCard(this.aramoro);
                expect(this.aramoro.bowed).toBe(false);
                expect(this.aramoro.militarySkill).toBe(3);
                expect(this.aramoro.politicalSkill).toBe(0);
                expect(this.getChatLogs(1)).toContain('player1 uses Kyūden Bayushi, bowing Kyūden Bayushi to ready Bayushi Aramoro');
            });

            it('should still give +1 to both stats if 6 or less honor and the character is ready', function() {
                this.aramoro.dishonor();
                this.player1.honor = 5;
                this.player1.clickCard(this.kyuden);
                expect(this.player1).toBeAbleToSelect(this.aramoro);
                this.player1.clickCard(this.aramoro);
                expect(this.aramoro.militarySkill).toBe(4);
                expect(this.aramoro.politicalSkill).toBe(1);
                expect(this.getChatLogs(1)).toContain('player1 uses Kyūden Bayushi, bowing Kyūden Bayushi to give +1/+1 until the end of phase to Bayushi Aramoro');
            });

            it('should not work if the character is not dishonored', function() {
                this.aramoro.bow();
                this.player1.honor = 5;
                this.player1.clickCard(this.kyuden);
                expect(this.player1).not.toBeAbleToSelect(this.aramoro);
            });
        });
    });
});
