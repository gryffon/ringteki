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
                expect(this.player1).toHavePrompt('Choose a Province');
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
                expect(this.player1.player.provinceThree.toArray()).toContain(this.imperialStorehouse);
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
                        dynastyDiscard: ['akodo-zentaro', 'hidden-moon-dojo', 'iron-mine'],
                        hand: ['fine-katana', 'ornate-fan', 'peasant-s-advice', 'court-mask', 'assassination']
                    },
                    player2: {
                        inPlay: ['brash-samurai']
                    }
                });

                this.akodoZentaro = this.player1.placeCardInProvince('akodo-zentaro', 'province 1');
                this.hiddenMoonDojo = this.player1.findCardByName('hidden-moon-dojo');
                this.matsuBerserker = this.player1.findCardByName('matsu-berserker');
                this.matsuBerserker.fate = 2;
                this.kitsuSpiritcaller = this.player1.findCardByName('kitsu-spiritcaller');
                this.akodoToturi = this.player1.findCardByName('akodo-toturi');
                this.fineKatana = this.player1.findCardByName('fine-katana');
                this.ornateFan = this.player1.findCardByName('ornate-fan');
                this.peasantsAdvice = this.player1.findCardByName('peasant-s-advice');
                this.courtMask = this.player1.findCardByName('court-mask');
                this.assassination = this.player1.findCardByName('assassination');
                this.ironMine = this.player1.findCardByName('iron-mine');

                this.brashSamurai = this.player2.findCardByName('brash-samurai');
            });

            it('should not work outside of the conflict phase', function() {
                this.player1.togglePromptedActionWindow('draw', true);
                this.player1.togglePromptedActionWindow('fate', true);
                this.player1.togglePromptedActionWindow('regroup', true);
                this.player1.clickCard(this.akodoZentaro);
                expect(this.player1).toHavePrompt('Choose additional fate');
                expect(this.player1).toHavePromptButton('Cancel');
                this.player1.clickPrompt('Cancel');
                this.noMoreActions();
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.akodoZentaro);
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.pass();
                this.advancePhases('fate');
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.akodoZentaro);
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.pass();
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.akodoZentaro);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should prompt to choose a non-unique character with the \'bushi\' trait', function() {
                this.advancePhases('conflict');
                this.player1.clickCard(this.akodoZentaro);
                expect(this.player1).toHavePrompt('Choose a character to replace');
                expect(this.player1).toBeAbleToSelect(this.matsuBerserker);
                expect(this.player1).not.toBeAbleToSelect(this.kitsuSpiritcaller);
                expect(this.player1).not.toBeAbleToSelect(this.akodoToturi);
                expect(this.player1).not.toBeAbleToSelect(this.brashSamurai);
            });

            it('should not activate if there are no legal targets', function() {
                this.advancePhases('conflict');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.matsuBerserker, this.kitsuSpiritcaller, this.akodoToturi],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.assassination);
                this.player1.clickCard(this.matsuBerserker);
                expect(this.matsuBerserker.location).toBe('dynasty discard pile');
                this.player2.pass();
                this.player1.clickCard(this.akodoZentaro);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should reduce the cost by the printed cost of the character in play', function() {
                this.advancePhases('conflict');
                let fate = this.player1.player.fate;
                this.player1.clickCard(this.akodoZentaro);
                this.player1.clickCard(this.matsuBerserker);
                expect(this.player1.player.fate).toBe(fate - this.akodoZentaro.getCost() + this.matsuBerserker.getCost());
            });

            it('should put itself into play', function() {
                this.advancePhases('conflict');
                this.player1.clickCard(this.akodoZentaro);
                this.player1.clickCard(this.matsuBerserker);
                expect(this.akodoZentaro.location).toBe('play area');
            });

            it('should discard the replaced character', function() {
                this.advancePhases('conflict');
                this.player1.clickCard(this.akodoZentaro);
                this.player1.clickCard(this.matsuBerserker);
                expect(this.matsuBerserker.location).toBe('dynasty discard pile');
                expect(this.getChatLogs(1)).toContain('player1 plays Akodo Zentarō using Disguised, choosing to replace Matsu Berserker');
            });

            it('should transfer fate', function() {
                let fate = this.matsuBerserker.fate;
                this.advancePhases('conflict');
                this.player1.clickCard(this.akodoZentaro);
                this.player1.clickCard(this.matsuBerserker);
                expect(this.akodoZentaro.fate).toBe(fate);
            });

            it('should transfer attachments', function() {
                this.advancePhases('conflict');
                this.player1.clickCard(this.fineKatana);
                this.player1.clickCard(this.matsuBerserker);
                this.player2.pass();
                this.player1.clickCard(this.ornateFan);
                this.player1.clickCard(this.matsuBerserker);
                this.player2.pass();
                this.player1.clickCard(this.akodoZentaro);
                this.player1.clickCard(this.matsuBerserker);
                expect(this.fineKatana.parent).toBe(this.akodoZentaro);
                expect(this.ornateFan.parent).toBe(this.akodoZentaro);
            });

            it('should transfer status tokens', function() {
                this.advancePhases('conflict');
                this.player1.clickCard(this.courtMask);
                this.player1.clickCard(this.matsuBerserker);
                this.player2.pass();
                this.player1.clickCard(this.courtMask);
                expect(this.matsuBerserker.isDishonored).toBe(true);
                this.player2.pass();
                expect(this.player1).toHavePrompt('Action Window');
                let honor = this.player1.player.honor;
                this.player1.clickCard(this.akodoZentaro);
                this.player1.clickCard(this.matsuBerserker);
                expect(this.akodoZentaro.isDishonored).toBe(true);
                expect(this.player1.player.honor).toBe(honor);
                expect(this.akodoZentaro.getMilitarySkill()).toBe(1);
            });

            it('should prompt how to play if other play options are available', function() {
                this.advancePhases('conflict');
                this.player1.placeCardInProvince(this.hiddenMoonDojo, 'province 2');
                this.player1.clickCard(this.akodoZentaro);
                expect(this.player1).toHavePrompt('Akodo Zentarō');
                expect(this.player1).toHavePromptButton('Play this character with Disguise');
                expect(this.player1).toHavePromptButton('Play this character');
                expect(this.player1).toHavePromptButton('Cancel');
            });

            it('should prompt to play in or out of the conflict if the replaced character is in a conflict', function() {
                this.advancePhases('conflict');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.matsuBerserker],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.akodoZentaro);
                this.player1.clickCard(this.matsuBerserker);
                expect(this.player1).toHavePromptButton('Conflict');
                expect(this.player1).toHavePromptButton('Home');
                this.player1.clickPrompt('Conflict');
                expect(this.akodoZentaro.isParticipating()).toBe(true);
            });

            it('should enter play as ready even if the replaced character is bowed', function() {
                this.advancePhases('conflict');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.matsuBerserker],
                    defenders: []
                });
                this.noMoreActions();
                this.player1.clickPrompt('No');
                this.player1.clickPrompt('Don\'t Resolve');
                expect(this.matsuBerserker.bowed).toBe(true);
                this.player1.clickCard(this.akodoZentaro);
                this.player1.clickCard(this.matsuBerserker);
                expect(this.akodoZentaro.bowed).toBe(false);
            });

            it('should not allow the discard of the replaced character to be prevented', function() {
                this.advancePhases('conflict');
                this.player1.placeCardInProvince(this.ironMine, 'province 2');
                this.player1.clickCard(this.akodoZentaro);
                this.player1.clickCard(this.matsuBerserker);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).not.toBeAbleToSelect(this.ironMine);
                expect(this.matsuBerserker.location).toBe('dynasty discard pile');
                expect(this.player2).toHavePrompt('Action Window');
            });
        });
    });
});

