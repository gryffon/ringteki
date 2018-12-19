describe('Shiro Shinjo', function() {
    integration(function() {
        describe('Shiro Shinjo\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'fate',
                    player1: {
                        stronghold: 'shiro-shinjo'
                    },
                    player2: {
                        inPlay: []
                    }
                });

                this.shiroShinjo = this.player1.findCardByName('shiro-shinjo');

                let provinces = this.player2.provinces;
                provinces['province 1'].provinceCard.facedown = false;
                provinces['province 2'].provinceCard.facedown = false;
                provinces['province 3'].provinceCard.facedown = false;
            });

            it('should trigger when you collect fate in the dynasty phase', function() {
                this.noMoreActions();
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');
                this.player2.clickPrompt('End Round');
                this.player1.clickPrompt('End Round');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.shiroShinjo);
            });

            it('should bow the stronghold', function() {
                this.noMoreActions();
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');
                this.player2.clickPrompt('End Round');
                this.player1.clickPrompt('End Round');
                this.player1.clickCard(this.shiroShinjo);
                expect(this.shiroShinjo.bowed).toBe(true);
            });

            it('should give the player fate equal to the number of faceup provinces your opponent controls', function() {
                let fate = this.player1.player.fate;
                this.noMoreActions();
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');
                this.player2.clickPrompt('End Round');
                this.player1.clickPrompt('End Round');
                this.player1.clickCard(this.shiroShinjo);
                expect(this.player1.player.fate).toBe(fate + 6 + 3);
            });
        });
    });
});
