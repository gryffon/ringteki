describe('Champions of Yomi', function() {
    integration(function() {
        describe('when in play', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['champions-of-yomi'],
                        hand: ['fine-katana']
                    },
                    player2: {}
                });
                this.fineKatana = this.player1.findCardByName('fine-katana');
                this.championsOfYomi = this.player1.findCardByName('champions-of-yomi');
            });

            it('should not allow non-Spirit attachments', function() {
                this.player1.clickCard(this.fineKatana);
                expect(this.player1).not.toBeAbleToSelect(this.championsOfYomi);
            });

            it('should remain in play at the end of the phase', function() {
                this.nextPhase();
                expect(this.championsOfYomi.location).toBe('play area');
            });
        });

        describe('when in attacking player\'s discard and the conflict resolves', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        stronghold: 'yojin-no-shiro',
                        inPlay: ['miwaku-kabe-guard'],
                        hand: ['spreading-the-darkness'],
                        dynastyDiscard: ['champions-of-yomi']
                    },
                    player2: {
                        fate: 20,
                        inPlay: ['kakita-toshimoko', 'yoritomo'],
                        hand: ['assassination', 'fallen-in-battle']
                    }
                });
                this.yojinNoShiro = this.player1.findCardByName('yojin-no-shiro');
                this.championsOfYomi = this.player1.findCardByName('champions-of-yomi', 'dynasty discard pile');
                this.miwakuKabeGuard = this.player1.findCardByName('miwaku-kabe-guard');
                this.spreadingTheDarkness = this.player1.findCardByName('spreading-the-darkness');
                this.kakitaToshimoko = this.player2.findCardByName('kakita-toshimoko');
                this.yoritomo = this.player2.findCardByName('yoritomo');
                this.assassination = this.player2.findCardByName('assassination');
                this.fallenInBattle = this.player2.findCardByName('fallen-in-battle');
                this.noMoreActions();
                this.initiateConflict({
                    ring: 'water',
                    attackers: [this.miwakuKabeGuard],
                    defenders: [this.kakitaToshimoko]
                });
            });

            it('should be put into play when triggered after losing', function() {
                this.noMoreActions();
                expect(this.player1).toBeAbleToSelect(this.championsOfYomi);
                this.player1.clickCard(this.championsOfYomi);
                expect(this.player1).toBeAbleToSelect(this.yojinNoShiro);
                this.player1.clickCard(this.yojinNoShiro);
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.yojinNoShiro.bowed).toBe(true);
                expect(this.championsOfYomi.location).toBe('play area');
                expect(this.championsOfYomi.bowed).toBe(false);
            });

            it('should be removed from the game at the end of the phase after being triggered', function() {
                this.noMoreActions();
                expect(this.player1).toBeAbleToSelect(this.championsOfYomi);
                this.player1.clickCard(this.championsOfYomi);
                expect(this.player1).toBeAbleToSelect(this.yojinNoShiro);
                this.player1.clickCard(this.yojinNoShiro);
                this.nextPhase();
                expect(this.championsOfYomi.location).toBe('removed from game');
            });

            it('should not be removed from the game at the end of the phase after being triggered and leaving play', function() {
                this.noMoreActions();
                expect(this.player1).toBeAbleToSelect(this.championsOfYomi);
                this.player1.clickCard(this.championsOfYomi);
                expect(this.player1).toBeAbleToSelect(this.yojinNoShiro);
                this.player1.clickCard(this.yojinNoShiro);
                expect(this.player1).toHavePrompt('Action Window');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    ring: 'fire',
                    attackers: [this.yoritomo],
                    defenders: [this.championsOfYomi]
                });
                this.noMoreActions();
                expect(this.player2).toBeAbleToSelect(this.fallenInBattle);
                this.player2.clickCard(this.fallenInBattle);
                expect(this.player2).toBeAbleToSelect(this.championsOfYomi);
                this.player2.clickCard(this.championsOfYomi);
                expect(this.championsOfYomi.location).toBe('dynasty discard pile');
                this.player2.clickPrompt('No'); // Do you wish to discard after breaking
                this.player2.clickPrompt('Don\'t Resolve');
                this.nextPhase();
                expect(this.championsOfYomi.location).toBe('dynasty discard pile');
            });

            it('should not be able to trigger when stronghold is bowed', function() {
                this.player2.pass();
                this.player1.clickCard(this.yojinNoShiro);
                expect(this.yojinNoShiro.bowed).toBe(true);
                this.noMoreActions();
                expect(this.player1).not.toBeAbleToSelect(this.championsOfYomi);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should not be able to trigger when there is no attacker', function() {
                this.player2.clickCard(this.assassination);
                this.player2.clickCard(this.miwakuKabeGuard);
                expect(this.miwakuKabeGuard.location).toBe('dynasty discard pile');
                this.noMoreActions();
                expect(this.player1).not.toBeAbleToSelect(this.championsOfYomi);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should not be able to trigger when winning', function() {
                this.player2.pass();
                this.player1.clickCard(this.spreadingTheDarkness);
                expect(this.player1).toBeAbleToSelect(this.miwakuKabeGuard);
                this.player1.clickCard(this.miwakuKabeGuard);
                this.noMoreActions();
                expect(this.player1).not.toBeAbleToSelect(this.championsOfYomi);
                expect(this.player1).toHavePrompt('Water Ring');
            });
        });

        describe('when in defending player\'s discard and the conflict resolves', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['brash-samurai']
                    },
                    player2: {
                        stronghold: 'yojin-no-shiro',
                        inPlay: ['miwaku-kabe-guard'],
                        dynastyDiscard: ['champions-of-yomi']
                    }
                });
                this.brashSamurai = this.player1.findCardByName('brash-samurai');
                this.championsOfYomi = this.player2.findCardByName('champions-of-yomi', 'dynasty discard pile');
                this.miwakuKabeGuard = this.player2.findCardByName('miwaku-kabe-guard');
                this.noMoreActions();
                this.initiateConflict({
                    ring: 'water',
                    attackers: [this.brashSamurai],
                    defenders: [this.miwakuKabeGuard]
                });
            });

            it('should not be able to trigger when losing', function() {
                this.noMoreActions();
                expect(this.player2).not.toBeAbleToSelect(this.championsOfYomi);
                expect(this.player1).toHavePrompt('Water Ring');
            });
        });
    });
});
