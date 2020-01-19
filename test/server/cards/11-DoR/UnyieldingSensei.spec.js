describe('Unyielding Sensei', function() {
    integration(function() {
        describe('Unyielding Sensei\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['unyielding-sensei', 'unyielding-sensei'],
                        dynastyDiscard: ['kitsu-warrior', 'akodo-toturi', 'imperial-storehouse', 'seventh-tower', 'favorable-ground', 'city-of-lies', 'forgotten-library']
                    }
                });
                this.sensei = this.player1.filterCardsByName('unyielding-sensei')[0];
                this.sensei2 = this.player1.filterCardsByName('unyielding-sensei')[1];

                this.kitsuWarrior = this.player1.findCardByName('kitsu-warrior', 'dynasty discard pile');
                this.akodototuri = this.player1.findCardByName('akodo-toturi', 'dynasty discard pile');
                this.storehouse = this.player1.findCardByName('imperial-storehouse');
                this.library = this.player1.findCardByName('forgotten-library');

                this.favorable = this.player1.findCardByName('favorable-ground');
                this.tower = this.player1.findCardByName('seventh-tower');
                this.cityOfLies = this.player1.findCardByName('city-of-lies');

                this.player1.moveCard(this.library, 'dynasty deck');
                this.player1.moveCard(this.storehouse, 'dynasty deck');
                this.player1.moveCard(this.kitsuWarrior, 'dynasty deck');

                this.p1 = this.player1.findCardByName('shameful-display', 'province 1');
                this.p2 = this.player1.findCardByName('shameful-display', 'province 2');
                this.p3 = this.player1.findCardByName('shameful-display', 'province 3');
                this.p4 = this.player1.findCardByName('shameful-display', 'province 4');

                this.p2.isBroken = true;
                this.player1.moveCard(this.favorable, 'province 1');
                this.player1.moveCard(this.tower, 'province 2');
                this.player1.moveCard(this.cityOfLies, 'province 3');
                this.favorable.facedown = false;
                this.cityOfLies.facedown = true;
            });

            it('should allow you to select an unbroken province with a faceup holding', function() {
                this.player1.clickCard(this.sensei);
                expect(this.player1).toBeAbleToSelect(this.p1);
                expect(this.player1).not.toBeAbleToSelect(this.p2);
                expect(this.player1).not.toBeAbleToSelect(this.p3);
                expect(this.player1).not.toBeAbleToSelect(this.p4);
            });

            it('should allow you to choose from the top two cards of your dynasty deck', function() {
                let cards = this.player1.provinces['province 1'].dynastyCards.length;
                expect(this.player1.player.dynastyDeck.first()).toBe(this.kitsuWarrior);
                this.player1.clickCard(this.sensei);
                expect(this.player1).toBeAbleToSelect(this.p1);
                this.player1.clickCard(this.p1);
                expect(this.player1).toHavePromptButton('Kitsu Warrior');
                expect(this.player1).toHavePromptButton('Take nothing');
                this.player1.clickPrompt('Kitsu Warrior');
                expect(this.player1.provinces['province 1'].dynastyCards.length).toBe(cards + 1);
                expect(this.kitsuWarrior.location).toBe('province 1');
                expect(this.player1.player.dynastyDeck.first()).toBe(this.storehouse);

                expect(this.getChatLogs(2)).toContain('player1 uses Unyielding Sensei to look at the top two cards of their dynasty deck');
                expect(this.getChatLogs(1)).toContain('player1 puts Kitsu Warrior into a facedown province');
            });

            it('should not shuffle', function() {
                expect(this.player1.player.dynastyDeck.first()).toBe(this.kitsuWarrior);
                this.player1.clickCard(this.sensei);
                expect(this.player1).toBeAbleToSelect(this.p1);
                this.player1.clickCard(this.p1);
                expect(this.player1).toHavePromptButton('Kitsu Warrior');
                expect(this.player1).toHavePromptButton('Take nothing');
                this.player1.clickPrompt('Take nothing');
                expect(this.player1.player.dynastyDeck.first()).toBe(this.kitsuWarrior);
            });

            it('should only show Take Nothing if you don\'t see a character', function() {
                let cards = this.player1.provinces['province 1'].dynastyCards.length;
                expect(this.player1.player.dynastyDeck.first()).toBe(this.kitsuWarrior);
                this.player1.clickCard(this.sensei);
                expect(this.player1).toBeAbleToSelect(this.p1);
                this.player1.clickCard(this.p1);
                expect(this.player1).toHavePromptButton('Kitsu Warrior');
                expect(this.player1).toHavePromptButton('Take nothing');
                this.player1.clickPrompt('Kitsu Warrior');
                expect(this.player1.provinces['province 1'].dynastyCards.length).toBe(cards + 1);
                expect(this.kitsuWarrior.location).toBe('province 1');
                expect(this.player1.player.dynastyDeck.first()).toBe(this.storehouse);

                this.player2.pass();

                expect(this.player1.player.dynastyDeck.first()).toBe(this.storehouse);
                this.player1.clickCard(this.sensei2);
                expect(this.player1).toBeAbleToSelect(this.p1);
                this.player1.clickCard(this.p1);
                expect(this.player1).toHavePromptButton('Take nothing');
                this.player1.clickPrompt('Take nothing');
                expect(this.player1.provinces['province 1'].dynastyCards.length).toBe(cards + 1);
                expect(this.player1.player.dynastyDeck.first()).toBe(this.storehouse);
            });

            it('should let you keep stacking a province', function() {
                this.player1.moveCard(this.akodototuri, 'dynasty deck');
                let cards = this.player1.provinces['province 1'].dynastyCards.length;
                expect(this.player1.player.dynastyDeck.first()).toBe(this.akodototuri);
                this.player1.clickCard(this.sensei);
                expect(this.player1).toBeAbleToSelect(this.p1);
                this.player1.clickCard(this.p1);
                expect(this.player1).toHavePromptButton('Akodo Toturi');
                expect(this.player1).toHavePromptButton('Kitsu Warrior');
                expect(this.player1).toHavePromptButton('Take nothing');
                this.player1.clickPrompt('Kitsu Warrior');
                expect(this.player1.provinces['province 1'].dynastyCards.length).toBe(cards + 1);
                expect(this.kitsuWarrior.location).toBe('province 1');
                expect(this.player1.player.dynastyDeck.first()).toBe(this.akodototuri);

                this.player2.pass();

                expect(this.player1.player.dynastyDeck.first()).toBe(this.akodototuri);
                this.player1.clickCard(this.sensei2);
                expect(this.player1).toBeAbleToSelect(this.p1);
                this.player1.clickCard(this.p1);
                expect(this.player1).toHavePromptButton('Akodo Toturi');
                expect(this.player1).toHavePromptButton('Take nothing');
                this.player1.clickPrompt('Akodo Toturi');
                expect(this.player1.provinces['province 1'].dynastyCards.length).toBe(cards + 2);
                expect(this.kitsuWarrior.location).toBe('province 1');
                expect(this.akodototuri.location).toBe('province 1');
                expect(this.player1.player.dynastyDeck.first()).toBe(this.storehouse);
            });

            it('chat message', function() {
                this.p1.facedown = false;
                let cards = this.player1.provinces['province 1'].dynastyCards.length;
                expect(this.player1.player.dynastyDeck.first()).toBe(this.kitsuWarrior);
                this.player1.clickCard(this.sensei);
                expect(this.player1).toBeAbleToSelect(this.p1);
                this.player1.clickCard(this.p1);
                expect(this.player1).toHavePromptButton('Kitsu Warrior');
                expect(this.player1).toHavePromptButton('Take nothing');
                this.player1.clickPrompt('Kitsu Warrior');
                expect(this.player1.provinces['province 1'].dynastyCards.length).toBe(cards + 1);
                expect(this.kitsuWarrior.location).toBe('province 1');
                expect(this.player1.player.dynastyDeck.first()).toBe(this.storehouse);

                expect(this.getChatLogs(2)).toContain('player1 uses Unyielding Sensei to look at the top two cards of their dynasty deck');
                expect(this.getChatLogs(1)).toContain('player1 puts Kitsu Warrior into Shameful Display');
            });
        });
    });
});
