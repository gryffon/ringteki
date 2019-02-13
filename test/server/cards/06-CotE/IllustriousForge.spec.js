describe('Illustrious Forge', function() {
    integration(function() {
        describe('Illustrious Forge\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['adept-of-the-waves']
                    },
                    player2: {
                        inPlay: ['border-rider', 'battle-maiden-recruit'],
                        hand: ['fine-katana', 'finger-of-jade', 'tattooed-wanderer', 'force-of-the-river', 'censure'],
                        provinces: ['illustrious-forge']
                    }
                });

                this.adeptOfTheWaves = this.player1.findCardByName('adept-of-the-waves');

                this.borderRider = this.player2.findCardByName('border-rider');
                this.battleMaidenRecruit = this.player2.findCardByName('battle-maiden-recruit');
                this.fineKatana = this.player2.findCardByName('fine-katana', 'hand');
                this.fingerOfJade = this.player2.findCardByName('finger-of-jade', 'hand');
                this.tattooedWanderer = this.player2.findCardByName('tattooed-wanderer', 'hand');
                this.forceOfTheRiver = this.player2.findCardByName('force-of-the-river', 'hand');
                this.censure = this.player2.findCardByName('censure', 'hand');

                this.player2.player.moveCard(this.censure, 'conflict deck');
                this.player2.player.moveCard(this.fineKatana, 'conflict deck');
                this.player2.player.moveCard(this.fingerOfJade, 'conflict deck');
                this.player2.player.moveCard(this.tattooedWanderer, 'conflict deck');
                this.player2.player.moveCard(this.forceOfTheRiver, 'conflict deck');

                this.illustriousForge = this.player2.findCardByName('illustrious-forge');
            });

            it('should trigger when province is revealed', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.adeptOfTheWaves]
                });
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.illustriousForge);
            });

            it('should prompt to choose an eligible attachment', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.adeptOfTheWaves]
                });
                this.player2.clickCard(this.illustriousForge);
                expect(this.player2).toHavePrompt('Choose an attachment');
                expect(this.player2).not.toHavePromptButton('Censure');
                expect(this.player2).toHavePromptButton('Fine Katana');
                expect(this.player2).toHavePromptButton('Finger of Jade');
                expect(this.player2).not.toHavePromptButton('Tattooed Wanderer');
                expect(this.player2).not.toHavePromptButton('Force of the River');
                expect(this.player2).toHavePromptButton('Take nothing');
            });

            it('should prompt to choose to take nothing', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.adeptOfTheWaves]
                });
                this.player2.clickCard(this.illustriousForge);
                expect(this.player2).toHavePrompt('Choose an attachment');
                expect(this.player2).toHavePromptButton('Take nothing');
                this.player2.clickPrompt('Take nothing');
                expect(this.getChatLogs(3)).toContain('player2 takes nothing');
                expect(this.getChatLogs(2)).toContain('player2 is shuffling their conflict deck');
                expect(this.player2).toHavePrompt('Choose defenders');
            });

            it('should prompt to choose a character to attach to controlled by the player', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.adeptOfTheWaves]
                });
                this.player2.clickCard(this.illustriousForge);
                this.player2.clickPrompt('Fine Katana');
                expect(this.player2).toHavePrompt('Choose a character');
                expect(this.player2).toBeAbleToSelect(this.borderRider);
                expect(this.player2).toBeAbleToSelect(this.battleMaidenRecruit);
                expect(this.player2).not.toBeAbleToSelect(this.adeptOfTheWaves);
            });

            it('should attach the chosen attachment to the chosen character and shuffle the deck', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.adeptOfTheWaves]
                });
                this.player2.clickCard(this.illustriousForge);
                this.player2.clickPrompt('Fine Katana');
                this.player2.clickCard(this.borderRider);
                expect(this.borderRider.attachments.toArray()).toContain(this.fineKatana);
                expect(this.player2).toHavePrompt('Choose defenders');
                expect(this.getChatLogs(2)).toContain('player2 is shuffling their conflict deck');
            });
        });
    });
});
