describe('Callous Ashigaru', function() {
    integration(function() {
        describe('Callous Ashigaru', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['borderlands-defender', 'kuni-yori'],
                        hand: ['callous-ashigaru']
                    },
                    player2: {
                        inPlay: ['doji-hotaru', 'wandering-ronin']
                    }
                });

                this.borderlandsDefender = this.player1.findCardByName('borderlands-defender');
                this.kuniYori = this.player1.findCardByName('kuni-yori');
                this.callousAshigaru = this.player1.findCardByName('callous-ashigaru');

                this.dojiHotaru = this.player2.findCardByName('doji-hotaru');
                this.wanderingRonin = this.player2.findCardByName('wandering-ronin');
            });

            it('should only be able to attach to unique characters', function() {
                this.player1.clickCard(this.callousAshigaru);
                expect(this.player1).toHavePrompt('Callous Ashigaru');
                expect(this.player1).not.toBeAbleToSelect(this.borderlandsDefender);
                expect(this.player1).toBeAbleToSelect(this.kuniYori);
                expect(this.player1).toBeAbleToSelect(this.dojiHotaru);
                expect(this.player1).not.toBeAbleToSelect(this.wanderingRonin);
            });
        });

        describe('Callous Ashigaru\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['kuni-yori', 'kuni-ritsuko'],
                        hand: ['callous-ashigaru']
                    }
                });

                this.kuniYori = this.player1.findCardByName('kuni-yori');
                this.kuniRitsuko = this.player1.findCardByName('kuni-ritsuko');
                this.callousAshigaru = this.player1.findCardByName('callous-ashigaru');

                this.player1.clickCard(this.callousAshigaru);
                this.player1.clickCard(this.kuniYori);
            });

            it('should not trigger after you break in a political conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.kuniYori],
                    defenders: [],
                    type: 'political'
                });
                this.noMoreActions();
                this.player1.clickPrompt('No');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).toHavePrompt('Air Ring');
            });

            it('should not trigger if attached character is not participating', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.kuniRitsuko],
                    defenders: []
                });
                this.noMoreActions();
                this.player1.clickPrompt('No');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).toHavePrompt('Air Ring');
            });

            it('should trigger when you break the province and attached character is participating', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.kuniYori],
                    defenders: []
                });
                this.noMoreActions();
                this.player1.clickPrompt('No');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.callousAshigaru);
            });

            it('should discard all cards in the opponent\'s provinces', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.kuniYori],
                    defenders: []
                });
                this.noMoreActions();
                this.player1.clickPrompt('No');
                this.player1.clickCard(this.callousAshigaru);
                expect(this.getChatLogs(1)).toContain('player1 uses Callous Ashigaru to discard Adept of the Waves, Adept of the Waves, Adept of the Waves and Adept of the Waves');
                expect(this.player2.player.dynastyDiscardPile.size()).toBe(4);
                expect(this.player1.player.dynastyDiscardPile.size()).toBe(0);
            });
        });
    });
});

