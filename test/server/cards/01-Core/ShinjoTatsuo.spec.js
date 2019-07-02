describe('Shinjo Tatsuo', function() {
    integration(function() {
        describe('Shinjo Tatsuo\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shinjo-tatsuo', 'border-rider', 'battle-maiden-recruit']
                    }
                });
                this.shinjoTatsuo = this.player1.findCardByName('shinjo-tatsuo');
                this.borderRider = this.player1.findCardByName('border-rider');
                this.battleMaidenRecruit = this.player1.findCardByName('battle-maiden-recruit');
            });

            it('should not trigger outside of a conflict', function() {
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.shinjoTatsuo);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should not trigger if Shinjo Tatsuo is participating', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.shinjoTatsuo],
                    defenders: []
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.shinjoTatsuo);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should prompt you to choose this character', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.borderRider],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.shinjoTatsuo);
                expect(this.player1).toHavePrompt('Choose a Character');
                expect(this.player1).toBeAbleToSelect(this.shinjoTatsuo);
                expect(this.player1).not.toBeAbleToSelect(this.borderRider);
                expect(this.player1).not.toBeAbleToSelect(this.battleMaidenRecruit);
            });

            it('should prompt you to optionally choose another non-participating character', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.borderRider],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.shinjoTatsuo);
                this.player1.clickCard(this.shinjoTatsuo);
                expect(this.player1).toHavePrompt('Choose a Character');
                expect(this.player1).toHavePromptButton('Done');
                expect(this.player1).toBeAbleToSelect(this.battleMaidenRecruit);
                expect(this.player1).not.toBeAbleToSelect(this.shinjoTatsuo);
                expect(this.player1).not.toBeAbleToSelect(this.borderRider);
            });

            it('should move only Shinjo Tatsuo to the conflict if no other character is chosen', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.borderRider],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.shinjoTatsuo);
                this.player1.clickCard(this.shinjoTatsuo);
                this.player1.clickPrompt('Done');
                expect(this.shinjoTatsuo.isParticipating()).toBe(true);
                expect(this.borderRider.isParticipating()).toBe(true);
                expect(this.battleMaidenRecruit.isParticipating()).toBe(false);
                expect(this.getChatLogs(3)).toContain('player1 uses Shinjo Tatsuo to move Shinjo Tatsuo into the conflict');
            });

            it('should move both Shinjo Tatsuo and the chosen character to the conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.borderRider],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.shinjoTatsuo);
                this.player1.clickCard(this.shinjoTatsuo);
                this.player1.clickCard(this.battleMaidenRecruit);
                expect(this.shinjoTatsuo.isParticipating()).toBe(true);
                expect(this.borderRider.isParticipating()).toBe(true);
                expect(this.battleMaidenRecruit.isParticipating()).toBe(true);
                expect(this.getChatLogs(3)).toContain('player1 uses Shinjo Tatsuo to move Shinjo Tatsuo and Battle Maiden Recruit into the conflict');
            });
        });
    });
});
