describe('Gift of Amaterasu', function() {
    integration(function() {
        describe('Gift of Amaterasu\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['akodo-toturi','matsu-berserker'],
                        hand: ['gift-of-amaterasu']
                    },
                    player2: {
                        inPlay: ['doji-whisperer'],
                        hand: ['banzai']
                    }
                });
                this.toturi = this.player1.findCardByName('akodo-toturi');
                this.berserker = this.player1.findCardByName('matsu-berserker');
                this.gift = this.player1.findCardByName('gift-of-amaterasu');
                this.whisperer = this.player2.findCardByName('doji-whisperer');

                this.noMoreActions();
            });

            describe('During a conflict', function() {
                beforeEach(function() {
                    this.initiateConflict({
                        attackers: [this.toturi],
                        defenders: [this.whisperer]
                    });
                    this.player2.pass();
                    this.player1.pass();
                });

                it('should trigger if won  by 5 or more skill', function() {
                    this.player1.clickCard(this.gift);
                    expect(this.player1).toHavePrompt('Gift of Amaterasu');
                });

                it('should target correct characters', function() {
                    this.player1.clickCard(this.gift);
                    expect(this.player1).toBeAbleToSelect(this.toturi);
                    expect(this.player1).toBeAbleToSelect(this.berserker);
                    expect(this.player1).not.toBeAbleToSelect(this.whisperer);
                });

                it('should honor selected character', function() {
                    this.player1.clickCard(this.gift);
                    this.player1.clickCard(this.toturi);
                    expect(this.toturi.isHonored).toBe(true);
                });
            });

            it('should trigger if won  by 5 or more skill', function() {
                this.initiateConflict({
                    attackers: [this.toturi],
                    defenders: [this.whisperer],
                    type: 'political'
                });
                this.player2.pass();
                this.player1.pass();
                this.player1.clickCard(this.gift);
                expect(this.player1).not.toHavePrompt('Gift of Amaterasu');
            });
        });
    });
});
