describe('The Fires of Justice', function() {
    integration(function() {
        describe('The Fires of Justice\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['matsu-berserker'],
                        hand: ['the-fires-of-justice']
                    },
                    player2: {
                        inPlay: ['doji-whisperer', 'doji-challenger', 'guest-of-honor'],
                        fate: 10
                    }
                });

                this.matsuBerserker = this.player1.findCardByName('matsu-berserker');

                this.dojiChallenger = this.player2.findCardByName('doji-challenger');
                this.dojiChallenger.fate = 2;
                this.dojiWhisperer = this.player2.findCardByName('doji-whisperer');
                this.guestOfHonor = this.player2.findCardByName('guest-of-honor');

                this.theFiresOfJustice = this.player1.findCardByName('the-fires-of-justice');
            });

            it('should trigger after you win a military conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.matsuBerserker],
                    defenders: [this.dojiWhisperer, this.dojiChallenger]
                });
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.theFiresOfJustice);
            });

            it('should not trigger if there are no participating characters with fate and opponent has 0 fate', function() {
                this.player2.fate = 0;
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.matsuBerserker],
                    defenders: [this.dojiWhisperer]
                });
                this.noMoreActions();
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).toHavePrompt('Break Shameful Display');
            });

            describe('if triggered when opponent has no fate', function() {
                beforeEach(function() {
                    this.player2.fate = 0;
                    this.noMoreActions();
                    this.initiateConflict({
                        attackers: [this.matsuBerserker],
                        defenders: [this.dojiWhisperer, this.dojiChallenger]
                    });
                    this.noMoreActions();
                    this.player1.clickCard(this.theFiresOfJustice);
                });

                it('should prompt your opponent to choose a participating character they control with fate', function() {
                    expect(this.player2).toHavePrompt('The Fires of Justice');
                    expect(this.player2).toBeAbleToSelect(this.dojiChallenger);
                    expect(this.player2).not.toBeAbleToSelect(this.dojiWhisperer);
                    expect(this.player2).not.toBeAbleToSelect(this.guestOfHonor);
                    expect(this.player2).not.toBeAbleToSelect(this.matsuBerserker);
                });

                it('should skip prompt to select effect', function() {
                    this.player2.clickCard(this.dojiChallenger);
                    expect(this.player1).not.toHavePrompt('Select one');
                    expect(this.dojiChallenger.fate).toBe(0);
                });
            });

            describe('if triggered when opponent has fate', function() {
                beforeEach(function() {
                    this.noMoreActions();
                    this.initiateConflict({
                        attackers: [this.matsuBerserker],
                        defenders: [this.dojiWhisperer, this.dojiChallenger]
                    });
                    this.noMoreActions();
                    this.player1.clickCard(this.theFiresOfJustice);
                });

                it('should prompt your opponent to choose a participating character they control', function() {
                    expect(this.player2).toHavePrompt('The Fires of Justice');
                    expect(this.player2).toBeAbleToSelect(this.dojiChallenger);
                    expect(this.player2).toBeAbleToSelect(this.dojiWhisperer);
                    expect(this.player2).not.toBeAbleToSelect(this.guestOfHonor);
                    expect(this.player2).not.toBeAbleToSelect(this.matsuBerserker);
                });

                it('should prompt to either remove all fate or move fate to the character', function() {
                    this.player2.clickCard(this.dojiChallenger);
                    expect(this.player1).toHavePrompt('Select one');
                    expect(this.player1).toHavePromptButton('Remove all fate');
                    expect(this.player1).toHavePromptButton('Move fate to character');
                });

                it('should skip prompt to select effect if a character with no fate is chosen', function() {
                    this.player2.clickCard(this.dojiWhisperer);
                    expect(this.player1).not.toHavePrompt('Select one');
                    expect(this.player1).toHavePrompt('Select fate amount:');
                });

                it('if \'Remove all fate\' chosen, should remove all fate', function() {
                    this.player2.clickCard(this.dojiChallenger);
                    this.player1.clickPrompt('Remove all fate');
                    expect(this.dojiChallenger.fate).toBe(0);
                    expect(this.getChatLogs(1)).toContain('player1 plays The Fires of Justice to remove all fate from Doji Challenger');
                });

                it('if \'Move fate to character\' chosen, should prompt to choose the amount of fate', function() {
                    this.player2.clickCard(this.dojiChallenger);
                    this.player1.clickPrompt('Move fate to character');
                    expect(this.player1).toHavePrompt('Select fate amount:');
                    expect(this.player1).not.toHavePromptButton('0');
                    expect(this.player1).toHavePromptButton('1');
                    expect(this.player1).toHavePromptButton('2');
                    expect(this.player1).toHavePromptButton('3');
                    expect(this.player1).toHavePromptButton('4');
                    expect(this.player1).toHavePromptButton('5');
                    expect(this.player1).toHavePromptButton('6');
                    expect(this.player1).toHavePromptButton('7');
                    expect(this.player1).toHavePromptButton('8');
                    expect(this.player1).toHavePromptButton('9');
                    expect(this.player1).toHavePromptButton('10');
                    expect(this.player1).not.toHavePromptButton('11');
                });

                it('if \'Move fate to character\' chosen, should move the chosen amount of fate', function() {
                    this.player2.clickCard(this.dojiChallenger);
                    this.player1.clickPrompt('Move fate to character');
                    this.player1.clickPrompt('6');
                    expect(this.dojiChallenger.fate).toBe(8);
                    expect(this.player2.player.fate).toBe(4);
                    expect(this.getChatLogs(2)).toContain('player1 plays The Fires of Justice to place fate on Doji Challenger');
                    expect(this.getChatLogs(1)).toContain('player1 chooses to move 6 fate from player2\'s pool to Doji Challenger');
                });
            });

        });
    });
});
