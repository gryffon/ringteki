describe('Isawa Mori Seido', function() {
    integration(function() {
        describe('Isawa Mori Seido\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        stronghold: 'isawa-mori-seido',
                        inPlay: ['fushicho']
                    },
                    player2: {
                        inPlay: ['bayushi-liar']
                    }
                });
                this.isawaMoriSeido = this.player1.findCardByName('isawa-mori-seido');
                this.fushicho = this.player1.findCardByName('fushicho');
                this.bayushiLiar = this.player2.findCardByName('bayushi-liar');
            });

            it('should bow itself', function() {
                this.player1.clickCard(this.isawaMoriSeido);
                this.player1.clickCard(this.fushicho);
                expect(this.isawaMoriSeido.bowed).toBe(true);
            });

            it('should prompt to choose a target character', function() {
                this.player1.clickCard(this.isawaMoriSeido);
                expect(this.player1).toHavePrompt('Choose a character');
                expect(this.player1).toBeAbleToSelect(this.fushicho);
                expect(this.player1).toBeAbleToSelect(this.bayushiLiar);
            });

            it('should give the chosen character +2 glory', function() {
                this.player1.clickCard(this.isawaMoriSeido);
                this.player1.clickCard(this.fushicho);
                expect(this.fushicho.getGlory()).toBe(2);
            });
        });
    });
});
