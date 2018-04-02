const DrawCard = require('../../../server/game/drawcard.js');

describe('the DrawCard', function() {
    describe('the hasKeyword() function', function() {
        beforeEach(function() {
            this.owner = { noTimer: true };
            this.card = new DrawCard(this.owner, {});
        });

        it('should return false if no keyword has been added', function() {
            expect(this.card.hasKeyword('covert')).toBe(false);
        });

        it('should return true if a keyword has been added', function() {
            this.card.addKeyword('covert');
            expect(this.card.hasKeyword('covert')).toBe(true);
        });

        it('should not be case sensitive', function() {
            this.card.addKeyword('Intimidate');
            expect(this.card.hasKeyword('InTiMiDaTe')).toBe(true);
        });

        it('should return true if a keyword has been added more than it has been removed', function() {
            this.card.addKeyword('covert');
            this.card.addKeyword('covert');
            this.card.removeKeyword('covert');
            expect(this.card.hasKeyword('covert')).toBe(true);
        });

        it('should return false if a keyword has been removed more than it has been added', function() {
            this.card.removeKeyword('covert');
            this.card.removeKeyword('covert');
            this.card.addKeyword('covert');
            expect(this.card.hasKeyword('covert')).toBe(false);
        });
    });

    describe('integration', function() {
        const _ = require('underscore');

        const Game = require('../../../server/game/game.js');
        const Player = require('../../../server/game/player.js');

        beforeEach(function() {
            this.gameService = jasmine.createSpyObj('gameService', ['save']);
            this.game = new Game({}, { gameService: this.gameService });

            this.player = new Player(1, { username: 'foo', settings: {} }, false, this.game);
            this.player.noTimer = true;
            this.player2 = new Player(2, { username: 'bar', settings: {} }, false, this.game);

            this.game.playersAndSpectators['foo'] = this.player;
            this.game.playersAndSpectators['bar'] = this.player2;
            this.game.initialise();

            this.game.currentPhase = 'dynasty';
            this.player.phase = 'dynasty';
        });

        describe('parsing initial keywords', function() {
            describe('when the card mentions a keyword in its body', function() {
                beforeEach(function() {
                    this.card = new DrawCard(this.player, { text: 'Each <i>Covert</i> character you control cannot be bypassed by covert.' });
                    this.card.location = 'hand';
                    this.player.hand = _([this.card]);
                    this.player.findAndUseAction(this.card);
                    // Resolve events in pipeline.
                    this.game.continue();
                });

                it('should return false.', function() {
                    expect(this.card.hasKeyword('covert')).toBe(false);
                });
            });

            describe('when the card has a keyword line', function() {
                beforeEach(function() {
                    this.card = new DrawCard(this.player, { type: 'character', cost: 0, side: 'dynasty', text_canonical: 'covert.\nsomestuff. restricted.\nnotarealkeyword.\nextra text because we need stuff here.' });
                    this.card.location = 'province 1';
                    this.player.provinceOne = _([this.card]);
                    this.player.dynastyDeck = _([new DrawCard(this.player, {})]);
                    this.player.moveCard(this.card, 'play area');
                    // Resolve events in pipeline.
                    this.game.continue();
                });

                it('should return true for each keyword', function() {
                    expect(this.card.hasKeyword('covert')).toBe(true);
                    expect(this.card.hasKeyword('Restricted')).toBe(true);
                });

                it('should reject non-valid keywords', function() {
                    expect(this.card.hasKeyword('Notarealkeyword')).toBe(false);
                });

                it('should not blank externally given keywords', function() {
                    this.card.addKeyword('Sincerity');
                    this.card.setBlank();
                    // Resolve events in pipeline.
                    this.game.continue();
                    expect(this.card.hasKeyword('covert')).toBe(false);
                    expect(this.card.hasKeyword('Restricted')).toBe(false);
                    expect(this.card.hasKeyword('Sincerity')).toBe(true);
                });
            });
        });
    });
});
