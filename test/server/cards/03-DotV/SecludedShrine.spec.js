describe('Secluded Shrine', function() {
    integration(function() {
        describe('Secluded Shrine\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'draw',
                    player1: {
                        dynastyDeck: ['secluded-shrine'],
                        inPlay: ['henshin-disciple']
                    }
                });
                this.secludedShrine = this.player1.placeCardInProvince(
                    'secluded-shrine',
                    'province 1'
                );
                this.henshinDesciple = this.player1.findCardByName('henshin-disciple');

                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
            });

            it('should trigger at start of the conflict phase', function() {
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.secludedShrine);
            });

            it('should prompt to choose a ring', function() {
                this.noMoreActions();
                this.player1.clickCard(this.secludedShrine);
                expect(this.player1).toHavePrompt('Choose a ring');
            });

            it('ths chosen ring should be considered in your claimed ring pool', function() {
                let political = this.henshinDesciple.getPoliticalSkill();
                this.noMoreActions();
                this.player1.clickCard(this.secludedShrine);
                this.player1.clickRing('air');
                expect(this.henshinDesciple.getPoliticalSkill()).toBe(political + 2);
            });
        });
    });
});
