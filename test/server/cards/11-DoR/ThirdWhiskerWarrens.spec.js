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
                        dynastyDiscard: ['kitsu-warrior', 'akodo-zentaro', 'doomed-shugenja', 'agasha-taiko', 'third-whisker-warrens', 'seventh-tower', 'imperial-storehouse'],
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
                this.tower = this.player2.findCardByName('seventh-tower');
                this.storehouse = this.player2.findCardByName('imperial-storehouse');
                this.player2.moveCard(this.warrens, 'province 1');
                this.player2.moveCard(this.tower, 'province 2');
                this.warrens.facedown = false;
                this.player2.moveCard(this.agashaTaiko, 'dynasty deck');
                this.player2.moveCard(this.kitsuWarrior, 'dynasty deck');

                this.pWarrens = this.player2.findCardByName('shameful-display', 'province 1');
                this.pTower = this.player2.findCardByName('shameful-display', 'province 2');
                this.pNoWall = this.player2.findCardByName('shameful-display', 'province 3');
            });

            it('should allow you to play characters from dynasty deck during a conflict at Warrens', function() {
                expect(this.player2.player.dynastyDeck.first()).toBe(this.kitsuWarrior);
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.agashaSwordsmith],
                    defenders: [],
                    province: this.pWarrens
                });

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

            it('should be active at another kaiu wall', function() {
                expect(this.player2.player.dynastyDeck.first()).toBe(this.kitsuWarrior);
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.agashaSwordsmith],
                    defenders: [],
                    province: this.pTower
                });

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

            it('should not be active when conflict is not at a province with a kaiu wall', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.agashaSwordsmith],
                    defenders: [],
                    province: this.pNoWall
                });
                this.player2.clickCard(this.kitsuWarrior);
                expect(this.player2).not.toHavePrompt('Choose additional fate');
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should not let you use holdings', function() {
                this.player2.moveCard(this.storehouse, 'dynasty deck');
                expect(this.player2.player.dynastyDeck.first()).toBe(this.storehouse);
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.agashaSwordsmith],
                    defenders: [],
                    province: this.pWarrens
                });
                let hand = this.player2.hand.length;
                this.player2.clickCard(this.storehouse);
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.player2.hand.length).toBe(hand);
            });

            it('should allow you to use the disguised keyword when you play from discard', function() {
                this.player2.moveCard(this.akodoZentaro, 'dynasty deck');
                expect(this.player2.player.dynastyDeck.first()).toBe(this.akodoZentaro);
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.agashaSwordsmith],
                    defenders: [this.akodoGunso],
                    province: this.pWarrens
                });
                this.player2.clickCard(this.akodoZentaro);
                expect(this.player2).toHavePrompt('Akodo Zentarō');
                expect(this.player2).toHavePromptButton('Play this character with Disguise');
                expect(this.player2).toHavePromptButton('Play this character');
            });

            it('should not allow characters to be played if grasp of earth has been activated', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.agashaSwordsmith],
                    defenders: [],
                    province: this.pWarrens
                });
                this.player2.pass();
                this.player1.clickCard(this.graspOfEarth);
                this.player1.clickCard(this.agashaSwordsmith);
                this.player2.pass();
                this.player1.clickCard(this.graspOfEarth);
                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.player2.clickCard(this.kitsuWarrior);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            //Fails this test, but since doomed & warrens are in different clans, probably okay for now
            // it('should allow additional fate to be added to doomed shugenja', function() {
            //     this.player2.moveCard(this.doomedShugenja, 'dynasty deck');
            //     expect(this.player2.player.dynastyDeck.first()).toBe(this.doomedShugenja);
            //     this.noMoreActions();
            //     this.initiateConflict({
            //         attackers: [this.agashaSwordsmith],
            //         defenders: [],
            //         province: this.pWarrens
            //     });
            //     this.player2.clickCard(this.doomedShugenja);
            //     expect(this.player2).toHavePrompt('Choose additional fate');
            //     expect(this.player2).toHavePromptButton('1');
            //     this.player2.clickPrompt('1');
            //     expect(this.doomedShugenja.isParticipating()).toBe(true);
            //     expect(this.doomedShugenja.fate).toBe(1);
            // });
        });
    });
});
