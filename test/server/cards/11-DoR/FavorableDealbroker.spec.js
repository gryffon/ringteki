describe('Favorable Dealbroker', function() {
    integration(function() {
        describe('Favorable Dealbroker\'s abilities', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        dynastyDiscard: ['favorable-dealbroker', 'eager-scout', 'hida-guardian', 'doji-whisperer', 'brash-samurai', 'doji-challenger', 'honored-general', 'hida-kisada', 'forgotten-library'],
                        dynastyDeckSize: 4,
                        hand: ['charge']
                    }
                });

                this.favorableDealbroker = this.player1.findCardByName('favorable-dealbroker');
                this.eagerScout = this.player1.findCardByName('eager-scout');
                this.hidaGuardian = this.player1.findCardByName('hida-guardian');
                this.dojiWhisperer = this.player1.findCardByName('doji-whisperer');
                this.brashSamurai = this.player1.findCardByName('brash-samurai');
                this.dojiChallenger = this.player1.findCardByName('doji-challenger');
                this.honoredGeneral = this.player1.findCardByName('honored-general');
                this.hidaKisada = this.player1.findCardByName('hida-kisada');
                this.forgottenLibrary = this.player1.findCardByName('forgotten-library');
                this.charge = this.player1.findCardByName('charge');

                this.player1.placeCardInProvince(this.favorableDealbroker);

                this.player1.moveCard(this.eagerScout, 'dynasty deck');
                this.player1.moveCard(this.hidaGuardian, 'dynasty deck');
                this.player1.moveCard(this.dojiWhisperer, 'dynasty deck');
                this.player1.moveCard(this.brashSamurai, 'dynasty deck');
                this.player1.moveCard(this.dojiChallenger, 'dynasty deck');
                this.player1.moveCard(this.honoredGeneral, 'dynasty deck');
                this.player1.moveCard(this.hidaKisada, 'dynasty deck');
                this.player1.moveCard(this.forgottenLibrary, 'dynasty deck');
            });

            it('should trigger when played in dynasty', function() {
                this.player1.clickCard(this.favorableDealbroker);
                this.player1.clickPrompt('0');
                expect(this.player1).toBeAbleToSelect(this.favorableDealbroker);
            });

            it('should allow you to select a 1 fate character from your dynasty deck when triggered', function() {
                expect(this.dojiWhisperer.location).toBe('dynasty deck');
                expect(this.hidaGuardian.location).toBe('dynasty deck');

                this.player1.clickCard(this.favorableDealbroker);
                this.player1.clickPrompt('0');
                expect(this.player1).toBeAbleToSelect(this.favorableDealbroker);
                this.player1.clickCard(this.favorableDealbroker);

                expect(this.player1).not.toHavePromptButton('Eager Scout');
                expect(this.player1).toHavePromptButton('Hida Guardian');
                expect(this.player1).toHavePromptButton('Doji Whisperer');
                expect(this.player1).not.toHavePromptButton('Brash Samurai');
                expect(this.player1).not.toHavePromptButton('Doji Challenger');
                expect(this.player1).not.toHavePromptButton('Honored General');
                expect(this.player1).not.toHavePromptButton('Hida Kisada');
                expect(this.player1).not.toHavePromptButton('Forgotten Library');
                expect(this.player1).toHavePromptButton('Don\'t choose a character');

                this.player1.clickPrompt('Hida Guardian');
                expect(this.hidaGuardian.location).toBe('play area');

                expect(this.getChatLogs(2)).toContain('player1 uses Favorable Dealbroker to search their dynasty deck for a character that costs 1 and put it into play');
                expect(this.getChatLogs(1)).toContain('player1 is shuffling their dynasty deck');
            });

            it('should trigger when put into play', function() {
                this.player1.placeCardInProvince(this.brashSamurai, 'province 2');
                this.player1.clickCard(this.brashSamurai);
                this.player1.clickPrompt('0');

                this.advancePhases('conflict');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.brashSamurai],
                    defenders: []
                });
                this.player1.moveCard(this.hidaGuardian, 'dynasty deck');
                this.player1.moveCard(this.dojiWhisperer, 'dynasty deck');

                this.player2.pass();
                this.player1.clickCard(this.charge);
                this.player1.clickCard(this.favorableDealbroker);
                expect(this.player1).toBeAbleToSelect(this.favorableDealbroker);
                this.player1.clickCard(this.favorableDealbroker);

                expect(this.player1).toHavePromptButton('Hida Guardian');
                expect(this.player1).toHavePromptButton('Doji Whisperer');

                this.player1.clickPrompt('Doji Whisperer');
                expect(this.dojiWhisperer.location).toBe('play area');
            });
        });
    });
});
