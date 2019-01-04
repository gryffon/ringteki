describe('Sincere Challenger', function() {
    integration(function() {
        describe('Sincere Challenger', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'draw',
                    player1: {
                        inPlay: ['sincere-challenger']
                    },
                    player2: {
                        inPlay: []
                    }
                });
                this.sincereChallenger = this.player1.findCardByName('sincere-challenger');
            });

            it('should have +2 pol if controller has composure', function() {
                let political = this.sincereChallenger.getPoliticalSkill();
                expect(this.player1.player.hasComposure()).toBe(false);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('2');
                expect(this.player1.player.hasComposure()).toBe(true);
                expect(this.sincereChallenger.getPoliticalSkill()).toBe(political + 2);
            });
        });

        describe('when the target leaves play during the duel', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 11,
                        inPlay: ['sincere-challenger', 'adept-of-the-waves'],
                        hand: ['banzai']
                    },
                    player2: {
                        honor: 11,
                        inPlay: ['obstinate-recruit']
                    }
                });
                this.sincereChallenger = this.player1.findCardByName('sincere-challenger');
                this.adeptOfTheWaves = this.player1.findCardByName('adept-of-the-waves');
                this.banzai = this.player1.findCardByName('banzai');

                this.obstinateRecruit = this.player2.findCardByName('obstinate-recruit');

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.sincereChallenger, this.adeptOfTheWaves],
                    defenders: [this.obstinateRecruit]
                });
                this.player2.pass();
            });

            it('the duel should still successfully resolve', function() {
                this.player1.clickCard(this.sincereChallenger);
                this.player1.clickCard(this.obstinateRecruit);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('2');
                expect(this.obstinateRecruit.location).toBe('dynasty discard pile');
                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.player2.pass();
                this.player1.clickCard(this.banzai);
                expect(this.player1).toHavePrompt('Choose a character');
                expect(this.player1).not.toBeAbleToSelect(this.sincereChallenger);
                expect(this.player1).toBeAbleToSelect(this.adeptOfTheWaves);
            });
        });

        describe('Sincere Challenger\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['sincere-challenger', 'adept-of-the-waves'],
                        hand: ['banzai', 'unleash-the-djinn']
                    },
                    player2: {
                        inPlay: ['mirumoto-raitsugu', 'doomed-shugenja', 'togashi-initiate'],
                        hand: ['court-games']
                    }
                });
                this.sincereChallenger = this.player1.findCardByName('sincere-challenger');
                this.adeptOfTheWaves = this.player1.findCardByName('adept-of-the-waves');
                this.banzai = this.player1.findCardByName('banzai');
                this.unleashTheDjinn = this.player1.findCardByName('unleash-the-djinn');

                this.mirumotoRaitsugu = this.player2.findCardByName('mirumoto-raitsugu');
                this.doomedShugenja = this.player2.findCardByName('doomed-shugenja');
                this.togashiInitiate = this.player2.findCardByName('togashi-initiate');
                this.courtGames = this.player2.findCardByName('court-games');
            });

            it('should not be able to be triggered outside of a conflict', function() {
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.sincereChallenger);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should not be able to be triggered if Sincere Challenger is not participating', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.adeptOfTheWaves],
                    defenders: [this.mirumotoRaitsugu, this.doomedShugenja],
                    type: 'political'
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.sincereChallenger);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('it should prompt to target a participating character', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.sincereChallenger],
                    defenders: [this.mirumotoRaitsugu, this.doomedShugenja],
                    type: 'military'
                });
                this.player2.pass();
                this.player1.clickCard(this.sincereChallenger);
                expect(this.player1).toHavePrompt('Sincere Challenger');
                expect(this.player1).toBeAbleToSelect(this.mirumotoRaitsugu);
                expect(this.player1).toBeAbleToSelect(this.doomedShugenja);
                expect(this.player1).not.toBeAbleToSelect(this.togashiInitiate);
            });

            it('the winner of the duel should become immune to events', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.sincereChallenger, this.adeptOfTheWaves],
                    defenders: [this.mirumotoRaitsugu, this.doomedShugenja],
                    type: 'political'
                });
                this.player2.pass();
                this.player1.clickCard(this.sincereChallenger);
                this.player1.clickCard(this.mirumotoRaitsugu);
                this.player1.clickPrompt('5');
                this.player2.clickPrompt('1');
                this.player2.pass();

                // cannot be targeted by player's events
                this.player1.clickCard(this.banzai);
                expect(this.player1).toHavePrompt('Choose a character');
                expect(this.player1).not.toBeAbleToSelect(this.sincereChallenger);
                expect(this.player1).toBeAbleToSelect(this.adeptOfTheWaves);
                expect(this.player1).toBeAbleToSelect(this.mirumotoRaitsugu);
                expect(this.player1).toBeAbleToSelect(this.doomedShugenja);
                this.player1.clickCard(this.adeptOfTheWaves);
                this.player1.clickPrompt('Done');

                // cannot be targeted by opponent's events
                this.player2.clickCard(this.courtGames);
                this.player2.clickPrompt('Dishonor an opposing character');
                expect(this.player1).toHavePrompt('Choose a character');
                expect(this.player1).not.toBeAbleToSelect(this.sincereChallenger);
                expect(this.player1).toBeAbleToSelect(this.adeptOfTheWaves);
                this.player1.clickCard(this.adeptOfTheWaves);

                // unaffected by non-targeted effects from events
                this.player1.clickCard(this.unleashTheDjinn);
                expect(this.sincereChallenger.getPoliticalSkill()).toBe(2);
                expect(this.adeptOfTheWaves.getPoliticalSkill()).toBe(3);
            });
        });
    });
});
