const ActionWindow = require('../../../server/game/gamesteps/actionwindow.js');
const Game = require('../../../server/game/game.js');
const Player = require('../../../server/game/player.js');
const Settings = require('../../../server/settings.js');

describe('ActionWindow', function() {
    beforeEach(function() {
        this.gameService = jasmine.createSpyObj('gameService', ['save']);
        this.game = new Game('1', 'Test Game', { gameService: this.gameService });
        this.player1 = new Player('1', Settings.getUserWithDefaultsSet({ username: 'Player 1' }), true, this.game);
        this.player2 = new Player('2', Settings.getUserWithDefaultsSet({ username: 'Player 2' }), false, this.game);
        this.player2.firstPlayer = true;
        this.player1.opponent = this.player2;
        this.player2.opponent = this.player1;
        this.game.playersAndSpectators[this.player1.name] = this.player1;
        this.game.playersAndSpectators[this.player2.name] = this.player2;

        this.player1.promptedActionWindows['test'] = true;
        this.player2.promptedActionWindows['test'] = true;

        this.prompt = new ActionWindow(this.game, 'Test Window', 'test');
    });

    it('should prompt in first player order', function() {
        expect(this.prompt.currentPlayer).toBe(this.player2);
    });

    describe('menuCommand()', function() {
        describe('when it is the current player',function() {
            beforeEach(function() {
                this.prompt.menuCommand(this.player2, 'pass');
            });

            it('should make the next player be the current player', function() {
                expect(this.prompt.currentPlayer).toBe(this.player1);
            });
        });

        describe('when it is not the current player',function() {
            beforeEach(function() {
                this.prompt.onMenuCommand(this.player1, 'pass');
            });

            it('should not change the current player', function() {
                expect(this.prompt.currentPlayer).toBe(this.player2);
            });
        });
    });

    describe('markActionAsTaken()', function() {
        describe('when a player takes an action', function() {
            beforeEach(function() {
                // Complete the window for player 2
                this.prompt.menuCommand(this.player2, 'pass');

                // Player 1 takes an action
                this.prompt.markActionAsTaken();
            });

            it('should rotate the current player', function() {
                expect(this.prompt.currentPlayer).toBe(this.player2);
            });

            it('should re-prompt other players once the current player is done', function() {
                this.prompt.menuCommand(this.player2, 'pass');
                expect(this.prompt.currentPlayer).toBe(this.player1);
                expect(this.prompt.isComplete()).toBe(false);
            });

            it('should require two consecutive passes before completing', function() {
                // Complete without taking action
                this.prompt.menuCommand(this.player2, 'pass');
                this.prompt.menuCommand(this.player1, 'pass');

                expect(this.prompt.isComplete()).toBe(true);
            });
        });
    });

    describe('continue()', function() {
        describe('when not all players are done', function() {
            beforeEach(function() {
                this.prompt.menuCommand(this.player2, 'pass');
            });

            it('should return false', function() {
                expect(this.prompt.continue()).toBe(false);
            });
        });

        describe('when all players are done', function() {
            beforeEach(function() {
                this.prompt.menuCommand(this.player2, 'pass');
                this.prompt.menuCommand(this.player1, 'pass');
            });

            it('should return true', function() {
                expect(this.prompt.continue()).toBe(true);
            });
        });
    });
});
