describe('Doji Fumiki', function() {
    integration(function() {
        describe('Doji Fumiki\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-fumiki','doji-whisperer']
                    },
                    player2: {
                        inPlay: ['akodo-toturi','matsu-berserker']
                    }
                });
                this.fumiki = this.player1.findCardByName('doji-fumiki');
                this.whisperer = this.player1.findCardByName('doji-whisperer');
                this.toturi = this.player2.findCardByName('akodo-toturi');
                this.berserker = this.player2.findCardByName('matsu-berserker');
                this.noMoreActions();
            });

            it('should only target participating characters', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: ['doji-fumiki'],
                    defenders: ['akodo-toturi']
                });
                this.berserker.dishonor();
                this.player2.pass();
                this.player1.clickCard(this.fumiki);
                expect(this.player1).not.toHavePrompt('Doji Fumiki');
            });

            it('should only target dishonored participating characters', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: ['doji-fumiki'],
                    defenders: ['akodo-toturi','matsu-berserker']
                });
                this.berserker.dishonor();
                this.player2.pass();
                this.player1.clickCard(this.fumiki);
                expect(this.player1).toHavePrompt('Doji Fumiki');
                expect(this.player1).toBeAbleToSelect(this.berserker);
                expect(this.player1).not.toBeAbleToSelect(this.toturi);
            });

            it('should correctly bow target character', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: ['doji-fumiki'],
                    defenders: ['akodo-toturi','matsu-berserker']
                });
                this.berserker.dishonor();
                this.player2.pass();
                this.player1.clickCard(this.fumiki);
                this.player1.clickCard(this.berserker);
                expect(this.berserker.bowed).toBe(true);
            });

            it('should not work if she is not participating', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: ['doji-whisperer'],
                    defenders: ['akodo-toturi']
                });
                this.toturi.dishonor();
                this.player2.pass();
                this.player1.clickCard(this.fumiki);
                expect(this.player1).not.toHavePrompt('Doji Fumiki');
            });
        });
    });
});
