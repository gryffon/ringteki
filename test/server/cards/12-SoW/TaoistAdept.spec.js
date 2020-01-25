describe('Taoist Adept', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['border-rider']
                },
                player2: {
                    inPlay: ['taoist-adept']
                }
            });

            this.borderRider = this.player1.findCardByName('border-rider');
            this.adept = this.player2.findCardByName('taoist-adept');
            this.player1.claimRing('fire');
        });

        it('should allow the winner to pick an unclaimed ring to receive a fate (opponent wins)', function() {
            let voidFate = this.game.rings.void.fate;
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.borderRider],
                defenders: [this.adept],
                type: 'military',
                ring: 'air'
            });

            this.player2.clickCard(this.adept);
            this.player2.clickCard(this.borderRider);
            this.player2.clickPrompt('1');
            this.player1.clickPrompt('1');

            expect(this.getChatLogs(4)).toContain('Taoist Adept: 2 vs 3: Border Rider');
            expect(this.getChatLogs(3)).toContain('Duel Effect: choose whether to place a fate on a ring');
            expect(this.player1).toHavePrompt('Place a fate on a ring?');
            expect(this.player1).toHavePromptButton('Yes');
            expect(this.player1).toHavePromptButton('No');
            this.player1.clickPrompt('Yes');
            expect(this.player1).toHavePrompt('Choose a ring to receive a fate');
            expect(this.player1).not.toBeAbleToSelectRing('air');
            expect(this.player1).toBeAbleToSelectRing('earth');
            expect(this.player1).not.toBeAbleToSelectRing('fire');
            expect(this.player1).toBeAbleToSelectRing('void');
            expect(this.player1).toBeAbleToSelectRing('water');

            this.player1.clickRing('void');
            expect(this.game.rings.void.fate).toBe(voidFate + 1);

            expect(this.getChatLogs(3)).toContain('player1 chooses to place a fate on the Void Ring');
        });

        it('should allow the winner to pick an unclaimed ring to receive a fate (self wins)', function() {
            let voidFate = this.game.rings.void.fate;
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.borderRider],
                defenders: [this.adept],
                type: 'military',
                ring: 'air'
            });

            this.player2.clickCard(this.adept);
            this.player2.clickCard(this.borderRider);
            this.player2.clickPrompt('5');
            this.player1.clickPrompt('1');

            expect(this.getChatLogs(4)).toContain('Taoist Adept: 6 vs 3: Border Rider');
            expect(this.getChatLogs(3)).toContain('Duel Effect: choose whether to place a fate on a ring');
            expect(this.player2).toHavePrompt('Place a fate on a ring?');
            expect(this.player2).toHavePromptButton('Yes');
            expect(this.player2).toHavePromptButton('No');
            this.player2.clickPrompt('Yes');
            expect(this.player2).toHavePrompt('Choose a ring to receive a fate');
            expect(this.player2).not.toBeAbleToSelectRing('air');
            expect(this.player2).toBeAbleToSelectRing('earth');
            expect(this.player2).not.toBeAbleToSelectRing('fire');
            expect(this.player2).toBeAbleToSelectRing('void');
            expect(this.player2).toBeAbleToSelectRing('water');

            this.player2.clickRing('void');
            expect(this.game.rings.void.fate).toBe(voidFate + 1);

            expect(this.getChatLogs(3)).toContain('player2 chooses to place a fate on the Void Ring');
        });

        it('should do nothing in a draw', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.borderRider],
                defenders: [this.adept],
                type: 'military',
                ring: 'air'
            });

            this.player2.clickCard(this.adept);
            this.player2.clickCard(this.borderRider);
            this.player2.clickPrompt('2');
            this.player1.clickPrompt('1');

            expect(this.getChatLogs(4)).toContain('The duel ends in a draw');
            expect(this.getChatLogs(3)).toContain('The duel has no effect');
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });

        it('should allow the winner to decide not to put a fate on a ring (self wins)', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.borderRider],
                defenders: [this.adept],
                type: 'military',
                ring: 'air'
            });

            this.player2.clickCard(this.adept);
            this.player2.clickCard(this.borderRider);
            this.player2.clickPrompt('5');
            this.player1.clickPrompt('1');

            expect(this.getChatLogs(4)).toContain('Taoist Adept: 6 vs 3: Border Rider');
            expect(this.getChatLogs(3)).toContain('Duel Effect: choose whether to place a fate on a ring');
            expect(this.player2).toHavePrompt('Place a fate on a ring?');
            expect(this.player2).toHavePromptButton('Yes');
            expect(this.player2).toHavePromptButton('No');
            this.player2.clickPrompt('No');
            expect(this.getChatLogs(3)).toContain('player2 chooses not to place a fate on a ring');
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });

        it('should allow the winner to decide not to put a fate on a ring (opponent wins)', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.borderRider],
                defenders: [this.adept],
                type: 'military',
                ring: 'air'
            });

            this.player2.clickCard(this.adept);
            this.player2.clickCard(this.borderRider);
            this.player2.clickPrompt('1');
            this.player1.clickPrompt('1');

            expect(this.getChatLogs(4)).toContain('Taoist Adept: 2 vs 3: Border Rider');
            expect(this.getChatLogs(3)).toContain('Duel Effect: choose whether to place a fate on a ring');
            expect(this.player1).toHavePrompt('Place a fate on a ring?');
            expect(this.player1).toHavePromptButton('Yes');
            expect(this.player1).toHavePromptButton('No');
            this.player1.clickPrompt('No');
            expect(this.getChatLogs(3)).toContain('player1 chooses not to place a fate on a ring');
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });
    });
});
