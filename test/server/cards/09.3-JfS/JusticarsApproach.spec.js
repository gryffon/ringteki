describe('Justicar\'s Approach', function() {
    integration(function() {
        describe('Justicar\'s Approach Technique', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['brash-samurai', 'doji-whisperer'],
                        hand: ['justicar-s-approach', 'way-of-the-scorpion', 'for-shame']
                    },
                    player2: {
                        inPlay: ['matsu-berserker', 'kitsu-spiritcaller']
                    }
                });
                this.brashSamurai = this.player1.findCardByName('brash-samurai');
                this.dojiWhisperer = this.player1.findCardByName('doji-whisperer');
                this.justicarsApproach = this.player1.findCardByName('justicar-s-approach');
                this.wayOfTheScorpion = this.player1.findCardByName('way-of-the-scorpion');
                this.forShame = this.player1.findCardByName('for-shame');
                this.matsuBerserker = this.player2.findCardByName('matsu-berserker');
                this.kitsuSpiritcaller = this.player2.findCardByName('kitsu-spiritcaller');
            });

            it('should only be attachable to courtier characters', function() {
                this.player1.clickCard(this.justicarsApproach);
                expect(this.player1).not.toBeAbleToSelect(this.brashSamurai);
                expect(this.player1).toBeAbleToSelect(this.dojiWhisperer);
                expect(this.player1).not.toBeAbleToSelect(this.matsuBerserker);
            });

            it('should not be triggerable outside of a conflict', function() {
                this.player1.clickCard(this.justicarsApproach);
                this.player1.clickCard(this.dojiWhisperer);
                this.player2.pass();
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.dojiWhisperer);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should prompt to choose a duel target', function() {
                this.player1.clickCard(this.justicarsApproach);
                this.player1.clickCard(this.dojiWhisperer);
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.dojiWhisperer, this.brashSamurai],
                    defenders: [this.matsuBerserker]
                });
                this.player2.pass();
                this.player1.clickCard(this.dojiWhisperer);
                expect(this.player1).toHavePrompt('Choose a character');
                expect(this.player1).not.toBeAbleToSelect(this.dojiWhisperer);
                expect(this.player1).not.toBeAbleToSelect(this.brashSamurai);
                expect(this.player1).toBeAbleToSelect(this.matsuBerserker);
                expect(this.player1).not.toBeAbleToSelect(this.kitsuSpiritcaller);
            });

            it('should dishonor the duel\'s loser if not already dishonored or bowed', function() {
                this.player1.clickCard(this.justicarsApproach);
                this.player1.clickCard(this.dojiWhisperer);
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.dojiWhisperer, this.brashSamurai],
                    defenders: [this.matsuBerserker]
                });
                this.player2.pass();
                this.player1.clickCard(this.dojiWhisperer);
                this.player1.clickCard(this.matsuBerserker);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('5');
                expect(this.dojiWhisperer.isDishonored).toBe(true);
                expect(this.getChatLogs(3)).toContain('Duel Effect: dishonor Doji Whisperer');
            });

            it('should bow the duel\'s loser if already dishonored but not bowed', function() {
                this.player1.clickCard(this.justicarsApproach);
                this.player1.clickCard(this.dojiWhisperer);
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.dojiWhisperer, this.brashSamurai],
                    defenders: [this.matsuBerserker]
                });
                this.player2.pass();
                this.player1.clickCard(this.wayOfTheScorpion);
                this.player1.clickCard(this.matsuBerserker);
                expect(this.matsuBerserker.isDishonored).toBe(true);
                this.player2.pass();
                this.player1.clickCard(this.dojiWhisperer);
                this.player1.clickCard(this.matsuBerserker);
                this.player1.clickPrompt('5');
                this.player2.clickPrompt('1');
                expect(this.matsuBerserker.bowed).toBe(true);
                expect(this.getChatLogs(3)).toContain('Duel Effect: bow Matsu Berserker');
            });

            it('should discard the duel\'s loser if already dishonored and bowed', function() {
                this.player1.clickCard(this.justicarsApproach);
                this.player1.clickCard(this.dojiWhisperer);
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.dojiWhisperer, this.brashSamurai],
                    defenders: [this.matsuBerserker]
                });
                this.player2.pass();
                this.player1.clickCard(this.wayOfTheScorpion);
                this.player1.clickCard(this.matsuBerserker);
                expect(this.matsuBerserker.isDishonored).toBe(true);
                this.player2.pass();
                this.player1.clickCard(this.forShame);
                this.player1.clickCard(this.matsuBerserker);
                expect(this.matsuBerserker.bowed).toBe(true);
                this.player2.pass();
                this.player1.clickCard(this.dojiWhisperer);
                this.player1.clickCard(this.matsuBerserker);
                this.player1.clickPrompt('5');
                this.player2.clickPrompt('1');
                expect(this.matsuBerserker.location).toBe('dynasty discard pile');
                expect(this.getChatLogs(4)).toContain('Duel Effect: discard Matsu Berserker');
            });

            it('should have no effect if the duel is drawn', function() {
                this.player1.clickCard(this.justicarsApproach);
                this.player1.clickCard(this.dojiWhisperer);
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.dojiWhisperer, this.brashSamurai],
                    defenders: [this.matsuBerserker]
                });
                this.player2.pass();
                this.player1.clickCard(this.dojiWhisperer);
                this.player1.clickCard(this.matsuBerserker);
                this.player1.clickPrompt('3');
                this.player2.clickPrompt('1');
                expect(this.getChatLogs(3)).toContain('The duel has no effect');
            });
        });
    });
});
