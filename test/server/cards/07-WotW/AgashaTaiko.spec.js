describe('Agahsa Taiko', function() {
    integration(function() {
        describe('Agahsa Taiko\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        dynastyDiscard: ['agasha-taiko']
                    },
                    player2: {
                        inPlay: ['wandering-ronin'],
                        hand: ['talisman-of-the-sun']
                    }
                });

                this.agashaTaiko = this.player1.placeCardInProvince('agasha-taiko');
                this.shamefulDisplay1 = this.player1.findCardByName('shameful-display', 'province 1');
                this.shamefulDisplay2 = this.player1.findCardByName('shameful-display', 'province 2');
                this.shamefulDisplay3 = this.player1.findCardByName('shameful-display', 'province 3');
                this.shamefulDisplay4 = this.player1.findCardByName('shameful-display', 'province 4');
                this.shamefulDisplaySH = this.player1.findCardByName('shameful-display', 'stronghold province');

                this.wanderingRonin = this.player2.findCardByName('wandering-ronin');
                this.talismanOfTheSun = this.player2.findCardByName('talisman-of-the-sun');
                this.oppShamefulDisplay1 = this.player2.findCardByName('shameful-display', 'province 1');
                this.oppShamefulDisplay2 = this.player2.findCardByName('shameful-display', 'province 2');
                this.oppShamefulDisplay2.facedown = false;
                this.oppShamefulDisplay3 = this.player2.findCardByName('shameful-display', 'province 3');
                this.oppShamefulDisplay4 = this.player2.findCardByName('shameful-display', 'province 4');
                this.oppShamefulDisplaySH = this.player2.findCardByName('shameful-display', 'stronghold province');
            });

            it('should trigger when it enters play', function() {
                expect(this.player1).toHavePrompt('Play cards from provinces');
                this.player1.clickCard(this.agashaTaiko);
                this.player1.clickPrompt('0');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.agashaTaiko);
            });

            it('should prompt to select a non-stronghold province', function() {
                this.player1.clickCard(this.agashaTaiko);
                this.player1.clickPrompt('0');
                this.player1.clickCard(this.agashaTaiko);
                expect(this.player1).toBeAbleToSelect(this.shamefulDisplay1);
                expect(this.player1).toBeAbleToSelect(this.shamefulDisplay2);
                expect(this.player1).toBeAbleToSelect(this.shamefulDisplay3);
                expect(this.player1).toBeAbleToSelect(this.shamefulDisplay4);
                expect(this.player1).not.toBeAbleToSelect(this.shamefulDisplaySH);
                expect(this.player1).toBeAbleToSelect(this.oppShamefulDisplay1);
                expect(this.player1).toBeAbleToSelect(this.oppShamefulDisplay2);
                expect(this.player1).toBeAbleToSelect(this.oppShamefulDisplay3);
                expect(this.player1).toBeAbleToSelect(this.oppShamefulDisplay4);
                expect(this.player1).not.toBeAbleToSelect(this.oppShamefulDisplaySH);
            });

            it('should prevent initiating attacks against the chosen province', function() {
                this.player1.clickCard(this.agashaTaiko);
                this.player1.clickPrompt('0');
                this.player1.clickCard(this.agashaTaiko);
                this.player1.clickCard(this.shamefulDisplay1);
                expect(this.getChatLogs(1)).toContain('player1 uses Agasha Taiko to prevent player1\'s hidden province in province 1 from being attacked this round');
                this.noMoreActions();
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();
                expect(this.player2).toHavePrompt('Initiate Conflict');
                this.player2.clickCard(this.wanderingRonin);
                this.player2.clickRing('air');
                expect(this.player2).toHavePrompt('Choose province to attack');
                this.player2.clickCard(this.shamefulDisplay1);
                expect(this.player2).toHavePrompt('Choose province to attack');
                expect(this.player2).not.toHavePromptButton('Initiate Conflict');
                this.player2.clickCard(this.shamefulDisplay2);
                expect(this.player2).toHavePromptButton('Initiate Conflict');
            });

            it('should prevent talisman moving attacks to the chosen province', function() {
                this.player1.clickCard(this.agashaTaiko);
                this.player1.clickPrompt('0');
                this.player1.clickCard(this.agashaTaiko);
                this.player1.clickCard(this.oppShamefulDisplay2);
                expect(this.getChatLogs(1)).toContain('player1 uses Agasha Taiko to prevent player2\'s Shameful Display in province 2 from being attacked this round');
                this.noMoreActions();
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Initiate Conflict');
                this.player1.clickCard(this.agashaTaiko);
                this.player1.clickRing('air');
                expect(this.player1).toHavePrompt('Choose province to attack');
                this.player1.clickCard(this.oppShamefulDisplay2);
                expect(this.player1).toHavePrompt('Choose province to attack');
                expect(this.player1).not.toHavePromptButton('Initiate Conflict');
                this.player1.clickCard(this.oppShamefulDisplay1);
                expect(this.player1).toHavePromptButton('Initiate Conflict');
                this.player1.clickPrompt('Initiate Conflict');
                this.player2.clickCard(this.wanderingRonin);
                this.player2.clickPrompt('Done');
                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.player2.clickCard(this.talismanOfTheSun);
                this.player2.clickCard(this.wanderingRonin);
                this.player1.pass();
                this.player2.clickCard(this.talismanOfTheSun);
                expect(this.player2).toHavePrompt('Choose a province');
                expect(this.player2).not.toBeAbleToSelect(this.oppShamefulDisplay1);
                expect(this.player2).not.toBeAbleToSelect(this.oppShamefulDisplay2);
                expect(this.player2).toBeAbleToSelect(this.oppShamefulDisplay3);
                expect(this.player2).toBeAbleToSelect(this.oppShamefulDisplay4);
            });
        });
    });
});

