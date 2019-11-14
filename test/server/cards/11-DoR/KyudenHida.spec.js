describe('Kyuden Hida', function() {
    integration(function() {
        describe('Kyuden Hida\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        stronghold: 'kyuden-hida',
                        dynastyDiscard: ['imperial-storehouse', 'favorable-ground', 'hida-kisada'],
                        dynastyDeckSize: 4
                    }
                });

                this.storehouse = this.player1.findCardByName('imperial-storehouse');
                this.favorableGround = this.player1.findCardByName('favorable-ground');
                this.kisada = this.player1.findCardByName('hida-kisada');
                this.kyudenHida = this.player1.findCardByName('kyuden-hida');
                this.player1.moveCard(this.storehouse, 'dynasty deck');
                this.player1.moveCard(this.favorableGround, 'dynasty deck');
                this.player1.moveCard(this.kisada, 'dynasty deck');
            });

            it('should allow you to play a dynasty character from the top 3 cards', function() {
                this.player1.clickCard(this.kyudenHida);
                expect(this.player1).toHaveDisabledPromptButton('Imperial Storehouse');
                expect(this.player1).toHaveDisabledPromptButton('Favorable Ground');
                expect(this.player1).toHavePromptButton('Hida Kisada');

                this.player1.clickPrompt('Hida Kisada');
                expect(this.player1).toHavePromptButton('0');
                expect(this.player1).toHavePromptButton('1');
                expect(this.player1).toHavePromptButton('2');
                this.player1.clickPrompt('2');

                expect(this.kisada.location).toBe('play area');
                expect(this.kisada.fate).toBe(2);
            });
        });

        describe('Kyuden Hida\'s ability (non-dynasty)', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        stronghold: 'kyuden-hida',
                        dynastyDiscard: ['imperial-storehouse', 'favorable-ground', 'hida-kisada'],
                        dynastyDeckSize: 4
                    }
                });

                this.storehouse = this.player1.findCardByName('imperial-storehouse');
                this.favorableGround = this.player1.findCardByName('favorable-ground');
                this.kisada = this.player1.findCardByName('hida-kisada');
                this.kyudenHida = this.player1.findCardByName('kyuden-hida');
                this.player1.moveCard(this.storehouse, 'dynasty deck');
                this.player1.moveCard(this.favorableGround, 'dynasty deck');
                this.player1.moveCard(this.kisada, 'dynasty deck');
            });

            it('should not work in phases that are not dynasty', function() {
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.kyudenHida);
                expect(this.player1).toHavePrompt('Action Window');
            });
        });
    });
});
