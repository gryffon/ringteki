describe('Market of Kaze-no-Kami', function() {
    integration(function() {
        describe('Market of Kaze-no-Kami\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['togashi-yokuni','doomed-shugenja']
                    },
                    player2: {
                        inPlay: ['doji-whisperer'],
                        provinces: ['market-of-kaze-no-kami']
                    }
                });
                this.yokuni = this.player1.findCardByName('togashi-yokuni');
                this.doomedShugenja = this.player1.findCardByName('doomed-shugenja');
                this.dojiWhisperer = this.player2.findCardByName('doji-whisperer');
                this.marketOfKazeNoKami = this.player2.findCardByName('market-of-kaze-no-kami', 'province 1');
                this.dojiWhisperer = this.player2.findCardByName('doji-whisperer');
                this.noMoreActions();
                this.yokuni.honor();
                this.dojiWhisperer.honor();

                this.initiateConflict({
                    province: this.marketOfKazeNoKami,
                    attackers: [this.yokuni]
                });
            });

            it('should trigger after being revealed', function() {
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.marketOfKazeNoKami);
            });

            it('should only target characters that are not honored', function() {
                this.player2.clickCard(this.marketOfKazeNoKami);
                expect(this.player2).toBeAbleToSelect(this.doomedShugenja);
                expect(this.player2).not.toBeAbleToSelect(this.yokuni);
                expect(this.player2).not.toBeAbleToSelect(this.dojiWhisperer);
            });

            it('should bow the chosen character', function() {
                this.player2.clickCard(this.marketOfKazeNoKami);
                this.player2.clickCard(this.doomedShugenja);
                expect(this.doomedShugenja.bowed).toBe(true);
            });
        });
    });
});
