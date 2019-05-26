describe('War Dog Master', function() {
    integration(function() {
        describe('War Dog Master\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['war-dog-master'],
                        dynastyDiscard: ['adept-of-the-waves', 'favorable-ground']
                    },
                    player2: {
                    }
                });

                this.warDogMaster = this.player1.findCardByName('war-dog-master');
                this.adeptOfTheWaves = this.player1.findCardByName('adept-of-the-waves', 'dynasty discard pile');
                this.favorableGround = this.player1.findCardByName('favorable-ground', 'dynasty discard pile');
            });

            it('should work with a character', function() {
                this.player1.moveCard(this.adeptOfTheWaves, 'dynasty deck');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.warDogMaster]
                });
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.clickCard(this.warDogMaster);
                expect(this.getChatLogs(2)).toContain('player1 uses War Dog Master, discarding Adept of the Waves to give War Dog Master +2military');
                expect(this.warDogMaster.getMilitarySkill()).toBe(4);
            });

            it('should work with a holding', function() {
                this.player1.moveCard(this.favorableGround, 'dynasty deck');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.warDogMaster]
                });
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.clickCard(this.warDogMaster);
                expect(this.getChatLogs(2)).toContain('player1 uses War Dog Master, discarding Favorable Ground to give War Dog Master +0military');
                expect(this.warDogMaster.getMilitarySkill()).toBe(2);
            });

            it('should not resolve if your dynasty deck is empty', function() {
                this.player1.reduceDeckToNumber('dynasty deck', 0);
                expect(this.player1.dynastyDeck.length).toBe(0);
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.warDogMaster]
                });
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player2).toHavePrompt('Choose Defenders');
            });
        });
    });
});
