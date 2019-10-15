describe('Peasant\'s Advice', function() {
    integration(function() {
        describe('Peasant\'s Advice\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['seppun-guardsman'],
                        hand: ['peasant-s-advice']
                    },
                    player2: {
                        dynastyDiscard: ['shiba-tsukune']
                    }
                });

                this.shamefulDisplay = this.player2.findCardByName('shameful-display', 'province 1');
                this.shibaTsukune = this.player2.placeCardInProvince('shiba-tsukune', 'province 1');
            });

            it('should dishonor the character chosen as a cost', function() {
                this.player1.clickCard('peasant-s-advice');
                this.player1.clickPrompt('Pay Costs First');
                this.seppunGuardsman = this.player1.clickCard('seppun-guardsman');
                expect(this.seppunGuardsman.isDishonored).toBe(true);
            });

            it('should display a chat message about a provice with a facedown card in it', function() {
                this.shibaTsukune.facedown = true;
                this.player1.clickCard('peasant-s-advice');
                this.player1.clickCard(this.shamefulDisplay);
                this.seppunGuardsman = this.player1.clickCard('seppun-guardsman');
                expect(this.player1).not.toHavePrompt('Choose a faceup card to return to its owner\'s deck');
                expect(this.player1).not.toHavePromptButton('Done');
                expect(this.player2).toHavePrompt('Action Window');
                expect(this.getChatLogs(5)).toContain('Peasant\'s Advice sees Shameful Display');
            });

            it('should offer the option to shuffle a faceup card in a faceup province', function() {
                this.shamefulDisplay.facedown = false;
                this.player1.clickCard('peasant-s-advice');
                this.player1.clickCard(this.shamefulDisplay);
                this.seppunGuardsman = this.player1.clickCard('seppun-guardsman');
                expect(this.player1).toHavePrompt('Choose a faceup card to return to its owner\'s deck');
                expect(this.player1).toHavePromptButton('Done');
                expect(this.player1).toBeAbleToSelect(this.shibaTsukune);
                this.player1.clickPrompt('Done');
                expect(this.player2).toHavePrompt('Action Window');
                expect(this.getChatLogs(5)).not.toContain('Peasant\'s Advice sees Shameful Display');
                expect(this.shibaTsukune.location).toBe('province 1');
            });

            it('should both display a chat message and offer the option to shuffle a faceup card in a facedown province', function() {
                this.player1.clickCard('peasant-s-advice');
                this.player1.clickCard(this.shamefulDisplay);
                this.seppunGuardsman = this.player1.clickCard('seppun-guardsman');
                expect(this.player1).toHavePrompt('Choose a faceup card to return to its owner\'s deck');
                expect(this.player1).toHavePromptButton('Done');
                expect(this.player1).toBeAbleToSelect(this.shibaTsukune);
                this.player1.clickCard(this.shibaTsukune);
                expect(this.player2).toHavePrompt('Action Window');
                expect(this.getChatLogs(5)).toContain('Peasant\'s Advice sees Shameful Display');
                expect(this.getChatLogs(5)).toContain('player1 chooses to shuffle Shiba Tsukune into its owner\'s deck');
                expect(this.getChatLogs(5)).toContain('player2 is shuffling their dynasty deck');
                expect(this.shibaTsukune.location === 'dynasty deck' || 
                    this.shibaTsukune.location === 'province 1' && this.shibaTsukune.facedown).toBe(true);
                expect(this.player2.player.getDynastyCardInProvince('province 1')).not.toBeUndefined();
            });

            it('should not allow shuffling a stronghold', function() {
                this.strongholdProvince = this.player2.findCardByName('shameful-display', 'stronghold province');
                this.player1.clickCard('peasant-s-advice');
                this.player1.clickCard(this.strongholdProvince);
                this.seppunGuardsman = this.player1.clickCard('seppun-guardsman');
                expect(this.player2).toHavePrompt('Action Window');
                expect(this.getChatLogs(5)).toContain('Peasant\'s Advice sees Shameful Display');
            });

            it('should not be allowed to target a faceup province with a facedown card in it', function() {
                this.shamefulDisplay.facedown = false;
                this.shibaTsukune.facedown = true;
                this.player1.clickCard('peasant-s-advice');
                expect(this.player1).toHavePrompt('Peasant\'s Advice');
                expect(this.player1).not.toBeAbleToSelect(this.shamefulDisplay);
            });
        });
    });
});
