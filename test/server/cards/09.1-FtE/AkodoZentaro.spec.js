describe('Akodo Zentaro', function() {
    integration(function() {
        describe('Akodo Zentaro\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['akodo-zentaro', 'miya-mystic'],
                        dynastyDiscard: ['matsu-berserker']
                    },
                    player2: {
                        inPlay: ['wandering-ronin'],
                        dynastyDiscard: ['the-imperial-palace', 'imperial-storehouse']
                    }
                });

                this.akodoZentaro = this.player1.findCardByName('akodo-zentaro');
                this.miyaMystic = this.player1.findCardByName('miya-mystic');
                this.shamefulDisplay1 = this.player1.findCardByName('shameful-display', 'province 1');
                this.shamefulDisplay2 = this.player1.findCardByName('shameful-display', 'province 2');
                this.shamefulDisplay2.isBroken = true;
                this.shamefulDisplay3 = this.player1.findCardByName('shameful-display', 'province 3');
                this.matsuBerserker = this.player1.placeCardInProvince('matsu-berserker', 'province 3');
                this.shamefulDisplay4 = this.player1.findCardByName('shameful-display', 'province 4');
                this.shamefulDisplaySH = this.player1.findCardByName('shameful-display', 'stronghold province');

                this.wanderingRonin = this.player2.findCardByName('wandering-ronin');
                this.imperialStorehouse = this.player2.placeCardInProvince('imperial-storehouse', 'province 1');
                this.theImperialPalace = this.player2.placeCardInProvince('the-imperial-palace', 'province 2');
            });

            it('should not trigger if Zentaro is not attacking', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.miyaMystic],
                    defenders: []
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.akodoZentaro);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not trigger if Zentaro is defending', function() {
                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.wanderingRonin],
                    defenders: [this.akodoZentaro]
                });
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.akodoZentaro);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not trigger if there is not a non-unqiue holding in the attacked province', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.miyaMystic],
                    defenders: [],
                    province: this.player2.provinces['province 2'].provinceCard
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.akodoZentaro);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });
                        
            it('should prompt to choose a target non-unique holding in the attacked province', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.akodoZentaro],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.akodoZentaro);
                expect(this.player1).toHavePrompt('Choose a holding');
                expect(this.player1).toBeAbleToSelect(this.imperialStorehouse);
                expect(this.player1).not.toBeAbleToSelect(this.theImperialPalace);
            });

            it('should prompt to choose a non-stronghold unbroken province to move the chosen holding to', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.akodoZentaro],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.akodoZentaro);
                this.player1.clickCard(this.imperialStorehouse);
                expect(this.player1).toHavePrompt('Select a Province');
                expect(this.player1).toBeAbleToSelect(this.shamefulDisplay1);
                expect(this.player1).not.toBeAbleToSelect(this.shamefulDisplay2);
                expect(this.player1).toBeAbleToSelect(this.shamefulDisplay3);
                expect(this.player1).toBeAbleToSelect(this.shamefulDisplay4);
                expect(this.player1).not.toBeAbleToSelect(this.shamefulDisplaySH);
            });

            it('should take control of the chosen holding', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.akodoZentaro],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.akodoZentaro);
                this.player1.clickCard(this.imperialStorehouse);
                this.player1.clickCard(this.shamefulDisplay3);
                expect(this.imperialStorehouse.controller).toBe(this.player1.player);
            });

            it('should move the chosen holding to the chosen province and remove all other cards there', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.akodoZentaro],
                    defenders: []
                });
                this.player2.pass();
                expect(this.matsuBerserker.location).toBe('province 3');
                this.player1.clickCard(this.akodoZentaro);
                this.player1.clickCard(this.imperialStorehouse);
                this.player1.clickCard(this.shamefulDisplay3);
                expect(this.imperialStorehouse.location).toBe('province 3');
                expect(this.matsuBerserker.location).toBe('dynasty discard pile');
            });

            it('should discard the chosen holding if there is no valid province to move it to', function() {
                this.shamefulDisplay1.isBroken = true;
                this.shamefulDisplay2.isBroken = true;
                this.shamefulDisplay3.isBroken = true;
                this.shamefulDisplay4.isBroken = true;
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.akodoZentaro],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.akodoZentaro);
                this.player1.clickCard(this.imperialStorehouse);
                expect(this.imperialStorehouse.location).toBe('dynasty discard pile');
            });
        });

        describe('Akodo Zentaro\'s Disguised keyword', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        inPlay: ['matsu-berserker', 'kitsu-spiritcaller', 'akodo-toturi'],
                        dynastyDiscard: ['akodo-zentaro'],
                        hand: ['fine-katana', 'ornate-fan']
                    },
                    player2: {
                    }
                });

                this.akodoZentaro = this.player1.placeCardInProvince('akodo-zentaro', 'province 1');
                this.matsuBerserker = this.player1.findCardByName('matsu-berserker');
                this.kitsuSpiritcaller = this.player1.findCardByName('kitsu-spiritcaller');
                this.akodoToturi = this.player1.findCardByName('akodo-toturi');
                this.fineKatana = this.player1.findCardByName('fine-katana');
                this.ornateFan = this.player1.findCardByName('ornate-fan');
            });

            it('should not work during the dynasty phase', function() {
            });

            it('should not work outside of the conflict phase', function() {
            });

            it('should prompt to choose a non-unique character with the \'bushi\' trait', function() {
            });

            it('should reduce the cost by the printed cost of the character in play', function() {
            });

            it('should transfer fate', function() {
            });

            it('should transfer attachments', function() {
            });

            it('should transfer status tokens', function() {
            });

            it('***hidden moon/Uji interaction***', function() {
            });

        });
    });
});

