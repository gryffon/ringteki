describe('Kyuden Hida', function() {
    integration(function() {
        describe('Kyuden Hida\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        stronghold: 'kyuden-hida',
                        dynastyDiscard: ['imperial-storehouse', 'favorable-ground', 'hida-kisada', 'borderlands-defender', 'hida-guardian'],
                        dynastyDeckSize: 4
                    }
                });

                this.storehouse = this.player1.findCardByName('imperial-storehouse');
                this.favorableGround = this.player1.findCardByName('favorable-ground');
                this.kisada = this.player1.findCardByName('hida-kisada');
                this.borderlands = this.player1.findCardByName('borderlands-defender');
                this.hidaGuardian = this.player1.findCardByName('hida-guardian');
                this.kyudenHida = this.player1.findCardByName('kyuden-hida');
                this.player1.moveCard(this.borderlands, 'dynasty deck');
                this.player1.moveCard(this.hidaGuardian, 'dynasty deck');
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
                expect(this.storehouse.location).toBe('dynasty discard pile');
                expect(this.favorableGround.location).toBe('dynasty discard pile');
                expect(this.borderlands.location).toBe('dynasty deck');
                expect(this.hidaGuardian.location).toBe('dynasty deck');
                expect(this.getChatLogs(2)).toContain('player1 plays Hida Kisada with 2 additional fate');
                expect(this.getChatLogs(2)).toContain('player1 discards Favorable Ground, Imperial Storehouse');
            });

            it('should discard all 3 cards if none are taken', function() {
                this.player1.clickCard(this.kyudenHida);
                expect(this.player1).toHaveDisabledPromptButton('Imperial Storehouse');
                expect(this.player1).toHaveDisabledPromptButton('Favorable Ground');
                expect(this.player1).toHavePromptButton('Hida Kisada');

                this.player1.clickPrompt('Take nothing');
                expect(this.kisada.location).toBe('dynasty discard pile');
                expect(this.storehouse.location).toBe('dynasty discard pile');
                expect(this.favorableGround.location).toBe('dynasty discard pile');
                expect(this.borderlands.location).toBe('dynasty deck');
                expect(this.hidaGuardian.location).toBe('dynasty deck');
                expect(this.getChatLogs(2)).toContain('player1 chooses not to play a character');
                expect(this.getChatLogs(2)).toContain('player1 discards Hida Kisada, Favorable Ground, Imperial Storehouse');
            });

            it('should discard all 3 cards if prompt is cancelled', function() {
                this.player1.clickCard(this.kyudenHida);
                expect(this.player1).toHaveDisabledPromptButton('Imperial Storehouse');
                expect(this.player1).toHaveDisabledPromptButton('Favorable Ground');
                expect(this.player1).toHavePromptButton('Hida Kisada');

                this.player1.clickPrompt('Hida Kisada');
                expect(this.player1).toHavePromptButton('0');
                expect(this.player1).toHavePromptButton('1');
                expect(this.player1).toHavePromptButton('2');
                expect(this.player1).toHavePromptButton('Cancel');
                this.player1.clickPrompt('Cancel');

                expect(this.kisada.location).toBe('dynasty discard pile');
                expect(this.storehouse.location).toBe('dynasty discard pile');
                expect(this.favorableGround.location).toBe('dynasty discard pile');
                expect(this.borderlands.location).toBe('dynasty deck');
                expect(this.hidaGuardian.location).toBe('dynasty deck');
                expect(this.getChatLogs(2)).toContain('player1 chooses not to play a character');
                expect(this.getChatLogs(2)).toContain('player1 discards Hida Kisada, Favorable Ground, Imperial Storehouse');
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
