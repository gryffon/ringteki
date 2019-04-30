describe('Asahina Takamori', function() {
    integration(function() {
        describe('Asahina Takamori\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        dynastyDiscard: ['asahina-takamori'],
                        hand: ['steward-of-law', 'doji-fumiki', 'kami-unleashed']
                    },
                    player2: {
                        inPlay: ['adept-of-the-waves', 'wandering-ronin', 'isawa-tadaka'],
                        dynastyDiscard: ['favorable-ground', 'doji-whisperer']
                    }
                });

                this.asahinaTakamori = this.player1.placeCardInProvince('asahina-takamori');
                this.stewardOfLaw = this.player1.findCardByName('steward-of-law');
                this.dojiFumiki = this.player1.findCardByName('doji-fumiki');
                this.kamiUnleashed = this.player1.findCardByName('kami-unleashed');

                this.adeptOfTheWaves = this.player2.findCardByName('adept-of-the-waves');
                this.wanderingRonin = this.player2.findCardByName('wandering-ronin');
                this.isawaTadaka = this.player2.findCardByName('isawa-tadaka');
                this.favorableGround = this.player2.placeCardInProvince('favorable-ground', 'province 1');
                this.dojiWhisperer = this.player2.placeCardInProvince('doji-whisperer', 'province 2');
            });

            it('should trigger when a crane character is played (from province)', function() {
                this.player1.clickCard(this.asahinaTakamori);
                this.player1.clickPrompt('0');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.asahinaTakamori);
            });

            it('should not trigger when your opponent plays a crane character', function() {
                this.player1.clickCard(this.asahinaTakamori);
                this.player1.clickPrompt('0');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.clickPrompt('Pass');
                this.player2.clickCard(this.dojiWhisperer);
                this.player2.clickPrompt('0');
                expect(this.dojiWhisperer.location).toBe('play area');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).toHavePrompt('Play cards from provinces');
            });

            it('should trigger when a crane character is played (from hand)', function () {
                this.player1.clickCard(this.asahinaTakamori);
                this.player1.clickPrompt('0');
                this.player1.clickPrompt('Pass');
                this.advancePhases('conflict');
                this.player1.clickCard(this.dojiFumiki);
                this.player1.clickPrompt('0');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.asahinaTakamori);
            });

            it('should not trigger when a non-crane character is played', function () {
                this.player1.clickCard(this.asahinaTakamori);
                this.player1.clickPrompt('0');
                this.player1.clickPrompt('Pass');
                this.advancePhases('conflict');
                this.player1.clickCard(this.kamiUnleashed);
                this.player1.clickPrompt('0');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player2).toHavePrompt('Action Window');
            });

            it('should not trigger if there are no valid targets', function () {
                this.player1.clickCard(this.asahinaTakamori);
                this.player1.clickPrompt('0');
                this.player1.clickPrompt('Pass');
                this.advancePhases('conflict');
                this.player1.clickCard(this.stewardOfLaw);
                this.player1.clickPrompt('0');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player2).toHavePrompt('Action Window');
            });

            it('should allow you to target an opponent\'s character with equal or less printed cost', function () {
                this.player1.clickCard(this.asahinaTakamori);
                this.player1.clickPrompt('0');
                this.player1.clickCard(this.asahinaTakamori);
                expect(this.player1).toHavePrompt('Choose a character');
                expect(this.player1).not.toBeAbleToSelect(this.asahinaTakamori);
                expect(this.player1).toBeAbleToSelect(this.adeptOfTheWaves);
                expect(this.player1).toBeAbleToSelect(this.wanderingRonin);
                expect(this.player1).not.toBeAbleToSelect(this.isawaTadaka);
            });

            it('should prevent the targeted character from being declared as an attacker', function () {
                this.player1.clickCard(this.asahinaTakamori);
                this.player1.clickPrompt('0');
                this.player1.clickCard(this.asahinaTakamori);
                this.player1.clickCard(this.adeptOfTheWaves);
                expect(this.getChatLogs(1)).toContain('player1 uses Asahina Takamori to prevent Adept of the Waves from being declared as an attacker or defender this round');
                this.advancePhases('conflict');
                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();
                this.player2.clickCard(this.player1.provinces['province 1'].provinceCard);
                this.player2.clickRing('fire');
                this.player2.clickCard(this.adeptOfTheWaves);
                expect(this.player2).not.toHavePromptButton('Initiate Conflict');
                this.player2.clickCard(this.isawaTadaka);
                expect(this.player2).toHavePromptButton('Initiate Conflict');
            });

            it('should prevent the targeted character from being declared as a defender until the end of the round', function () {
                this.player1.clickCard(this.asahinaTakamori);
                this.player1.clickPrompt('0');
                this.player1.clickCard(this.asahinaTakamori);
                this.player1.clickCard(this.adeptOfTheWaves);
                this.advancePhases('conflict');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.asahinaTakamori],
                    defenders: [this.adeptOfTheWaves, this.isawaTadaka]
                });
                expect(this.adeptOfTheWaves.isParticipating()).toBe(false);
                expect(this.isawaTadaka.isParticipating()).toBe(true);
            });

            it('should still allow the targeted character to participate as an attacker (just not declare as an attacker)', function() {
                this.player1.clickCard(this.asahinaTakamori);
                this.player1.clickPrompt('0');
                this.player1.clickCard(this.asahinaTakamori);
                this.player1.clickCard(this.adeptOfTheWaves);
                expect(this.getChatLogs(1)).toContain('player1 uses Asahina Takamori to prevent Adept of the Waves from being declared as an attacker or defender this round');
                this.advancePhases('conflict');
                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.isawaTadaka],
                    defenders: []
                });
                this.player1.pass();
                expect(this.adeptOfTheWaves.isParticipating()).toBe(false);
                this.player2.clickCard(this.favorableGround);
                this.player2.clickCard(this.adeptOfTheWaves);
                expect(this.adeptOfTheWaves.isParticipating()).toBe(true);
            });

            it('should still allow the targeted character to participate as a defender (just not declare as an defender)', function() {
                this.player1.clickCard(this.asahinaTakamori);
                this.player1.clickPrompt('0');
                this.player1.clickCard(this.asahinaTakamori);
                this.player1.clickCard(this.adeptOfTheWaves);
                expect(this.getChatLogs(1)).toContain('player1 uses Asahina Takamori to prevent Adept of the Waves from being declared as an attacker or defender this round');
                this.advancePhases('conflict');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.asahinaTakamori],
                    defenders: []
                });
                expect(this.adeptOfTheWaves.isParticipating()).toBe(false);
                this.player2.clickCard(this.favorableGround);
                this.player2.clickCard(this.adeptOfTheWaves);
                expect(this.adeptOfTheWaves.isParticipating()).toBe(true);
            });
        });
    });
});

