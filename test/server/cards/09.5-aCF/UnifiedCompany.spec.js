describe('Unified Company', function() {
    integration(function() {
        describe('Unified Company\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['unified-company'],
                        hand: ['fine-katana'],
                        dynastyDiscard: ['solemn-scholar', 'akodo-gunso', 'agasha-taiko', 'borderlands-defender']
                    },
                    player2: {
                        hand: ['banzai', 'fine-katana'],
                        dynastyDiscard: ['brash-samurai']
                    }
                });

                this.unifiedCompany = this.player1.findCardByName('unified-company');
                this.scholar = this.player1.findCardByName('solemn-scholar');
                this.gunso = this.player1.findCardByName('akodo-gunso');
                this.taiko = this.player1.findCardByName('agasha-taiko');
                this.borderlands = this.player1.findCardByName('borderlands-defender');

                this.brash = this.player2.findCardByName('brash-samurai');

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.unifiedCompany],
                    defenders: []
                });
            });

            it('should trigger once the character wins a conflict and the controller has less cards in hand', function() {
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.unifiedCompany);
                this.player1.clickCard(this.unifiedCompany);
                expect(this.player1).toHavePrompt('Unified Company');
            });

            it('should only be able to target non-unique cost 2 or less bushi in your dynasty discard pile', function() {
                this.noMoreActions();
                expect(this.player1).toBeAbleToSelect(this.unifiedCompany);
                this.player1.clickCard(this.unifiedCompany);
                expect(this.player1).toBeAbleToSelect(this.gunso);
                expect(this.player1).not.toBeAbleToSelect(this.taiko);
                expect(this.player1).not.toBeAbleToSelect(this.borderlands);
                expect(this.player1).not.toBeAbleToSelect(this.brash);
                expect(this.player1).not.toBeAbleToSelect(this.scholar);
            });

            it('should put the character into play', function() {
                expect(this.gunso.location).toBe('dynasty discard pile');
                this.noMoreActions();
                expect(this.player1).toBeAbleToSelect(this.unifiedCompany);
                this.player1.clickCard(this.unifiedCompany);
                this.player1.clickCard(this.gunso);
                expect(this.gunso.location).toBe('play area');
                expect(this.gunso.isParticipating()).toBe(false);
            });

            it('should not trigger if you have equal cards in hand', function() {
                this.player2.clickCard('banzai');
                this.player2.clickCard(this.unifiedCompany);
                this.player2.clickPrompt('Done');
                expect(this.player1.player.hand.size()).toBe(1);
                expect(this.player2.player.hand.size()).toBe(1);
                this.noMoreActions();
                expect(this.player1).not.toBeAbleToSelect(this.unifiedCompany);
            });

            it('should not trigger if you have more cards in hand', function() {
                this.player2.clickCard('banzai');
                this.player2.clickCard(this.unifiedCompany);
                this.player2.clickPrompt('Done');
                this.player1.pass();
                this.player2.playAttachment('fine-katana', this.unifiedCompany);
                expect(this.player1.player.hand.size()).toBe(1);
                expect(this.player2.player.hand.size()).toBe(0);
                this.noMoreActions();
                expect(this.player1).not.toBeAbleToSelect(this.unifiedCompany);
            });
        });
    });
});
