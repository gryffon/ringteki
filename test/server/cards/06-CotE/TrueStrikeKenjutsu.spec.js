describe('True Strike Kenjutsu', function() {
    integration(function() {
        describe('True Strike Kenjutsu\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['matsu-beiona', 'honored-general'],
                        hand: ['true-strike-kenjutsu', 'way-of-the-lion', 'fine-katana']
                    },
                    player2: {
                        inPlay: ['doji-whisperer', 'doji-challenger'],
                        hand: ['banzai']
                    }
                });
                this.matsuBeiona = this.player1.findCardByName('matsu-beiona');
                this.honoredGeneral = this.player1.findCardByName('honored-general');
                this.trueStrikeKenjutsu = this.player1.playAttachment('true-strike-kenjutsu', this.matsuBeiona);
                this.player2.pass();
                this.wayOfTheLion = this.player1.findCardByName('way-of-the-lion');
                this.fineKatana = this.player1.playAttachment('fine-katana', this.matsuBeiona);

                this.dojiWhisperer = this.player2.findCardByName('doji-whisperer');
                this.dojiChallenger = this.player2.findCardByName('doji-challenger');
                this.banzai = this.player2.findCardByName('banzai');
            });

            it('should not trigger when attached character is not in a conflict', function() {
                this.player2.pass();
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.matsuBeiona);
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.pass();
                this.initiateConflict({
                    attackers: [this.honoredGeneral],
                    defenders: [this.dojiWhisperer]
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.matsuBeiona);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            describe('during a conflict', function() {
                beforeEach(function() {
                    this.noMoreActions();
                    this.initiateConflict({
                        attackers: [this.matsuBeiona],
                        defenders: [this.dojiWhisperer]
                    });
                });

                it('should prompt to select a participating character controlled by your opponent', function() {
                    this.player2.pass();
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                    this.player1.clickCard(this.matsuBeiona);
                    expect(this.player1).toHavePrompt('Choose a character');
                    expect(this.player1).not.toBeAbleToSelect(this.matsuBeiona);
                    expect(this.player1).not.toBeAbleToSelect(this.honoredGeneral);
                    expect(this.player1).toBeAbleToSelect(this.dojiWhisperer);
                    expect(this.player1).not.toBeAbleToSelect(this.dojiChallenger);
                });

                it('should resolve the duel using base military skill and bow the loser', function() {
                    this.player2.clickCard(this.banzai);
                    this.player2.clickCard(this.dojiWhisperer);
                    this.player2.clickPrompt('Lose 1 honor to resolve this ability again');
                    this.player2.clickCard(this.dojiWhisperer);
                    this.player2.clickPrompt('Done');
                    this.player1.clickCard(this.matsuBeiona);
                    this.player1.clickCard(this.dojiWhisperer);
                    expect(this.getChatLogs(1)).toContain('player1 uses Matsu Beiona\'s gained ability from True Strike Kenjutsu to initiate a military duel : Matsu Beiona vs. Doji Whisperer');
                    expect(this.matsuBeiona.getMilitarySkill()).toBe(5);
                    expect(this.dojiWhisperer.getMilitarySkill()).toBe(4);
                    expect(this.player1).toHavePrompt('Choose your bid for the duel\nMatsu Beiona: 3 vs 0: Doji Whisperer');
                    expect(this.player2).toHavePrompt('Choose your bid for the duel\nMatsu Beiona: 3 vs 0: Doji Whisperer');
                    this.player1.clickPrompt(1);
                    this.player2.clickPrompt(3);
                    expect(this.getChatLogs(4)).toContain('Matsu Beiona: 4 vs 3: Doji Whisperer'); // would normally be 'Matsu Beiona: 6 vs 7: Doji Whisperer'
                    expect(this.matsuBeiona.bowed).toBe(false);
                    expect(this.dojiWhisperer.bowed).toBe(true);
                });
            });
        });
    });
});
