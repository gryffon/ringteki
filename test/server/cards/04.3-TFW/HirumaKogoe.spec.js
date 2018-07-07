describe('Hiruma Kogoe', function () {
    integration(function () {
        describe('Hiruma Kogoe\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        inPlay: ['hiruma-kogoe'],
                        hand: [],
                        honor: 5,
                        conflictDeck: ['reprieve','fine-katana','ornate-fan']
                    },
                    player2: {
                        honor:5
                    }
                });
                this.kogoe = this.player1.findCardByName('hiruma-kogoe');
                this.katana = this.player1.findCardByName('fine-katana');
                this.fan = this.player1.findCardByName('ornate-fan');
                this.reprieve = this.player1.findCardByName('reprieve');
            });

            it('should not trigger if no lower honor', function () {
                this.player2.player.honor = 3;
                this.nextPhase();
                expect(this.player1).not.toBeAbleToSelect(this.kogoe);
            });

            it('should trigger if lower honor', function () {
                this.player2.player.honor = 11;
                this.nextPhase();
                expect(this.player1).toBeAbleToSelect(this.kogoe);
            });

            it('should not trigger if even honor', function () {
                this.player2.player.honor = 5;
                this.nextPhase();
                expect(this.player1).not.toBeAbleToSelect(this.kogoe);
            });

            it('should correctly rearrange cards', function () {
                this.player2.player.honor = 11;
                this.nextPhase();
                this.player1.clickCard(this.kogoe);
                expect(this.player1).toHavePrompt('Which card do you want to be on top?');
            });

        });
    });
});
