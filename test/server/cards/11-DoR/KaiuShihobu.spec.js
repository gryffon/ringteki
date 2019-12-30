describe('Kaiu Shihobu', function() {
    integration(function() {
        describe('Kaiu Shihobu\'s abilities', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        dynastyDiscard: ['imperial-storehouse', 'favorable-ground', 'ancestral-armory', 'ancestral-shrine', 'hida-kisada', 'kaiu-shihobu', 'artisan-academy', 'forgotten-library', 'hall-of-victories'],
                        dynastyDeckSize: 4
                    }
                });

                this.storehouse = this.player1.findCardByName('imperial-storehouse');
                this.favorableGround = this.player1.findCardByName('favorable-ground');
                this.ancestralArmory = this.player1.findCardByName('ancestral-armory');
                this.ancestralShrine = this.player1.findCardByName('ancestral-shrine');
                this.kisada = this.player1.findCardByName('hida-kisada');
                this.shamefulDisplay = this.player1.findCardByName('shameful-display', 'province 1');

                this.artisanAcademy = this.player1.findCardByName('artisan-academy');
                this.forgottenLibrary = this.player1.findCardByName('forgotten-library');
                this.hallOfVictories = this.player1.findCardByName('hall-of-victories');

                this.kaiuShihobu = this.player1.placeCardInProvince('kaiu-shihobu');

                this.player1.moveCard(this.storehouse, 'dynasty deck');
                this.player1.moveCard(this.favorableGround, 'dynasty deck');
                this.player1.moveCard(this.ancestralArmory, 'dynasty deck');
                this.player1.moveCard(this.ancestralShrine, 'dynasty deck');
                this.player1.moveCard(this.kisada, 'dynasty deck');
            });

            it('should trigger when played in dynasty', function() {
                this.player1.clickCard(this.kaiuShihobu);
                this.player1.clickPrompt('0');
                expect(this.player1).toBeAbleToSelect(this.kaiuShihobu);
            });

            it('should allow you to select holdings from your dynasty deck when triggered', function() {
                this.player1.clickCard(this.kaiuShihobu);
                this.player1.clickPrompt('0');
                expect(this.player1).toBeAbleToSelect(this.kaiuShihobu);
                this.player1.clickCard(this.kaiuShihobu);
                expect(this.player1).toHavePrompt('Select all cards to reveal');

                expect(this.player1).toHavePromptButton('Imperial Storehouse');
                expect(this.player1).toHavePromptButton('Favorable Ground');
                expect(this.player1).toHavePromptButton('Ancestral Armory');
                expect(this.player1).toHavePromptButton('Ancestral Shrine');
                expect(this.player1).not.toHavePromptButton('Hida Kisada');
                expect(this.player1).toHavePromptButton('Take nothing');

                this.player1.clickPrompt('Imperial Storehouse');
                expect(this.player1).not.toHavePromptButton('Imperial Storehouse');
                expect(this.player1).not.toHavePromptButton('Take nothing');
                expect(this.player1).toHavePromptButton('Done');
                this.player1.clickPrompt('Favorable Ground');
                this.player1.clickPrompt('Ancestral Armory');
                this.player1.clickPrompt('Done');

                expect(this.storehouse.location).toBe('underneath stronghold');
                expect(this.favorableGround.location).toBe('underneath stronghold');
                expect(this.ancestralArmory.location).toBe('underneath stronghold');
                expect(this.ancestralShrine.location).not.toBe('underneath stronghold');

                expect(this.getChatLogs(2)).toContain('player1 selects Ancestral Armory, Favorable Ground, Imperial Storehouse');
                expect(this.getChatLogs(1)).toContain('player1 is shuffling their dynasty deck');
            });

            it('holdings underneath stronghold should be hidden to player2', function() {
                this.player1.clickCard(this.kaiuShihobu);
                this.player1.clickPrompt('0');
                expect(this.player1).toBeAbleToSelect(this.kaiuShihobu);
                this.player1.clickCard(this.kaiuShihobu);

                this.player1.clickPrompt('Imperial Storehouse');
                this.player1.clickPrompt('Favorable Ground');
                this.player1.clickPrompt('Ancestral Armory');
                this.player1.clickPrompt('Done');

                expect(this.storehouse.location).toBe('underneath stronghold');
                expect(this.favorableGround.location).toBe('underneath stronghold');
                expect(this.ancestralArmory.location).toBe('underneath stronghold');
                expect(this.ancestralShrine.location).not.toBe('underneath stronghold');

                expect(this.storehouse.anyEffect('hideWhenFaceUp')).toBe(true);
                expect(this.favorableGround.anyEffect('hideWhenFaceUp')).toBe(true);
                expect(this.ancestralArmory.anyEffect('hideWhenFaceUp')).toBe(true);
            });

            it('should allow you to put into play a holding that has been put underneath your stronghold', function() {
                this.player1.clickCard(this.kaiuShihobu);
                this.player1.clickPrompt('0');
                expect(this.player1).toBeAbleToSelect(this.kaiuShihobu);
                this.player1.clickCard(this.kaiuShihobu);

                this.player1.clickPrompt('Imperial Storehouse');
                this.player1.clickPrompt('Favorable Ground');
                this.player1.clickPrompt('Ancestral Armory');
                this.player1.clickPrompt('Done');

                expect(this.storehouse.location).toBe('underneath stronghold');
                expect(this.favorableGround.location).toBe('underneath stronghold');
                expect(this.ancestralArmory.location).toBe('underneath stronghold');
                expect(this.ancestralShrine.location).not.toBe('underneath stronghold');

                this.player2.pass();
                this.player1.clickCard(this.kaiuShihobu);
                expect(this.player1).toBeAbleToSelect(this.storehouse);
                expect(this.player1).toBeAbleToSelect(this.favorableGround);
                expect(this.player1).toBeAbleToSelect(this.ancestralArmory);

                this.currentCard = this.player1.player.getDynastyCardInProvince('province 1');

                this.player1.clickCard(this.storehouse);
                this.player1.clickCard(this.shamefulDisplay);
                expect(this.storehouse.location).toBe('province 1');
                expect(this.storehouse.facedown).toBe(false);

                expect(this.getChatLogs(1)).toContain('player1 uses Kaiu Shihobu to discard ' + this.currentCard.name + ', replacing it with a facedown holding');
            });

            it('should discard multiple cards if multiple cards are in the province', function() {
                this.player1.clickCard(this.kaiuShihobu);
                this.player1.clickPrompt('0');
                expect(this.player1).toBeAbleToSelect(this.kaiuShihobu);
                this.player1.clickCard(this.kaiuShihobu);

                this.player1.clickPrompt('Imperial Storehouse');
                this.player1.clickPrompt('Favorable Ground');
                this.player1.clickPrompt('Ancestral Armory');
                this.player1.clickPrompt('Done');

                expect(this.storehouse.location).toBe('underneath stronghold');
                expect(this.favorableGround.location).toBe('underneath stronghold');
                expect(this.ancestralArmory.location).toBe('underneath stronghold');
                expect(this.ancestralShrine.location).not.toBe('underneath stronghold');

                this.player1.moveCard(this.artisanAcademy, 'province 1');
                this.player1.moveCard(this.hallOfVictories, 'province 1');
                this.player1.moveCard(this.forgottenLibrary, 'province 1');

                this.player2.pass();
                this.player1.clickCard(this.kaiuShihobu);
                expect(this.player1).toBeAbleToSelect(this.storehouse);
                expect(this.player1).toBeAbleToSelect(this.favorableGround);
                expect(this.player1).toBeAbleToSelect(this.ancestralArmory);

                this.currentCards = this.player1.player.getDynastyCardsInProvince('province 1');

                this.player1.clickCard(this.storehouse);
                this.player1.clickCard(this.shamefulDisplay);
                expect(this.storehouse.location).toBe('province 1');
                expect(this.storehouse.facedown).toBe(false);

                expect(this.getChatLogs(1)).toContain('player1 uses Kaiu Shihobu to discard ' + this.currentCards.map(e => e.name).sort().join(', ') + ', replacing it with a facedown holding');
            });
        });

        describe('Kaiu Shihobu\'s abilities (edge cases)', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        dynastyDiscard: ['imperial-storehouse', 'favorable-ground', 'ancestral-armory', 'ancestral-shrine', 'hida-kisada', 'kaiu-shihobu', 'artisan-academy', 'forgotten-library', 'hall-of-victories', 'kaiu-shihobu'],
                        inPlay: ['kitsuki-kagi'],
                        hand: ['forebearer-s-echoes'],
                        dynastyDeckSize: 4
                    },
                    player2: {
                        inPlay: ['doji-kuwanan'],
                        hand: ['way-of-the-crane', 'way-of-the-scorpion', 'noble-sacrifice']
                    }
                });

                this.storehouse = this.player1.findCardByName('imperial-storehouse');
                this.favorableGround = this.player1.findCardByName('favorable-ground');
                this.ancestralArmory = this.player1.findCardByName('ancestral-armory');
                this.ancestralShrine = this.player1.findCardByName('ancestral-shrine');
                this.kisada = this.player1.findCardByName('hida-kisada');
                this.shamefulDisplay = this.player1.findCardByName('shameful-display', 'province 1');

                this.artisanAcademy = this.player1.findCardByName('artisan-academy');
                this.forgottenLibrary = this.player1.findCardByName('forgotten-library');
                this.hallOfVictories = this.player1.findCardByName('hall-of-victories');

                this.kaiuShihobu = this.player1.filterCardsByName('kaiu-shihobu')[0];
                this.kaiuShihobu2 = this.player1.filterCardsByName('kaiu-shihobu')[1];
                this.player1.placeCardInProvince(this.kaiuShihobu);
                this.kagi = this.player1.findCardByName('kitsuki-kagi');
                this.echoes = this.player1.findCardByName('forebearer-s-echoes');

                this.kuwanan = this.player2.findCardByName('doji-kuwanan');
                this.crane = this.player2.findCardByName('way-of-the-crane');
                this.scorpion = this.player2.findCardByName('way-of-the-scorpion');
                this.nobleSac = this.player2.findCardByName('noble-sacrifice');

                this.player1.moveCard(this.storehouse, 'dynasty deck');
                this.player1.moveCard(this.favorableGround, 'dynasty deck');
                this.player1.moveCard(this.ancestralArmory, 'dynasty deck');
                this.player1.moveCard(this.ancestralShrine, 'dynasty deck');
                this.player1.moveCard(this.kisada, 'dynasty deck');

                this.player1.clickCard(this.kaiuShihobu);
                this.player1.clickPrompt('0');
                this.player1.clickCard(this.kaiuShihobu);

                this.player1.clickPrompt('Imperial Storehouse');
                this.player1.clickPrompt('Favorable Ground');
                this.player1.clickPrompt('Ancestral Armory');
                this.player1.clickPrompt('Done');

                this.advancePhases('conflict');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.kagi, this.kaiuShihobu],
                    defenders: [this.kuwanan]
                });
            });

            // it('should not allow you to put into play a holding that has been removed from game via another card', function() {
            //     this.noMoreActions();
            //     expect(this.player1).toBeAbleToSelect(this.kagi);
            //     this.player1.clickCard(this.kagi);
            //     expect(this.player1).toBeAbleToSelect(this.artisanAcademy);
            //     expect(this.player1).toBeAbleToSelect(this.hallOfVictories);
            //     expect(this.player1).toBeAbleToSelect(this.forgottenLibrary);

            //     this.player1.clickCard(this.artisanAcademy);
            //     this.player1.clickCard(this.hallOfVictories);
            //     this.player1.clickCard(this.forgottenLibrary);

            //     expect(this.artisanAcademy.location).toBe('underneath stronghold');
            //     expect(this.hallOfVictories.location).toBe('underneath stronghold');
            //     expect(this.forgottenLibrary.location).toBe('underneath stronghold');

            //     this.player1.clickPrompt('Don\'t Resolve');
            //     expect(this.player1).toHavePrompt('Action Window');

            //     this.player1.clickCard(this.kaiuShihobu);
            //     expect(this.player1).toBeAbleToSelect(this.storehouse);
            //     expect(this.player1).toBeAbleToSelect(this.favorableGround);
            //     expect(this.player1).toBeAbleToSelect(this.ancestralArmory);
            //     expect(this.player1).not.toBeAbleToSelect(this.artisanAcademy);
            //     expect(this.player1).not.toBeAbleToSelect(this.hallOfVictories);
            //     expect(this.player1).not.toBeAbleToSelect(this.forgottenLibrary);
            // });

            it('should work if a new Shihobu comes into play', function() {
                this.player1.moveCard(this.artisanAcademy, 'dynasty deck');
                this.player1.moveCard(this.hallOfVictories, 'dynasty deck');
                this.player1.moveCard(this.forgottenLibrary, 'dynasty deck');

                this.player2.clickCard(this.crane);
                this.player2.clickCard(this.kuwanan);
                this.player1.pass();
                this.player2.clickCard(this.scorpion);
                this.player2.clickCard(this.kaiuShihobu);
                this.player1.pass();
                this.player2.clickCard(this.nobleSac);
                this.player2.clickCard(this.kaiuShihobu);
                this.player2.clickCard(this.kuwanan);

                this.player1.clickCard(this.echoes);
                this.player1.clickCard(this.kaiuShihobu2);
                this.player1.clickCard(this.kaiuShihobu2);
                this.player1.clickPrompt('Artisan Academy');
                this.player1.clickPrompt('Done');

                this.player2.pass();

                this.player1.clickCard(this.kaiuShihobu2);
                expect(this.player1).toBeAbleToSelect(this.storehouse);
                expect(this.player1).toBeAbleToSelect(this.favorableGround);
                expect(this.player1).toBeAbleToSelect(this.ancestralArmory);
                expect(this.player1).toBeAbleToSelect(this.artisanAcademy);
            });
        });
    });
});
