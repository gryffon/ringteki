describe('Frontline Engineer', function() {
    integration(function() {
        describe('Frontline Engineer\'s passive effect', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['frontline-engineer'],
                        dynastyDeck: ['imperial-storehouse', 'favorable-ground', 'kakita-dojo', 'mirumoto-dojo']
                    },
                    player2: {
                        inPlay: [],
                        dynastyDeck: ['imperial-storehouse', 'favorable-ground', 'kakita-dojo', 'mirumoto-dojo']
                    }
                });

                this.frontlineEngineer = this.player1.findCardByName('frontline-engineer');

                this.holding1 = this.player1.placeCardInProvince('imperial-storehouse', 'province 1');
                this.holding2 = this.player1.placeCardInProvince('favorable-ground', 'province 2');
                this.holding3 = this.player1.placeCardInProvince('kakita-dojo', 'province 3');
                this.holding4 = this.player1.placeCardInProvince('mirumoto-dojo', 'province 4');
                this.holding5 = this.player2.placeCardInProvince('imperial-storehouse', 'province 1');
                this.holding6 = this.player2.placeCardInProvince('favorable-ground', 'province 2');
                this.holding7 = this.player2.placeCardInProvince('kakita-dojo', 'province 3');
                this.holding8 = this.player2.placeCardInProvince('mirumoto-dojo', 'province 4');

                this.holding1.facedown = true;
                this.holding2.facedown = true;
                this.holding3.facedown = true;
                this.holding4.facedown = true;
                this.holding5.facedown = true;
                this.holding6.facedown = true;
                this.holding7.facedown = true;
                this.holding8.facedown = true;
                this.game.checkGameState(true);
            });

            it('should have base zero glory', function () {
                expect(this.frontlineEngineer.glory).toBe(0);
            });

            it('should have glory equal to the number of faceup holdings in play', function () {
                this.holding1.facedown = false;
                this.holding2.facedown = false;
                this.holding3.facedown = false;
                this.holding4.facedown = false;
                this.game.checkGameState(true);
                expect(this.frontlineEngineer.glory).toBe(4);

                this.holding5.facedown = false;
                this.holding6.facedown = false;
                this.holding7.facedown = false;
                this.holding8.facedown = false;
                this.game.checkGameState(true);
                expect(this.frontlineEngineer.glory).toBe(8);
            });
        });

        describe('Frontline Engineer\'s active effect', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['frontline-engineer']
                    },
                    player2: {
                        inPlay: ['frontline-engineer'],
                        dynastyDiscard: ['wandering-ronin', 'doji-challenger', 'kitsu-spiritcaller', 'akodo-toturi', 'iron-mine', 'matsu-tsuko'],
                        dynastyDeckSize: 4
                    }
                });

                this.frontlineEngineerAttacker = this.player1.findCardByName('frontline-engineer');
                this.frontlineEngineerDefender = this.player2.findCardByName('frontline-engineer');
                this.matsuTsuko = this.player2.placeCardInProvince('matsu-tsuko', 'province 1');
                this.player2.moveCard('wandering-ronin', 'dynasty deck');
                this.player2.moveCard('doji-challenger', 'dynasty deck');
                this.player2.moveCard('kitsu-spiritcaller', 'dynasty deck');
                this.player2.moveCard('akodo-toturi', 'dynasty deck');
                this.player2.moveCard('iron-mine', 'dynasty deck');

                this.holding = this.player2.findCardByName('iron-mine');

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.frontlineEngineerAttacker],
                    defenders: [this.frontlineEngineerDefender]
                });
            });

            it('should not be usable on attack', function () {
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.frontlineEngineerAttacker);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should allow you to choose a holding in the top five cards of your deck', function () {
                this.player2.clickCard(this.frontlineEngineerDefender);
                expect(this.player2).toHavePrompt('Choose a holding');
                expect(this.player2).toHaveDisabledPromptButton('Wandering Ronin');
                expect(this.player2).toHaveDisabledPromptButton('Doji Challenger');
                expect(this.player2).toHaveDisabledPromptButton('Kitsu Spiritcaller');
                expect(this.player2).toHaveDisabledPromptButton('Akodo Toturi');
                expect(this.player2).toHavePromptButton('Iron Mine');
            });

            it('should put the chosen holding face up in the defending province and discard the card there', function () {
                this.player2.clickCard(this.frontlineEngineerDefender);
                expect(this.player2).toHavePrompt('Choose a holding');
                this.player2.clickPrompt('Iron Mine');
                expect(this.holding.location).toBe('province 1');
                expect(this.holding.facedown).toBe(false);
                expect(this.matsuTsuko.location).toBe('dynasty discard pile');
                expect(this.getChatLogs(5)).toContain('player2 uses Frontline Engineer to look at the top five cards of their dynasty deck');
                expect(this.getChatLogs(4)).toContain('player2 discards Matsu Tsuko, replacing it with Iron Mine');
                expect(this.getChatLogs(3)).toContain('player2 is shuffling their dynasty deck');
            });
        });

        describe('Back Alley Hideaway', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['frontline-engineer'],
                        hand: ['assassination']
                    },
                    player2: {
                        inPlay: ['frontline-engineer', 'bayushi-manipulator'],
                        dynastyDiscard: ['wandering-ronin', 'doji-challenger', 'kitsu-spiritcaller', 'akodo-toturi', 'iron-mine', 'back-alley-hideaway'],
                        dynastyDeckSize: 4
                    }
                });

                this.frontlineEngineerAttacker = this.player1.findCardByName('frontline-engineer');
                this.frontlineEngineerDefender = this.player2.findCardByName('frontline-engineer');
                this.manipulator = this.player2.findCardByName('bayushi-manipulator');
                this.assassination = this.player1.findCardByName('assassination');
                this.backAlley = this.player2.placeCardInProvince('back-alley-hideaway', 'province 1');
                this.player2.moveCard('wandering-ronin', 'dynasty deck');
                this.player2.moveCard('doji-challenger', 'dynasty deck');
                this.player2.moveCard('kitsu-spiritcaller', 'dynasty deck');
                this.player2.moveCard('akodo-toturi', 'dynasty deck');
                this.player2.moveCard('iron-mine', 'dynasty deck');

                this.holding = this.player2.findCardByName('iron-mine');

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.frontlineEngineerAttacker],
                    defenders: [this.frontlineEngineerDefender]
                });
                this.player2.pass();
                this.player1.clickCard(this.assassination);
                this.player1.clickCard(this.manipulator);
                this.player2.clickCard(this.backAlley);
            });

            it('should allow you to choose a holding in the top five cards of your deck', function () {
                this.player2.clickCard(this.frontlineEngineerDefender);
                expect(this.player2).toHavePrompt('Choose a holding');
                expect(this.player2).toHaveDisabledPromptButton('Wandering Ronin');
                expect(this.player2).toHaveDisabledPromptButton('Doji Challenger');
                expect(this.player2).toHaveDisabledPromptButton('Kitsu Spiritcaller');
                expect(this.player2).toHaveDisabledPromptButton('Akodo Toturi');
                expect(this.player2).toHavePromptButton('Iron Mine');
            });

            it('should put the chosen holding face up in the defending province and discard all cards there', function () {
                this.player2.clickCard(this.frontlineEngineerDefender);
                expect(this.player2).toHavePrompt('Choose a holding');
                this.player2.clickPrompt('Iron Mine');
                expect(this.holding.location).toBe('province 1');
                expect(this.holding.facedown).toBe(false);
                expect(this.backAlley.location).toBe('dynasty discard pile');
                expect(this.manipulator.location).toBe('dynasty discard pile');
                expect(this.getChatLogs(5)).toContain('player2 uses Frontline Engineer to look at the top five cards of their dynasty deck');
                expect(this.getChatLogs(4)).toContain('player2 discards Back-Alley Hideaway, replacing it with Iron Mine');
                expect(this.getChatLogs(3)).toContain('player2 is shuffling their dynasty deck');
            });
        });

        describe('Multiple Cards in Province', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['frontline-engineer']
                    },
                    player2: {
                        inPlay: ['frontline-engineer'],
                        dynastyDiscard: ['wandering-ronin', 'doji-challenger', 'kitsu-spiritcaller', 'akodo-toturi', 'iron-mine', 'imperial-storehouse', 'favorable-ground'],
                        dynastyDeckSize: 4
                    }
                });

                this.frontlineEngineerAttacker = this.player1.findCardByName('frontline-engineer');
                this.frontlineEngineerDefender = this.player2.findCardByName('frontline-engineer');
                this.player2.moveCard('wandering-ronin', 'dynasty deck');
                this.player2.moveCard('doji-challenger', 'dynasty deck');
                this.player2.moveCard('kitsu-spiritcaller', 'dynasty deck');
                this.player2.moveCard('akodo-toturi', 'dynasty deck');
                this.player2.moveCard('iron-mine', 'dynasty deck');

                this.storehouse = this.player2.moveCard('imperial-storehouse', 'province 1');
                this.favorable = this.player2.moveCard('favorable-ground', 'province 1');

                this.holding = this.player2.findCardByName('iron-mine');
            });

            it('should put the chosen holding face up in the defending province and discard all cards there', function () {
                expect(this.storehouse.location).toBe('province 1');
                expect(this.favorable.location).toBe('province 1');

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.frontlineEngineerAttacker],
                    defenders: [this.frontlineEngineerDefender]
                });

                this.player2.clickCard(this.frontlineEngineerDefender);
                expect(this.player2).toHavePrompt('Choose a holding');
                this.player2.clickPrompt('Iron Mine');
                expect(this.holding.location).toBe('province 1');
                expect(this.holding.facedown).toBe(false);
                expect(this.storehouse.location).toBe('dynasty discard pile');
                expect(this.favorable.location).toBe('dynasty discard pile');
                expect(this.getChatLogs(5)).toContain('player2 uses Frontline Engineer to look at the top five cards of their dynasty deck');
                expect(this.getChatLogs(4)).toContain('player2 discards Adept of the Waves, Imperial Storehouse, Favorable Ground, replacing it with Iron Mine');
                expect(this.getChatLogs(3)).toContain('player2 is shuffling their dynasty deck');
            });

            it('should be able to take nothing', function () {
                expect(this.storehouse.location).toBe('province 1');
                expect(this.favorable.location).toBe('province 1');

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.frontlineEngineerAttacker],
                    defenders: [this.frontlineEngineerDefender]
                });

                this.player2.clickCard(this.frontlineEngineerDefender);
                expect(this.player2).toHavePrompt('Choose a holding');
                expect(this.player2).toHavePromptButton('Take nothing');
                this.player2.clickPrompt('Take nothing');
                expect(this.getChatLogs(5)).toContain('player2 uses Frontline Engineer to look at the top five cards of their dynasty deck');
                expect(this.getChatLogs(4)).toContain('player2 takes nothing');
                expect(this.getChatLogs(3)).toContain('player2 is shuffling their dynasty deck');
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });
        });
    });
});

