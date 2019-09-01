describe('Shinjo Gunso', function() {
    integration(function() {
        describe('Shinjo Gunso\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        honor: 20,
                        fate: 10,
                        inPlay: ['shinjo-gunso'],
                        dynastyDeck: ['border-rider', 'keeper-initiate', 'moto-youth', 'moto-chagatai', 'moto-nergui', 'utaku-yumino', 'battle-maiden-recruit', 'utaku-tetsuko',]
                    }
                });

                this.shinjoGunso = this.player1.placeCardInProvince('shinjo-gunso', 'province 1');
            });

            it('should allow you to trigger Shinjo Gunso after playing him', function() {
                this.player1.clickCard(this.shinjoGunso);
                this.player1.clickPrompt('1');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.shinjoGunso);
            });

            it('allows to pick from the top 5 cards of your dynasty deck or no character', function() {
                this.player1.clickCard(this.shinjoGunso);
                this.player1.clickPrompt('1');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.shinjoGunso);

                this.player1.clickCard(this.shinjoGunso);

                expect(this.player1).toHavePromptButton('Adept of the Waves (3)');
                expect(this.player1).toHaveDisabledPromptButton('Moto Nergui');
                expect(this.player1).toHavePromptButton('Don\'t choose a character');

                this.player1.clickPrompt('Adept of the Waves (3)');
                expect(this.player1.dynastyDiscardPile).toContain('adept-of-the-waves');
            });
        });
    });
});

