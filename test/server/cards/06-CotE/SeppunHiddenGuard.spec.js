describe('Seppun Hidden Guard', function() {
    integration(function() {
        describe('Seppun Hidden Guard\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['kudaka', 'seppun-hidden-guard', 'isawa-uona', 'adept-of-the-waves'],
                        hand: ['banzai']
                    },
                    player2: {
                        inPlay: ['mirumoto-raitsugu'],
                        hand: ['assassination']
                    }
                });
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    ring: 'air',
                    attackers: ['kudaka', 'seppun-hidden-guard', 'isawa-uona', 'adept-of-the-waves'],
                    defenders: ['mirumoto-raitsugu']
                });
                this.player1.player.optionSettings.orderForcedAbilities = true;
                this.mirumotoRaitsugu = this.player2.findCardByName('mirumoto-raitsugu');
                this.kudaka = this.player1.findCardByName('kudaka');
                this.seppunHiddenGuard = this.player1.findCardByName('seppun-hidden-guard');
                this.isawaUona = this.player1.findCardByName('isawa-uona');
                this.adeptOfTheWaves = this.player1.findCardByName('adept-of-the-waves');
                this.player1.player.optionSettings.cancelOwnAbilities = true;
            });

            it('it should be able to cancel Raitsugu\'s duel', function() {
                let handSize = this.player2.player.hand.size();
                this.player2.clickCard(this.mirumotoRaitsugu);
                this.player2.clickCard(this.kudaka);
                this.player1.clickCard(this.seppunHiddenGuard);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.seppunHiddenGuard.location).toBe('dynasty discard pile');
                expect(this.player2.player.hand.size()).toBe(handSize - 1);
            });

            it('shouldn\'t trigger for non-unique characters', function() {
                this.player2.clickCard(this.mirumotoRaitsugu);
                this.player2.clickCard(this.adeptOfTheWaves);
                expect(this.player1).toHavePrompt('Honor Bid');
            });

            it('shouldn\'t be able to cancel assassination', function() {
                this.player2.clickCard('assassination');
                this.player2.clickCard(this.isawaUona);
                this.player1.clickCard(this.seppunHiddenGuard);
                expect(this.seppunHiddenGuard.location).not.toBe('dynasty discard pile');
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.isawaUona.location).toBe('dynasty discard pile');
            });

            it('it should be able to cancel your own character\'s abilities', function() {
                let handSize = this.player1.player.hand.size();
                this.player2.pass();
                this.player1.clickCard(this.adeptOfTheWaves);
                this.player1.clickCard(this.kudaka);
                this.player1.clickCard(this.seppunHiddenGuard);
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.seppunHiddenGuard.location).toBe('dynasty discard pile');
                expect(this.player1.player.hand.size()).toBe(handSize - 1);
            });
        });
    });
});
