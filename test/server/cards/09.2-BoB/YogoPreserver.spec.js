describe('Yogo Preserver', function() {
    integration(function() {
        describe('Yogo Preserver\'s constant ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['yogo-preserver','bayushi-manipulator'],
                        hand: ['calling-in-favors']
                    },
                    player2: {
                        inPlay: ['doji-whisperer'],
                        hand: ['fine-katana','noble-sacrifice','assassination']
                    }
                });
                this.yogoPreserver = this.player1.findCardByName('yogo-preserver');
                this.bayushiManipulator = this.player1.findCardByName('bayushi-manipulator');
                this.callingInFavors = this.player1.findCardByName('calling-in-favors');
                this.dojiWhisperer = this.player2.findCardByName('doji-whisperer');
                this.player1.pass();
                this.fineKatana = this.player2.playAttachment('fine-katana', this.dojiWhisperer);
                this.player1.clickCard(this.callingInFavors);
                this.player1.clickCard(this.fineKatana);
                this.player1.clickCard(this.bayushiManipulator);
            });

            it('should only give sincerity to dishonored characters the player control', function() {
                this.dojiWhisperer.dishonor();
                expect(this.bayushiManipulator.hasSincerity()).toBe(true);
                expect(this.yogoPreserver.hasSincerity()).toBe(false);
                expect(this.dojiWhisperer.hasSincerity()).toBe(false);
            });

            it('should not give sincerity to dishonored characters the player control after he leaves play', function() {
                this.dojiWhisperer.honor();
                this.yogoPreserver.dishonor();
                this.player2.clickCard('noble-sacrifice');
                this.player2.clickCard(this.yogoPreserver);
                this.player2.clickCard(this.dojiWhisperer);
                expect(this.bayushiManipulator.hasSincerity()).toBe(false);
            });

            it('should make the player draw 1 card when dishonored characters leave play', function() {
                let P1hand = this.player1.hand.length;
                this.dojiWhisperer.honor();
                this.player2.clickCard('noble-sacrifice');
                this.player2.clickCard(this.bayushiManipulator);
                this.player2.clickCard(this.dojiWhisperer);
                expect(this.player1.hand.length).toBe(P1hand + 1);
            });
        });
    });
});
