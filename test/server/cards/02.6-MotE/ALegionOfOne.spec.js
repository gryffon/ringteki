describe('A Legion Of One', function() {
    integration(function() {
        describe('A Legion Of One\'s effect', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 10,
                        inPlay: ['miya-mystic', 'seppun-guardsman'],
                        hand: ['a-legion-of-one', 'a-legion-of-one']
                    },
                    player2: {
                        dynastyDeck: ['bayushi-liar', 'miya-mystic'],
                        hand: ['forged-edict', 'embrace-the-void']
                    }
                });
                this.miyaMystic = this.player1.findCardByName('miya-mystic');
                this.seppunGuardsman = this.player1.findCardByName('seppun-guardsman');
                this.bayushiLiar = this.player2.placeCardInProvince('bayushi-liar');
                this.miya2 = this.player2.placeCardInProvince('miya-mystic');
                this.legion = this.player1.findCardByName('a-legion-of-one');
                this.noMoreActions();
            });

            it('should on a character participating alone', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.miyaMystic],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.legion);
                expect(this.player1).toHavePrompt('A Legion Of One');
                expect(this.player1).toBeAbleToSelect(this.miyaMystic);
            });

            it('should not work on a character participating with other characters', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.miyaMystic],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.legion);
                expect(this.player1).toHavePrompt('A Legion Of One');
                expect(this.player1).toBeAbleToSelect(this.miyaMystic);
                expect(this.player1).not.toBeAbleToSelect(this.seppunGuardsman);
            });

            it('should give +3/+0', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.miyaMystic],
                    defenders: []
                });
                this.milStat = this.miyaMystic.getMilitarySkill();
                this.polStat = this.miyaMystic.getMilitarySkill();
                this.player2.pass();
                this.player1.clickCard(this.legion);
                this.player1.clickCard(this.miyaMystic);
                expect(this.miyaMystic.getMilitarySkill()).toBe(this.milStat + 3);
                expect(this.miyaMystic.getPoliticalSkill()).toBe(this.polStat);
            });

            it('should not allow player to remove a fate from targeted character if it has none', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.miyaMystic],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.legion);
                this.player1.clickCard(this.miyaMystic);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should allow player to remove a fate from targeted character, if able', function() {
                this.miyaMystic.modifyFate(1);
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.miyaMystic],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.legion);
                this.player1.clickCard(this.miyaMystic);
                expect(this.player1).toHavePromptButton('Remove 1 fate to resolve this ability again');
                this.player1.clickPrompt('Done');
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should prompt for a new target', function() {
                this.miyaMystic.modifyFate(1);
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.miyaMystic],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.legion);
                this.player1.clickCard(this.miyaMystic);
                this.player1.clickPrompt('Remove 1 fate to resolve this ability again');
                expect(this.miyaMystic.fate).toBe(0);
                expect(this.player1).toHavePrompt('Choose a character');
                expect(this.player1).toBeAbleToSelect(this.miyaMystic);
            });

            it('should remove a fate and give an extra +3/+0', function() {
                this.miyaMystic.modifyFate(1);
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.miyaMystic],
                    defenders: []
                });
                this.milStat = this.miyaMystic.getMilitarySkill();
                this.polStat = this.miyaMystic.getMilitarySkill();
                this.player2.pass();
                this.player1.clickCard(this.legion);
                this.player1.clickCard(this.miyaMystic);
                this.player1.clickPrompt('Remove 1 fate to resolve this ability again');
                this.player1.clickCard(this.miyaMystic);
                expect(this.miyaMystic.getMilitarySkill()).toBe(this.milStat + 6);
                expect(this.miyaMystic.getPoliticalSkill()).toBe(this.polStat);
                expect(this.miyaMystic.fate).toBe(0);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should give the player an opportunity to remove a 2nd fate', function() {
                this.miyaMystic.modifyFate(2);
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.miyaMystic],
                    defenders: []
                });
                this.milStat = this.miyaMystic.getMilitarySkill();
                this.polStat = this.miyaMystic.getMilitarySkill();
                this.player2.pass();
                this.player1.clickCard(this.legion);
                this.player1.clickCard(this.miyaMystic);
                this.player1.clickPrompt('Remove 1 fate to resolve this ability again');
                this.player1.clickCard(this.miyaMystic);
                expect(this.player1).toHavePromptButton('Remove 1 fate for no effect');
                this.player1.clickPrompt('Remove 1 fate for no effect');
                expect(this.miyaMystic.getMilitarySkill()).toBe(this.milStat + 6);
                expect(this.miyaMystic.getPoliticalSkill()).toBe(this.polStat);
                expect(this.miyaMystic.fate).toBe(0);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should allow cancelling at first prompt', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.miyaMystic],
                    defenders: []
                });
                this.player2.putIntoPlay(this.bayushiLiar);
                this.player2.pass();
                this.player1.clickCard(this.legion);
                this.player1.clickCard(this.miyaMystic);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect('forged-edict');
                this.player2.clickCard('forged-edict');
                this.player2.clickCard(this.bayushiLiar);
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.miyaMystic.getMilitarySkill()).toBe(1);
                expect(this.miyaMystic.getPoliticalSkill()).toBe(1);
            });

            it('should allow cancelling at second prompt', function() {
                this.miyaMystic.modifyFate(1);
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.miyaMystic],
                    defenders: []
                });
                this.milStat = this.miyaMystic.getMilitarySkill();
                this.polStat = this.miyaMystic.getMilitarySkill();
                this.player2.putIntoPlay(this.bayushiLiar);
                this.player2.pass();
                this.player1.clickCard(this.legion);
                this.player1.clickCard(this.miyaMystic);
                this.player2.clickPrompt('Pass');
                this.player1.clickPrompt('Remove 1 fate to resolve this ability again');
                this.player1.clickCard(this.miyaMystic);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect('forged-edict');
                this.player2.clickCard('forged-edict');
                this.player2.clickCard(this.bayushiLiar);
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.miyaMystic.getMilitarySkill()).toBe(this.milStat + 3);
                expect(this.miyaMystic.getPoliticalSkill()).toBe(this.polStat);
                expect(this.miyaMystic.fate).toBe(0);
            });
        });
    });
});
