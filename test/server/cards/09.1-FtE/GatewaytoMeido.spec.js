describe('Gateway to Meido', function() {
    integration(function() {
        describe('Gateway to Meidoi\'s constant ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doomed-shugenja']
                    },
                    player2: {
                        provinces: ['gateway-to-meido'],
                        dynastyDiscard: ['doji-whisperer']
                    }
                });
                this.doomedShugenja = this.player1.findCardByName('doomed-shugenja');
                this.dojiWhisperer = this.player2.findCardByName('doji-whisperer', 'dynasty discard pile');
                this.gatewayToMeido = this.player2.findCardByName('gateway-to-meido', 'province 1');
                this.shamefulDisplay = this.player2.findCardByName('shameful-display', 'province 2');
            });

            it('should allow you to play characters from dynasty discard pile', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.doomedShugenja],
                    defenders: [],
                    province: this.gatewayToMeido
                });
                this.player2.clickCard(this.dojiWhisperer);
                expect(this.player2).toHavePrompt('Choose additional fate');
            });

            it('should only allow you to play characters into the conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.doomedShugenja],
                    defenders: [],
                    province: this.gatewayToMeido
                });
                this.player2.clickCard(this.dojiWhisperer);
                this.player2.clickPrompt('1');
                expect(this.player2).not.toHavePrompt('"Where do you wish to play this character?');
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.dojiWhisperer.location).toBe('play area');
                expect(this.dojiWhisperer.isParticipating()).toBe(true);
                expect(this.dojiWhisperer.fate).toBe(1);
            });

            it('should not be active when conflict is not at this province', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.doomedShugenja],
                    defenders: [],
                    province: this.shamefulDisplay
                });
                this.player2.clickCard(this.dojiWhisperer);
                expect(this.player2).not.toHavePrompt('Choose additional fate');
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });
        });
    });
});
