describe('Kaiu Forges', function() {
    integration(function() {
        describe('Kaiu Forges ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        dynastyDiscard: ['kaiu-forges', 'imperial-storehouse', 'seventh-tower', 'watchtower-of-valor' ,'favorable-ground', 'ancestral-armory', 'ancestral-shrine', 'hida-kisada', 'artisan-academy', 'forgotten-library', 'hall-of-victories'],
                        dynastyDeckSize: 4
                    }
                });

                this.kaiuForges = this.player1.placeCardInProvince('kaiu-forges', 'province 1');
                this.watchtowerOfValor = this.player1.placeCardInProvince('watchtower-of-valor', 'province 2');
                this.seventhTower = this.player1.findCardByName('seventh-tower');
                this.storehouse = this.player1.findCardByName('imperial-storehouse');
                this.favorableGround = this.player1.findCardByName('favorable-ground');
                this.ancestralArmory = this.player1.findCardByName('ancestral-armory');
                this.ancestralShrine = this.player1.findCardByName('ancestral-shrine');
                this.kisada = this.player1.findCardByName('hida-kisada');
                this.artisanAcademy = this.player1.findCardByName('artisan-academy');
                this.forgottenLibrary = this.player1.findCardByName('forgotten-library');
                this.hallOfVictories = this.player1.findCardByName('hall-of-victories');
                this.player1.moveCard(this.storehouse, 'dynasty deck');
                this.player1.moveCard(this.favorableGround, 'dynasty deck');
                this.player1.moveCard(this.ancestralArmory, 'dynasty deck');
                this.player1.moveCard(this.ancestralShrine, 'dynasty deck');
                this.player1.moveCard(this.kisada, 'dynasty deck');
                this.player1.moveCard(this.artisanAcademy, 'dynasty deck');
                this.player1.moveCard(this.forgottenLibrary, 'dynasty deck');
                this.player1.moveCard(this.hallOfVictories, 'dynasty deck');
                this.player1.moveCard(this.seventhTower, 'dynasty deck');

                this.kaiuForges.facedown = false;
                this.watchtowerOfValor.facedown = false;

                this.p1 = this.player1.findCardByName('shameful-display', 'province 1');
                this.p2 = this.player1.findCardByName('shameful-display', 'province 2');
                this.p3 = this.player1.findCardByName('shameful-display', 'province 3');
                this.p4 = this.player1.findCardByName('shameful-display', 'province 4');
                this.pStronghold = this.player1.findCardByName('shameful-display', 'stronghold province');
            });

            it('should allow you to choose a province when selected', function() {
                expect(this.kaiuForges.location).toBe('province 1');
                this.player1.clickCard(this.kaiuForges);
                expect(this.player1).toHavePrompt('Choose a province');
                expect(this.player1).toBeAbleToSelect(this.p1);
                expect(this.player1).toBeAbleToSelect(this.p2);
                expect(this.player1).toBeAbleToSelect(this.p3);
                expect(this.player1).toBeAbleToSelect(this.p4);
                expect(this.player1).toBeAbleToSelect(this.pStronghold);
            });

            it('should allow you to choose a holding to place in a province', function() {
                expect(this.kaiuForges.location).toBe('province 1');
                this.player1.clickCard(this.kaiuForges);
                expect(this.player1).toHavePrompt('Choose a province');
                this.player1.clickCard(this.p1);
                expect(this.player1).toHavePrompt('Choose a holding to swap with a Kaiu Wall');

                expect(this.player1).toHavePromptButton('Seventh Tower');
                expect(this.player1).toHavePromptButton('Imperial Storehouse');
                expect(this.player1).toHavePromptButton('Favorable Ground');
                expect(this.player1).toHavePromptButton('Ancestral Armory');
                expect(this.player1).toHavePromptButton('Ancestral Shrine');
                expect(this.player1).not.toHavePromptButton('Hida Kisada');
                expect(this.player1).toHavePromptButton('Artisan Academy');
                expect(this.player1).toHavePromptButton('Forgotten Library');
                expect(this.player1).toHavePromptButton('Hall of Victories');
                expect(this.player1).toHavePromptButton('Take nothing');
            });

            it('should allow you to take nothing', function() {
                expect(this.kaiuForges.location).toBe('province 1');
                this.player1.clickCard(this.kaiuForges);
                expect(this.player1).toHavePrompt('Choose a province');
                this.player1.clickCard(this.p1);
                expect(this.player1).toHavePrompt('Choose a holding to swap with a Kaiu Wall');
                expect(this.player1).toHavePromptButton('Take nothing');
                this.player1.clickPrompt('Take nothing');
                expect(this.getChatLogs(3)).toContain('player1 uses Kaiu Forges to look at the top ten cards of their dynasty deck');
                expect(this.getChatLogs(2)).toContain('player1 takes nothing');
                expect(this.getChatLogs(2)).toContain('player1 is shuffling their dynasty deck');
            });

            it('should allow you to choose a Kaiu Wall after choosing a holding', function() {
                expect(this.kaiuForges.location).toBe('province 1');
                this.player1.clickCard(this.kaiuForges);
                expect(this.player1).toHavePrompt('Choose a province');
                this.player1.clickCard(this.p1);
                expect(this.player1).toHavePrompt('Choose a holding to swap with a Kaiu Wall');
                expect(this.player1).toHavePromptButton('Forgotten Library');
                this.player1.clickPrompt('Forgotten Library');
                expect(this.player1).toHavePrompt('Choose a holding');
                expect(this.player1).toBeAbleToSelect(this.kaiuForges);
                this.player1.clickCard(this.kaiuForges);
                expect(this.kaiuForges.location).toBe('dynasty deck');
                expect(this.forgottenLibrary.location).toBe('province 1');

                expect(this.getChatLogs(3)).toContain('player1 uses Kaiu Forges to look at the top ten cards of their dynasty deck');
                expect(this.getChatLogs(2)).toContain('player1 chooses to replace Kaiu Forges with Forgotten Library');
                expect(this.getChatLogs(2)).toContain('player1 is shuffling their dynasty deck');
            });

            it('should allow you to choose a province without a kaiu wall to shuffle your deck', function() {
                expect(this.kaiuForges.location).toBe('province 1');
                this.player1.clickCard(this.kaiuForges);
                expect(this.player1).toHavePrompt('Choose a province');
                this.player1.clickCard(this.p3);
                expect(this.player1).toHavePrompt('Choose a holding to swap with a Kaiu Wall');
                expect(this.player1).toHavePromptButton('Forgotten Library');
                this.player1.clickPrompt('Forgotten Library');

                expect(this.getChatLogs(3)).toContain('player1 uses Kaiu Forges to look at the top ten cards of their dynasty deck');
                expect(this.getChatLogs(2)).toContain('player1 cannot put a holding into play because there is no Kaiu Wall in the selected province');
                expect(this.getChatLogs(2)).toContain('player1 is shuffling their dynasty deck');
            });
        });
    });
});
