describe('Yasuki Fuzake', function() {
    integration(function() {
        describe('Yasuki Fuzake\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['yasuki-fuzake','eager-scout']
                    },
                    player2: {
                        inPlay: ['asahina-storyteller', 'doji-challenger', 'callow-delegate'],
                        hand: ['noble-sacrifice']
                    }
                });
                this.yasukiFuzake = this.player1.findCardByName('yasuki-fuzake');
                this.eagerScout = this.player1.findCardByName('eager-scout');

                this.callowDelegate = this.player2.findCardByName('callow-delegate');
                this.dojiChallenger = this.player2.findCardByName('doji-challenger');
                this.asahinaStoryteller = this.player2.findCardByName('asahina-storyteller');
                this.dojiChallenger.honor();
                this.eagerScout.honor();
                this.asahinaStoryteller.honor();
                this.yasukiFuzake.dishonor();
            });

            it('should trigger when leaving play', function() {
                this.player1.pass();
                expect(this.dojiChallenger.isHonored).toBe(true);
                expect(this.yasukiFuzake.isDishonored).toBe(true);
                this.player2.clickCard('noble-sacrifice');
                this.player2.clickCard(this.yasukiFuzake);
                this.player2.clickCard(this.dojiChallenger);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.yasukiFuzake);
                expect(this.yasukiFuzake.location).not.toBe('dynasty discard pile');
            });
        });
    });
});
