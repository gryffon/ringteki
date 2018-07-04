describe('Court Games', function () {
    integration(function () {
        describe('Court Games\' ability', function () { 
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shinjo-outrider'],
                        hand: ['banzai', 'banzai', 'banzai']
                    },
                    player2: {
                        inPlay: ['asako-tsuki', 'adept-of-the-waves'],
                        provinces: ['pilgrimage'],
                        hand: ['court-games']
                    }
                });
                this.rider = this.player1.findCardByName('shinjo-outrider');
                this.tsuki = this.player2.findCardByName('asako-tsuki');
                this.noMoreActions();
            });

            it('should not activate during a military conflict', function () {
                this.initiateConflict({
                    type: 'military',
                    province: 'pilgrimage',
                    attackers: ['shinjo-outrider'],
                    defenders: ['asako-tsuki']
                });
                this.player2.clickCard('court-games', 'hand');
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should prompt to honor and dishonor', function () {
                this.initiateConflict({
                    type: 'political',
                    province: 'pilgrimage',
                    attackers: ['shinjo-outrider'],
                    defenders: ['asako-tsuki']
                });
                this.player2.clickCard('court-games', 'hand');
                expect(this.player2).toHavePromptButton('Honor a friendly character');
                expect(this.player2).toHavePromptButton('Dishonor an opposing character');
            });

            it('should should honor the selected friendly character', function () {
                this.initiateConflict({
                    type: 'political',
                    province: 'pilgrimage',
                    attackers: ['shinjo-outrider'],
                    defenders: ['asako-tsuki']
                });
                this.player2.clickCard('court-games', 'hand');
                this.player2.clickPrompt('Honor a friendly character');
                this.player2.clickCard(this.tsuki);
                expect(this.tsuki.isHonored).toBe(true);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should should dishonor the selected opposing character', function () {
                this.initiateConflict({
                    type: 'political',
                    province: 'pilgrimage',
                    attackers: ['shinjo-outrider'],
                    defenders: ['asako-tsuki']
                });
                this.player2.clickCard('court-games', 'hand');
                this.player2.clickPrompt('Dishonor an opposing character');
                this.player1.clickCard(this.rider);
                expect(this.rider.isDishonored).toBe(true);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });
        });
    });
});
