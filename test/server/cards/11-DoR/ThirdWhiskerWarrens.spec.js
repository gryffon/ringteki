describe('Third Whisker Warrens', function() {
    integration(function() {
        describe('Third Whisker Warrens\'s constant ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['agasha-swordsmith'],
                        hand: ['grasp-of-earth']
                    },
                    player2: {
                        inPlay: ['akodo-gunso'],
                        dynastyDiscard: ['kitsu-warrior', 'akodo-zentaro', 'doomed-shugenja', 'agasha-taiko', 'third-whisker-warrens'],
                        fate: 30
                    }
                });
                this.agashaSwordsmith = this.player1.findCardByName('agasha-swordsmith');
                this.graspOfEarth = this.player1.findCardByName('grasp-of-earth');
                this.akodoGunso = this.player2.findCardByName('akodo-gunso');
                this.kitsuWarrior = this.player2.findCardByName('kitsu-warrior', 'dynasty discard pile');
                this.akodoZentaro = this.player2.findCardByName('akodo-zentaro', 'dynasty discard pile');
                this.doomedShugenja = this.player2.findCardByName('doomed-shugenja', 'dynasty discard pile');
                this.agashaTaiko = this.player2.findCardByName('agasha-taiko', 'dynasty discard pile');
                this.warrens = this.player2.findCardByName('third-whisker-warrens');
                this.shamefulDisplay = this.player2.findCardByName('shameful-display', 'province 1');
                this.player2.moveCard(this.warrens, 'province 1');
                this.warrens.facedown = false;
            });

            it('should allow you to play characters from dynasty deck', function() {
                this.player2.moveCard(this.agashaTaiko, 'dynasty deck');
                this.player2.moveCard(this.kitsuWarrior, 'dynasty deck');
                expect(this.player2.player.dynastyDeck.first()).toBe(this.kitsuWarrior);
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.agashaSwordsmith],
                    defenders: [],
                    province: this.shamefulDisplay
                });
                this.player2.clickCard(this.warrens);
                this.player1.pass();
                expect(this.player2.player.isTopDynastyCardShown()).toBe(true);
                this.player2.clickCard(this.kitsuWarrior);
                expect(this.kitsuWarrior.anyEffect('hideWhenFaceUp')).toBe(true);
                this.player2.clickPrompt('0');
                this.player2.clickPrompt('conflict');
                expect(this.kitsuWarrior.location).toBe('play area');
                expect(this.game.currentConflict.defenders).toContain(this.kitsuWarrior);
                expect(this.kitsuWarrior.anyEffect('hideWhenFaceUp')).toBe(false);

                expect(this.player2.player.dynastyDeck.first()).toBe(this.agashaTaiko);
                expect(this.player2.player.isTopDynastyCardShown()).toBe(true);
                this.player1.pass();
                this.player2.clickCard(this.agashaTaiko);
                this.player2.clickPrompt('0');
                this.player2.clickPrompt('home');
                expect(this.agashaTaiko.location).toBe('play area');
                expect(this.game.currentConflict.defenders).not.toContain(this.agashaTaiko);
            });

            // it('should only allow you to play characters into the conflict', function() {
            //     this.noMoreActions();
            //     this.initiateConflict({
            //         attackers: [this.agashaSwordsmith],
            //         defenders: [],
            //         province: this.gatewayToMeido
            //     });
            //     this.player2.clickCard(this.kitsuWarrior);
            //     this.player2.clickPrompt('1');
            //     expect(this.player2).not.toHavePrompt('"Where do you wish to play this character?');
            //     expect(this.player1).toHavePrompt('Conflict Action Window');
            //     expect(this.kitsuWarrior.location).toBe('play area');
            //     expect(this.kitsuWarrior.isParticipating()).toBe(true);
            //     expect(this.kitsuWarrior.fate).toBe(1);
            // });

            // it('should not be active when conflict is not at this province', function() {
            //     this.noMoreActions();
            //     this.initiateConflict({
            //         attackers: [this.agashaSwordsmith],
            //         defenders: [],
            //         province: this.shamefulDisplay
            //     });
            //     this.player2.clickCard(this.kitsuWarrior);
            //     expect(this.player2).not.toHavePrompt('Choose additional fate');
            //     expect(this.player2).toHavePrompt('Conflict Action Window');
            // });

            // it('should allow you to use the disguised keyword when you play from discard', function() {
            //     this.noMoreActions();
            //     this.initiateConflict({
            //         attackers: [this.agashaSwordsmith],
            //         defenders: [this.akodoGunso],
            //         province: this.gatewayToMeido
            //     });
            //     this.player2.clickCard(this.akodoZentaro);
            //     expect(this.player2).toHavePrompt('Akodo Zentarō');
            //     expect(this.player2).toHavePromptButton('Play this character with Disguise');
            //     expect(this.player2).toHavePromptButton('Play this character');
            // });

            // it('should only allow you to replace a character in the conflict if using the disguised keyword', function() {
            //     this.noMoreActions();
            //     this.initiateConflict({
            //         attackers: [this.agashaSwordsmith],
            //         defenders: [this.akodoGunso],
            //         province: this.gatewayToMeido
            //     });
            //     this.player2.clickCard(this.akodoZentaro);
            //     this.player2.clickPrompt('Play this character with Disguise');
            //     expect(this.player2).toHavePrompt('Choose a character to replace');
            //     expect(this.player2).toBeAbleToSelect(this.akodoGunso);
            //     expect(this.player2).not.toBeAbleToSelect(this.kitsuWarrior);
            //     this.player2.clickCard(this.akodoGunso);
            //     expect(this.akodoGunso.location).toBe('dynasty discard pile');
            //     expect(this.akodoZentaro.isParticipating()).toBe(true);
            // });

            // it('should not allow you to play using the disguised keyword if there is no appropriate character in the conflict', function() {
            //     this.noMoreActions();
            //     this.initiateConflict({
            //         attackers: [this.agashaSwordsmith],
            //         defenders: [],
            //         province: this.gatewayToMeido
            //     });
            //     this.player2.clickCard(this.akodoZentaro);
            //     expect(this.player2).toHavePrompt('Choose additional fate');
            // });

            // it('should not allow characters to be played if grasp of earth has been activated', function() {
            //     this.noMoreActions();
            //     this.initiateConflict({
            //         attackers: [this.agashaSwordsmith],
            //         defenders: [],
            //         province: this.gatewayToMeido
            //     });
            //     this.player2.pass();
            //     this.player1.clickCard(this.graspOfEarth);
            //     this.player1.clickCard(this.agashaSwordsmith);
            //     this.player2.pass();
            //     this.player1.clickCard(this.graspOfEarth);
            //     expect(this.player2).toHavePrompt('Conflict Action Window');
            //     this.player2.clickCard(this.kitsuWarrior);
            //     expect(this.player2).toHavePrompt('Conflict Action Window');
            // });

            // it('should allow additional fate to be added to doomed shugenja', function() {
            //     this.noMoreActions();
            //     this.initiateConflict({
            //         attackers: [this.agashaSwordsmith],
            //         defenders: [],
            //         province: this.gatewayToMeido
            //     });
            //     this.player2.pass();
            //     this.player1.clickCard(this.doomedShugenja);
            //     expect(this.player1).toHavePrompt('Choose additional fate');
            //     expect(this.player1).toHavePromptButton('1');
            //     this.player1.clickPrompt('1');
            //     expect(this.doomedShugenja.isParticipating()).toBe(true);
            //     expect(this.doomedShugenja.fate).toBe(1);
            // });
        });
    });
});
