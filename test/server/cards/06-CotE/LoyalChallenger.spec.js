describe('Loyal Challenger', function() {
    integration(function() {
        describe('Loyal Challenger', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['loyal-challenger']
                    },
                    player2: {
                        inPlay: ['doomed-shugenja']
                    }
                });
                this.loyalChallenger = this.player1.findCardByName('loyal-challenger');
                this.doomedShugenja = this.player2.findCardByName('doomed-shugenja');
            });

            it('should gain 1 honor after winning a conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.loyalChallenger],
                    defenders: [this.doomedShugenja],
                    type: 'political'
                });
                let honor = this.player1.player.honor;
                this.noMoreActions();
                expect(this.player1.player.honor).toBe(honor + 1);
            });

            it('should lose 1 honor after losing a conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.loyalChallenger],
                    defenders: [this.doomedShugenja],
                    type: 'military'
                });
                let honor = this.player1.player.honor;
                this.noMoreActions();
                expect(this.player1.player.honor).toBe(honor - 1);
            });

        });

        describe('when the target leaves play during the duel', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 11,
                        inPlay: ['loyal-challenger']
                    },
                    player2: {
                        honor: 11,
                        inPlay: ['obstinate-recruit']
                    }
                });
                this.loyalChallenger = this.player1.findCardByName('loyal-challenger');
                this.obstinateRecruit = this.player2.findCardByName('obstinate-recruit');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.loyalChallenger],
                    defenders: [this.obstinateRecruit],
                    type: 'political'
                });
                this.player2.pass();
            });

            it('the duel should still successfully resolve with no effect', function() {
                this.player1.clickCard(this.loyalChallenger);
                this.player1.clickCard(this.obstinateRecruit);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('2');
                expect(this.obstinateRecruit.location).toBe('dynasty discard pile');
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });
        });

        describe('Loyal Challenger\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['loyal-challenger']
                    },
                    player2: {
                        inPlay: ['agasha-swordsmith']
                    }
                });
                this.loyalChallenger = this.player1.findCardByName('loyal-challenger');
                this.agashaSwordsmith = this.player2.findCardByName('agasha-swordsmith');
            });

            it('should not be able to be triggered outside of a conflict', function() {
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.loyalChallenger);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('the loser of the duel should be blanked until the end of the conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.loyalChallenger],
                    defenders: [this.agashaSwordsmith],
                    type: 'military'
                });
                this.player2.pass();
                this.player1.clickCard(this.loyalChallenger);
                this.player1.clickCard(this.agashaSwordsmith);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.player2.clickCard(this.agashaSwordsmith);
                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.noMoreActions();
                this.player1.clickPrompt('Don\'t Resolve');
                this.player1.pass();
                expect(this.player2).toHavePrompt('Action Window');
                this.player2.clickCard(this.agashaSwordsmith);
                expect(this.player2).toHavePrompt('Agasha Swordsmith');
            });

        });
    });
});
