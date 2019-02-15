describe('In Defense of Rokugan', function() {
    integration(function() {
        describe('In Defense of Rokugan\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['adept-of-the-waves', 'wandering-ronin']
                    },
                    player2: {
                        inPlay: ['borderlands-defender', 'intimidating-hida'],
                        hand: ['in-defense-of-rokugan']
                    }
                });
                this.adeptOfTheWaves = this.player1.findCardByName('adept-of-the-waves');
                this.wanderingRonin = this.player1.findCardByName('wandering-ronin');
                this.borderlandsDefender = this.player2.findCardByName('borderlands-defender');
                this.intimidatingHida = this.player2.findCardByName('intimidating-hida');
                this.inDefenseOfRokugan = this.player2.findCardByName('in-defense-of-rokugan');
            });

            it('should not be able to be triggered outside of a conflict', function() {
                this.player1.pass();
                this.player2.clickCard(this.inDefenseOfRokugan);
                expect(this.player2).toHavePrompt('Action Window');
            });

            it('should require sacrificing a defending friendly character', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.adeptOfTheWaves],
                    defenders: [this.borderlandsDefender, this.intimidatingHida]
                });
                this.player2.clickCard(this.inDefenseOfRokugan);
                this.player2.clickCard(this.adeptOfTheWaves);
                expect(this.player2).toHavePrompt('Select card to sacrifice');
                expect(this.player2).toBeAbleToSelect(this.borderlandsDefender);
                expect(this.player2).toBeAbleToSelect(this.intimidatingHida);
                expect(this.player2).not.toBeAbleToSelect(this.adeptOfTheWaves);
                expect(this.player2).not.toBeAbleToSelect(this.wanderingRonin);
                this.player2.clickCard(this.borderlandsDefender);
                this.player2.clickCard(this.adeptOfTheWaves);
                expect(this.borderlandsDefender.location).toBe('dynasty discard pile');
            });

            it('should set the chosen attacking character\'s military skill to 0', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.adeptOfTheWaves],
                    defenders: [this.borderlandsDefender, this.intimidatingHida]
                });
                this.player2.clickCard(this.inDefenseOfRokugan);
                expect(this.player2).toHavePrompt('Choose a character');
                expect(this.player2).not.toBeAbleToSelect(this.borderlandsDefender);
                expect(this.player2).not.toBeAbleToSelect(this.intimidatingHida);
                expect(this.player2).toBeAbleToSelect(this.adeptOfTheWaves);
                expect(this.player2).not.toBeAbleToSelect(this.wanderingRonin);
                this.player2.clickCard(this.adeptOfTheWaves);
                this.player2.clickCard(this.borderlandsDefender);
                expect(this.adeptOfTheWaves.getMilitarySkill()).toBe(0);
            });
        });
    });
});
