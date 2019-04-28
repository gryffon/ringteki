describe('Doji Shigeru', function() {
    integration(function() {
        describe('Doji Shigeru\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-shigeru']
                    },
                    player2: {
                        inPlay: ['kaiu-envoy'],
                        hand: ['fine-katana','kami-unleashed','banzai','court-games']
                    }
                });
                this.dojiShigeru = this.player1.findCardByName('doji-shigeru');

                this.kaiuEnvoy = this.player2.findCardByName('kaiu-envoy');

                this.fineKatana = this.player2.findCardByName('fine-katana');
                this.kamiUnleashed = this.player2.findCardByName('kami-unleashed');
                this.banzai = this.player2.findCardByName('banzai');
                this.courtGames = this.player2.findCardByName('court-games');

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.dojiShigeru],
                    defenders: [this.kaiuEnvoy],
                    type: 'political'
                });
            });

            it('should trigger when the opponent plays an event', function() {
                this.player2.clickCard(this.banzai);
                this.player2.clickCard(this.kaiuEnvoy);
                this.player2.clickPrompt('Done');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.dojiShigeru);
            });

            it('should not trigger when the opponent plays an attachment', function() {
                this.player2.clickCard(this.fineKatana);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
            });

            it('should not trigger when the opponent plays a conflict character', function() {
                this.player2.clickCard(this.kamiUnleashed);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
            });

            describe('if triggered', function() {
                beforeEach(function() {
                    this.player2.clickCard(this.banzai);
                    this.player2.clickCard(this.kaiuEnvoy);
                    this.player2.clickPrompt('Done');
                    this.player1.clickCard(this.dojiShigeru);
                });

                it('should prompt to choose a card from hand', function() {
                    expect(this.player2).toHavePrompt('Choose a card to discard');
                    expect(this.player2).toBeAbleToSelect(this.fineKatana);
                    expect(this.player2).toBeAbleToSelect(this.kamiUnleashed);
                    expect(this.player2).toBeAbleToSelect(this.courtGames);
                });

                it('should discard the chosen card', function() {
                    this.player2.clickCard(this.fineKatana);
                    expect(this.fineKatana.location).toBe('conflict discard pile');
                });

                it('should be able to be triggered again', function() {
                    this.player2.clickCard(this.fineKatana);
                    this.player1.pass();
                    this.player2.clickCard(this.courtGames);
                    this.player2.clickPrompt('Honor a friendly character');
                    this.player2.clickCard(this.kaiuEnvoy);
                    expect(this.player1).toHavePrompt('Triggered Abilities');
                    expect(this.player1).toBeAbleToSelect(this.dojiShigeru);
                });
            });
        });
    });
});
