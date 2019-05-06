describe('Trading on the Sand Road', function () {
    integration(function () {
        describe('Trading on the Sand Road\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        inPlay: ['wandering-ronin', 'otomo-courtier'],
                        hand: ['trading-on-the-sand-road'],
                        conflictDiscard: ['iuchi-wayfinder', 'forged-edict']
                    },
                    player2: {
                        inPlay: ['guardian-kami', 'otomo-courtier'],
                        hand: ['trading-on-the-sand-road', 'mono-no-aware'],
                        conflictDiscard: ['fine-katana', 'waning-hostilities', 'feral-ningyo']
                    }
                });

                this.tradingOnTheSandRoad = this.player1.findCardByName('trading-on-the-sand-road');
                this.wanderingRonin = this.player1.findCardByName('wandering-ronin');
                this.wanderingRonin.fate = 2;
                this.iuchiWayfinder = this.player1.findCardByName('iuchi-wayfinder');
                this.player1.moveCard(this.iuchiWayfinder, 'conflict deck');
                this.forgedEdict = this.player1.findCardByName('forged-edict');
                this.otomoCourtier = this.player1.findCardByName('otomo-courtier');

                this.tradingOnTheSandRoad2 = this.player2.findCardByName('trading-on-the-sand-road');
                this.guardianKami = this.player2.findCardByName('guardian-kami');
                this.monoNoAware = this.player2.findCardByName('mono-no-aware');
                this.fineKatana = this.player2.findCardByName('fine-katana');
                this.player2.moveCard(this.fineKatana, 'conflict deck');
                this.waningHostilities = this.player2.findCardByName('waning-hostilities');
                this.feralNingyo = this.player2.findCardByName('feral-ningyo');
                this.player2.moveCard(this.feralNingyo, 'conflict deck');
            });

            it('should trigger before the draw phase would begin', function () {
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.tradingOnTheSandRoad);
            });

            it('should skip the draw phase (including triggering a second \'Trading on the Sand Road\'', function () {
                this.noMoreActions();
                this.player1.clickCard(this.tradingOnTheSandRoad);
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.game.currentPhase).toBe('conflict');
            });

            it('should remove the top 4 cards from both player\'s decks from the game', function () {
                this.noMoreActions();
                let player1DeckSize = this.player1.conflictDeck.length;
                let player2DeckSize = this.player2.conflictDeck.length;
                this.player1.clickCard(this.tradingOnTheSandRoad);
                expect(this.fineKatana.location).toBe('removed from game');
                expect(this.iuchiWayfinder.location).toBe('removed from game');
                expect(this.player1.conflictDeck.length).toBe(player1DeckSize - 4);
                expect(this.player2.conflictDeck.length).toBe(player2DeckSize - 4);
                expect(this.getChatLogs(3)).toContain(
                    'player1 removes the top 4 cards from their conflict deck from the game: ' +
                    'Iuchi Wayfinder, Supernatural Storm, Supernatural Storm and Supernatural Storm'
                );
                expect(this.getChatLogs(3)).toContain(
                    'player2 removes the top 4 cards from their conflict deck from the game: ' +
                    'Feral Ningyo, Fine Katana, Supernatural Storm and Supernatural Storm'
                );
            });

            it('should allow opponent to use the cards removed from the game (attachment)', function () {
                this.noMoreActions();
                this.player1.clickCard(this.tradingOnTheSandRoad);
                this.player1.clickCard(this.fineKatana);
                this.player1.clickCard(this.wanderingRonin);
                expect(this.wanderingRonin.attachments.toArray()).toContain(this.fineKatana);
                expect(this.fineKatana.owner).toBe(this.player2.player);
                expect(this.fineKatana.controller).toBe(this.player1.player);
            });

            it('should allow your opponent to use the cards removed from the game (character)', function () {
                this.noMoreActions();
                this.player1.clickCard(this.tradingOnTheSandRoad);
                this.player1.pass();
                this.player2.clickCard(this.iuchiWayfinder);
                this.player2.clickPrompt('1');
                expect(this.iuchiWayfinder.owner).toBe(this.player1.player);
                expect(this.iuchiWayfinder.controller).toBe(this.player2.player);
            });

            it('should allow the owner to use the cards removed from the game (attachment)', function () {
                this.noMoreActions();
                this.player1.clickCard(this.tradingOnTheSandRoad);
                this.player1.pass();
                expect(this.player2).toHavePrompt('Action Window');
                this.player2.clickCard(this.fineKatana);
                this.player2.clickCard(this.guardianKami);
                expect(this.guardianKami.attachments.toArray()).toContain(this.fineKatana);
                expect(this.fineKatana.owner).toBe(this.player2.player);
                expect(this.fineKatana.controller).toBe(this.player2.player);
            });

            it('should allow either player to trigger a reaction', function () {
                this.player2.moveCard(this.waningHostilities, 'conflict deck');
                this.noMoreActions();
                this.player1.clickCard(this.tradingOnTheSandRoad);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.waningHostilities);
                expect(this.player2).toHavePrompt('Waiting for opponent');
                this.player1.clickPrompt('Pass');
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.waningHostilities);
                expect(this.player1).toHavePrompt('Waiting for opponent');
            });

            it('should allow either player to trigger an interrupt', function () {
                this.player1.moveCard(this.forgedEdict, 'conflict deck');
                this.noMoreActions();
                this.player1.clickCard(this.tradingOnTheSandRoad);
                this.player1.pass();
                this.player2.clickCard(this.monoNoAware);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.forgedEdict);
                this.player1.clickCard(this.forgedEdict);
                this.player1.clickCard(this.otomoCourtier);
                expect(this.player2).not.toHavePrompt('Triggered Abilities');
            });

            it('should not allow you to trigger feral ningyo\'s ability (only play as a conflict character)', function () {
                this.noMoreActions();
                this.player1.clickCard(this.tradingOnTheSandRoad);
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.wanderingRonin],
                    defenders: [],
                    ring: 'water'
                });
                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.player2.clickCard(this.feralNingyo);
                expect(this.player2).toHavePrompt('Choose additional fate');
            });
        });

        describe('Trading on the Sand Road\'s ability for action: cards', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        inPlay: ['wandering-ronin', 'otomo-courtier'],
                        hand: ['trading-on-the-sand-road'],
                        conflictDiscard: ['fine-katana']
                    },
                    player2: {
                        inPlay: ['guardian-kami'],
                        hand: [],
                        conflictDiscard: ['court-games', 'banzai', 'let-go']
                    }
                });

                this.tradingOnTheSandRoad = this.player1.findCardByName('trading-on-the-sand-road');
                this.wanderingRonin = this.player1.findCardByName('wandering-ronin');
                this.wanderingRonin.fate = 2;
                this.otomoCourtier = this.player1.findCardByName('otomo-courtier');
                this.fineKatana = this.player1.findCardByName('fine-katana');
                this.player1.moveCard(this.fineKatana, 'conflict deck');

                this.guardianKami = this.player2.findCardByName('guardian-kami');
                this.letGo = this.player2.findCardByName('let-go');
                this.banzai = this.player2.findCardByName('banzai');
                this.courtGames = this.player2.findCardByName('court-games');
                this.player2.moveCard(this.letGo, 'conflict deck');
                this.player2.moveCard(this.courtGames, 'conflict deck');
                this.player2.moveCard(this.banzai, 'conflict deck');

                this.noMoreActions();
                this.player1.clickCard(this.tradingOnTheSandRoad);
            });

            it('should let you use your opponents let go', function () {
                this.player1.pass();
                this.player2.clickCard(this.fineKatana);
                this.player2.clickCard(this.guardianKami);
                this.player1.clickCard(this.letGo);
                expect(this.player1).toHavePrompt('Let Go');
                this.player1.clickCard(this.fineKatana);
                expect(this.fineKatana.location).toBe('conflict discard pile');
                expect(this.letGo.location).toBe('conflict discard pile');
            });

            it('should let you play your opponents court games', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.wanderingRonin],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.courtGames);
                expect(this.player1).toHavePrompt('Court Games');
                this.player1.clickPrompt('Honor a friendly character');
                this.player1.clickCard(this.wanderingRonin);
                expect(this.wanderingRonin.isHonored).toBe(true);
                expect(this.courtGames.location).toBe('conflict discard pile');
            });

            it('should let you play your opponents banzai', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.wanderingRonin],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.banzai);
                expect(this.player1).toHavePrompt('Banzai!');
                this.player1.clickCard(this.wanderingRonin);
                this.player1.clickPrompt('Lose 1 honor to resolve this ability again');
                this.player1.clickCard(this.wanderingRonin);
                this.player1.clickPrompt('Done');
                expect(this.wanderingRonin.getMilitarySkill()).toBe(6);
                expect(this.banzai.location).toBe('conflict discard pile');
            });
        });
    });
});

