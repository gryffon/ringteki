describe('Unveiled Destiny', function() {
    integration(function() {
        describe('Unveiled Destiny\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shrine-maiden'],
                        hand: ['seeker-of-knowledge', 'assassination', 'unveiled-destiny', 'fine-katana'],
                        role: 'seeker-of-void'
                    },
                    player2: {
                        provinces: ['defend-the-wall'],
                        inPlay: ['shinjo-outrider'],
                        hand: ['display-of-power', 'fine-katana']
                    }
                });
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
                this.shrineMaiden = this.player1.findCardByName('shrine-maiden');
                this.shrineMaiden.modifyFate(1);
            });

            it('should allow the attaking player to resolve the chosen ring if they wins', function() {
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Resolve Ring Effect');
                this.player1.clickRing('fire');
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
                expect(this.player1).toHavePrompt('Void Ring');
                this.player1.clickCard(this.shrineMaiden);
                expect(this.shrineMaiden.fate).toBe(0);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should interact correctly with Seeker of Knowledge', function() {
                this.player2.pass();
                this.player1.clickCard('seeker-of-knowledge');
                this.player1.clickPrompt('0');
                this.player1.clickPrompt('Conflict');
                this.noMoreActions();
                this.player1.clickRing('air');
                expect(this.player1).toHavePrompt('Air Ring');

            });

            it('should allow defend the wall to resolve the attackers role element.', function() {
                this.player2.playAttachment('fine-katana', 'shinjo-outrider');
                this.noMoreActions();
                this.player2.clickCard('defend-the-wall');
                expect(this.player2).toHavePrompt('Resolve Ring Effect');
                this.player2.clickRing('void');
                expect(this.player2).toHavePrompt('Void Ring');
                this.player2.clickCard(this.shrineMaiden);
                expect(this.shrineMaiden.fate).toBe(0);
            });

            it('should allow defend the wall to resolve the attackers role element.', function() {
                this.player2.pass();
                this.player1.clickCard('assassination');
                this.player1.clickCard('shinjo-outrider', 'any', 'opponent');
                this.noMoreActions();
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect('display-of-power');
                this.player2.clickCard('display-of-power');
                expect(this.player2).toHavePrompt('Resolve Ring Effect');
                this.player2.clickRing('void');
                expect(this.player2).toHavePrompt('Void Ring');
                this.player2.clickCard(this.shrineMaiden);
                expect(this.shrineMaiden.fate).toBe(0);
            });
        });
    });
});
