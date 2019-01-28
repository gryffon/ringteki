describe('Unveiled Destiny', function() {
    integration(function() {
        describe('Unveiled Destiny\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shrine-maiden'],
                        hand: ['seeker-of-knowledge', 'assassination', 'unveiled-destiny'],
                        role: ['seeker-of-void']
                    },
                    player2: {
                        provinces: ['defend-the-wall'],
                        inPlay: ['shinjo-outrider'],
                        hand: ['display-of-power', 'fine-katana']
                    }
                });
                this.shrineMaiden = this.player1.findCardByName('shrine-maiden');
                this.shrineMaiden.modifyFate(1);
                this.player1.playAttachment('unveiled-destiny', 'shrine-maiden');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    ring: 'fire',
                    province: 'defend-the-wall',
                    attackers: ['shrine-maiden'],
                    defenders: ['shinjo-outrider']
                });
                this.player1.player.optionSettings.orderForcedAbilities = true;
            });

            it('should allow the attaking player to resolve only the chosen ring if they wins', function() {
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Resolve Ring Effect');
                this.player1.clickRing('fire');
                this.player1.clickPrompt('Done');
                expect(this.player1).toHavePrompt('Fire Ring');
                this.player1.clickCard(this.shrineMaiden);
                this.player1.clickPrompt('Honor shrine maiden');
                expect(this.shrineMaiden.isHonored).toBe(true);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should allow attacking player to resolve only the void ring if they wins', function() {
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Resolve Ring Effect');
                this.player1.clickRing('void');
                this.player1.clickPrompt('Done');
                expect(this.player1).toHavePrompt('Void Ring');
                this.player1.clickCard(this.shrineMaiden);
                expect(this.shrineMaiden.fate).toBe(0);
                expect(this.player1).toHavePrompt('Action Window');
            });
        });
    });
});
