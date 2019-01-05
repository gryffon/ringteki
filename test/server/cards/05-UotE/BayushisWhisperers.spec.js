describe('Bayushi\'s Whisperers', function() {
    integration(function () {
        describe('Bayushi\'s Whisperers', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['bayushi-s-whisperers', 'adept-of-shadows'],
                        hand: ['fine-katana']
                    },
                    player2: {
                    }
                });

                this.bayushisWhisperers = this.player1.findCardByName('bayushi-s-whisperers');
                this.adeptOfShadows = this.player1.findCardByName('adept-of-shadows');
                this.fineKatana = this.player1.findCardByName('fine-katana');
            });

            it('should not allow attachments', function () {
                this.player1.clickCard(this.fineKatana);
                expect(this.player1).toBeAbleToSelect(this.adeptOfShadows);
                expect(this.player1).not.toBeAbleToSelect(this.bayushisWhisperers);
            });
        });

        describe('Bayushi\'s Whisperers\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['bayushi-s-whisperers', 'adept-of-shadows']
                    },
                    player2: {
                        hand: ['assassination', 'fine-katana', 'kami-unleashed']
                    }
                });

                this.bayushisWhisperers = this.player1.findCardByName('bayushi-s-whisperers');
                this.adeptOfShadows = this.player1.findCardByName('adept-of-shadows');
                this.assassination = this.player2.findCardByName('assassination');
                this.fineKatana = this.player2.findCardByName('fine-katana');
                this.kamiUnleashed = this.player2.findCardByName('kami-unleashed');
            });

            it('should not trigger outside a conflict', function () {
                this.player1.clickCard(this.bayushisWhisperers);
                expect(this.player1).toHavePrompt('Initiate an action');
            });

            describe('when activated', function () {
                beforeEach(function () {
                    this.noMoreActions();
                    this.initiateConflict({
                        attackers: [this.adeptOfShadows.id],
                        defenders: []
                    });
                    this.player2.pass();
                    this.spy = spyOn(this.game, 'addMessage');
                    this.player1.clickCard(this.bayushisWhisperers);
                });

                it('should reveal the hand', function () {
                    expect(this.spy).toHaveBeenCalledWith('{0} sees {1}', this.bayushisWhisperers, [this.assassination, this.fineKatana, this.kamiUnleashed]);
                });

                it('should prompt to name a card', function () {
                    expect(this.player1).toHavePrompt('Name a card');
                });

            });

            describe('if it resolves', function () {
                beforeEach(function () {
                    this.noMoreActions();
                    this.initiateConflict({
                        attackers: [this.bayushisWhisperers.id],
                        defenders: []
                    });
                    this.player2.pass();
                    this.player1.clickCard(this.bayushisWhisperers);
                });

                it('opponent should not be able to play copies of events', function() {
                    this.player1.chooseCardInPrompt(this.assassination.name, 'card-name');
                    expect(this.player2).toHavePrompt('Conflict Action Window');
                    this.player2.clickCard(this.assassination);
                    expect(this.player2).toHavePrompt('Conflict Action Window');
                });

                it('opponent should not be able to play copies of attachments', function() {
                    this.player1.chooseCardInPrompt(this.fineKatana.name, 'card-name');
                    expect(this.player2).toHavePrompt('Conflict Action Window');
                    this.player2.clickCard(this.fineKatana);
                    expect(this.player2).toHavePrompt('Conflict Action Window');
                });

                it('opponent should not be able to play copies of characters', function() {
                    this.player1.chooseCardInPrompt(this.kamiUnleashed.name, 'card-name');
                    expect(this.player2).toHavePrompt('Conflict Action Window');
                    this.player2.clickCard(this.kamiUnleashed);
                    expect(this.player2).toHavePrompt('Conflict Action Window');
                });
            });

        });
    });
});
