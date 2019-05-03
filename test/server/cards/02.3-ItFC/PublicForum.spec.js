describe('Public Forum', function() {
    integration(function() {
        describe('Public Forum\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        provinces: ['public-forum']
                    },
                    player2: {
                        inPlay: ['aranat']
                    }
                });

                this.publicForum = this.player1.findCardByName('public-forum');

                this.aranat = this.player2.findCardByName('aranat');

                this.noMoreActions();
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.aranat],
                    defenders: [],
                    province: this.publicForum
                });
            });

            it('should trigger when it is about to be broken', function() {
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.publicForum);
            });

            it('should not trigger when it is about to be broken if there are honor tokens on it', function() {
                this.publicForum.addToken('honor');
                this.noMoreActions();
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player2).toHavePrompt('Break Public Forum');
            });

            it('should place 1 honor token on itself instead of breaking', function() {
                this.noMoreActions();
                this.player1.clickCard(this.publicForum);
                expect(this.publicForum.hasToken('honor')).toBe(true);
                expect(this.publicForum.getTokenCount('honor')).toBe(1);
                expect(this.publicForum.isBroken).toBe(false);
                expect(this.player2).toHavePrompt('Air Ring');
            });
        });
    });
});
