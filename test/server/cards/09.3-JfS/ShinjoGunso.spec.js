describe('Shinjo Gunso', function() {
    integration(function() {
        describe('Shinjo Gunso\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        honor: 20,
                        fate: 10,
                        dynastyDeck: ['shinjo-gunso', 'keeper-initiate', 'utaku-tetsuko', 'shinjo-shono', 'moto-nergui', 'border-rider']
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

                expect(this.player1).toHavePromptButton('Keeper Initiate');
                expect(this.player1).toHavePromptButton('Border Rider');
                expect(this.player1).toHaveDisabledPromptButton('Utaku Tetsuko');
                expect(this.player1).toHaveDisabledPromptButton('Shinjo Shono');
                expect(this.player1).toHaveDisabledPromptButton('Moto Nergui');
                expect(this.player1).toHavePromptButton('Don\'t choose a character');
            });
        });
    });
});

