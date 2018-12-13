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
                        fate: 4
                    }
                });

                this.matsuBerserker = this.player1.findCardByName('matsu-berserker');

                this.dojiChallenger = this.player2.findCardByName('doji-challenger');
                this.dojiChallenger.fate = 2;
                this.dojiWhisperer = this.player2.findCardByName('doji-whisperer');
                this.guestOfHonor = this.player2.findCardByName('guest-of-honor');

                this.theFiresOfJustice = this.player1.findCardByName('the-fires-of-justice');

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.matsuBerserker],
                    defenders: [this.dojiWhisperer, this.dojiChallenger]
                });
            });

            it('should trigger after you win a military conflict', function() {
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.theFiresOfJustice);
            });

            describe('if triggered', function() {
                beforeEach(function() {
                    this.noMoreActions();
                    this.player1.clickCard(this.theFiresOfJustice);
                });

                it('should prompt your opponent to choose a participating character they control', function() {
                    expect(this.player2).toHavePrompt('THe Fires of Justice');
                    expect(this.player2).toBeAbleToSelect(this.dojiChallenger);
                    expect(this.player2).toBeAbleToSelect(this.dojiWhisperer);
                    expect(this.player2).not.toBeAbleToSelect(this.guestOfHonor);
                    expect(this.player2).not.toBeAbleToSelect(this.matsuBerserker);
                });

                it('should prompt to either remove all fate or move fate to the character', function() {
                    this.player2.clickCard(this.dojiChallenger);
                    expect(this.player1).toHavePrompt('Select an action:');
                    expect(this.player1).toHavePromptButton('Remove all fate');
                    expect(this.player1).toHavePromptButton('Move fate to character');
                });

                it('if \'Remove all fate\' chosen, should remove all fate', function() {
                    this.player2.clickCard(this.dojiChallenger);
                    this.player1.clickPrompt('Remove all fate');
                    expect(this.dojiChallenger.fate).toBe(0);
                });

                it(', if \'Move fate to character\' chosen, should prompt to choose the amount of fate', function() {
                    this.player2.clickCard(this.dojiChallenger);
                    this.player1.clickPrompt('Move fate to character');
                    expect(this.player1).toHavePrompt('Choose fate amount');
                    expect(this.player1).not.toHavePromptButton('0');
                    expect(this.player1).toHavePromptButton('1');
                    expect(this.player1).toHavePromptButton('2');
                    expect(this.player1).toHavePromptButton('3');
                    expect(this.player1).toHavePromptButton('More');
                    this.player1.clickPrompt('More');
                    expect(this.player1).toHavePromptButton('4');
                    expect(this.player1).not.toHavePromptButton('5');
                });

                it(', if \'Move fate to character\' chosen, should move the chosen amount of fate', function() {
                    this.player2.clickCard(this.dojiChallenger);
                    this.player1.clickPrompt('Move fate to character');
                    this.player1.clickPrompt('More');
                    this.player1.clickPrompt('4');
                    expect(this.dojiChallenger.fate).toBe(6);
                    expect(this.player2.player.fate).toBe(0);
                });
            });

        });
    });
});
