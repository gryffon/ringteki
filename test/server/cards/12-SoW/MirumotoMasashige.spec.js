describe('Mirumoto Masashige', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'draw',
                player1: {
                    inPlay: ['mirumoto-masashige', 'doji-challenger', 'marauding-oni']
                },
                player2: {
                    inPlay: ['doji-whisperer', 'miya-mystic'],
                    dynastyDiscard: ['callow-delegate', 'akodo-toturi']
                }
            });

            this.masashige = this.player1.findCardByName('mirumoto-masashige');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.oni = this.player1.findCardByName('marauding-oni');

            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.mystic = this.player2.findCardByName('miya-mystic');
            this.callow = this.player2.findCardByName('callow-delegate');
            this.toturi = this.player2.findCardByName('akodo-toturi');

            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');
        });

        it('should allow honoring a character you control at the start of the conflict phase if you control less characters', function() {
            this.player2.moveCard(this.callow, 'play area');
            this.player2.moveCard(this.toturi, 'play area');

            this.noMoreActions();

            expect(this.masashige.isHonored).toBe(false);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.masashige);
            this.player1.clickCard(this.masashige);

            expect(this.player1).toBeAbleToSelect(this.masashige);
            expect(this.player1).toBeAbleToSelect(this.challenger);
            expect(this.player1).not.toBeAbleToSelect(this.oni);
            expect(this.player1).not.toBeAbleToSelect(this.whisperer);
            expect(this.player1).not.toBeAbleToSelect(this.mystic);
            expect(this.player1).not.toBeAbleToSelect(this.callow);
            expect(this.player1).not.toBeAbleToSelect(this.toturi);

            this.player1.clickCard(this.masashige);
            expect(this.masashige.isHonored).toBe(true);
            expect(this.getChatLogs(1)).toContain('player1 uses Mirumoto Masashige to honor Mirumoto Masashige');

            expect(this.game.currentPhase).toBe('conflict');
        });

        it('should allow honoring a character you control at the start of the conflict phase if you control less characters', function() {
            this.player2.moveCard(this.callow, 'play area');
            this.player2.moveCard(this.toturi, 'play area');

            this.noMoreActions();

            expect(this.masashige.isHonored).toBe(false);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.masashige);
            this.player1.clickCard(this.masashige);

            expect(this.player1).toBeAbleToSelect(this.masashige);
            expect(this.player1).toBeAbleToSelect(this.challenger);
            expect(this.player1).not.toBeAbleToSelect(this.oni);
            expect(this.player1).not.toBeAbleToSelect(this.whisperer);
            expect(this.player1).not.toBeAbleToSelect(this.mystic);
            expect(this.player1).not.toBeAbleToSelect(this.callow);
            expect(this.player1).not.toBeAbleToSelect(this.toturi);

            this.player1.clickCard(this.masashige);
            expect(this.masashige.isHonored).toBe(true);
            expect(this.getChatLogs(1)).toContain('player1 uses Mirumoto Masashige to honor Mirumoto Masashige');

            expect(this.game.currentPhase).toBe('conflict');
        });

        it('should not trigger if you have equal characters', function() {
            this.player2.moveCard(this.callow, 'play area');
            this.noMoreActions();
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.game.currentPhase).toBe('conflict');
        });

        it('should not trigger if you have more characters', function() {
            this.noMoreActions();
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.game.currentPhase).toBe('conflict');
        });
    });
});
