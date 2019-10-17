describe('Fury of the Damned', function() {
    integration(function() {
        describe('Fury of the Damned\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['brash-samurai', 'doji-challenger', 'doji-whisperer', 'fifth-tower-watch'],
                        hand: ['fury-of-the-damned']
                    },
                    player2: {
                        inPlay: ['border-rider']
                    }
                });
                this.brashSamurai = this.player1.findCardByName('brash-samurai');
                this.dojiChallenger = this.player1.findCardByName('doji-challenger');
                this.dojiWhisperer = this.player1.findCardByName('doji-whisperer');
                this.fifthTowerWatch = this.player1.findCardByName('fifth-tower-watch');
                this.furyOfTheDamned = this.player1.findCardByName('fury-of-the-damned');

                this.borderRider = this.player2.findCardByName('border-rider');
            });

            it('should not trigger outside of a conflict', function() {
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.furyOfTheDamned);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should prompt you to choose any number of participating bushi characters you control', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.brashSamurai, this.dojiChallenger, this.dojiWhisperer],
                    defenders: [this.borderRider]
                });
                this.player2.pass();
                this.player1.clickCard(this.furyOfTheDamned);
                expect(this.player1).toHavePrompt('Choose bushi characters');
                expect(this.player1).toBeAbleToSelect(this.brashSamurai);
                expect(this.player1).toBeAbleToSelect(this.dojiChallenger);
                expect(this.player1).not.toBeAbleToSelect(this.dojiWhisperer);
                expect(this.player1).not.toBeAbleToSelect(this.fifthTowerWatch);
                expect(this.player1).not.toBeAbleToSelect(this.borderRider);
                this.player1.clickCard(this.brashSamurai);
                this.player1.clickCard(this.dojiChallenger);
                expect(this.player1.selectedCards).toContain(this.brashSamurai);
                expect(this.player1.selectedCards).toContain(this.dojiChallenger);
                expect(this.player1).toHavePromptButton('Done');
            });

            it('should not allow you to choose zero targets', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.brashSamurai, this.dojiChallenger, this.dojiWhisperer],
                    defenders: [this.borderRider]
                });
                this.player2.pass();
                this.player1.clickCard(this.furyOfTheDamned);
                expect(this.player1).toHavePrompt('Choose bushi characters');
                expect(this.player1).not.toHavePromptButton('Done');
            });

            it('should double the base military skill of the chosen characters', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.brashSamurai, this.dojiChallenger, this.dojiWhisperer],
                    defenders: [this.borderRider]
                });
                this.player2.pass();
                this.player1.clickCard(this.furyOfTheDamned);
                expect(this.player1).toHavePrompt('Choose bushi characters');
                this.player1.clickCard(this.brashSamurai);
                this.player1.clickCard(this.dojiChallenger);
                this.player1.clickPrompt('Done');
                expect(this.brashSamurai.getBaseMilitarySkill()).toBe(4);
                expect(this.dojiChallenger.getBaseMilitarySkill()).toBe(6);
                expect(this.getChatLogs(3)).toContain('player1 plays Fury of the Damned to double the base military skill of Brash Samurai and Doji Challenger and sacrifice them at the end of the conflict');
            });

            it('should sacrifice the chosen characters at the end of the conflict (single target)', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.brashSamurai, this.dojiChallenger, this.dojiWhisperer],
                    defenders: [this.borderRider]
                });
                this.player2.pass();
                this.player1.clickCard(this.furyOfTheDamned);
                expect(this.player1).toHavePrompt('Choose bushi characters');
                this.player1.clickCard(this.brashSamurai);
                this.player1.clickPrompt('Done');
                this.noMoreActions();
                this.player1.clickPrompt('No');
                this.player1.clickPrompt('Don\'t Resolve');
                expect(this.getChatLogs(1)).toContain('Brash Samurai is sacrificed due to Fury of the Damned\'s delayed effect');
                expect(this.brashSamurai.location).toBe('dynasty discard pile');
            });

            it('should sacrifice the chosen characters at the end of the conflict (multiple targets)', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.brashSamurai, this.dojiChallenger, this.dojiWhisperer],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.furyOfTheDamned);
                expect(this.player1).toHavePrompt('Choose bushi characters');
                this.player1.clickCard(this.brashSamurai);
                this.player1.clickCard(this.dojiChallenger);
                this.player1.clickPrompt('Done');
                this.noMoreActions();
                this.player1.clickPrompt('No');
                this.player1.clickPrompt('Don\'t Resolve');
                expect(this.getChatLogs(1)).toContain('Brash Samurai and Doji Challenger are sacrificed due to Fury of the Damned\'s delayed effect');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.fifthTowerWatch);
                this.player1.clickCard(this.fifthTowerWatch);
                this.player2.clickCard(this.borderRider);
                expect(this.brashSamurai.location).toBe('dynasty discard pile');
                expect(this.dojiChallenger.location).toBe('dynasty discard pile');
            });
        });
    });
});
