const Game = require('../../../build/server/game/game.js');

describe('Game', function() {
    beforeEach(function() {
        this.gameService = jasmine.createSpyObj('gameService', ['save']);
        this.game = new Game('1', 'Test Game', { gameService: this.gameService });

        this.notSetPlayer1 = { id: '1', name: 'test' };
        this.notSetPlayer2 = { id: '2', name: 'test2' };
        this.setFalsePlayer1 = { id: '1', name: 'test', firstPlayer: false };
        this.setFalsePlayer2 = { id: '2', name: 'test2', firstPlayer: false };
        this.setPlayer1 = { id: '1', name: 'test', firstPlayer: true };
        this.setPlayer2 = { id: '2', name: 'test2', firstPlayer: true };
    });

    describe('getPlayersInFirstPlayer Order', function() {
        describe('when there are no players', function() {
            beforeEach(function() {
                this.players = this.game.getPlayersInFirstPlayerOrder();
            });

            it('should return an empty list', function() {
                expect(this.players.length).toBe(0);
            });
        });

        describe('when there is one player', function() {
            describe('and first player is not set yet', function() {
                beforeEach(function() {
                    this.game.playersAndSpectators['test1'] = this.notSetPlayer1;

                    this.players = this.game.getPlayersInFirstPlayerOrder();
                });

                it('should return the player', function() {
                    expect(this.players[0]).toBe(this.notSetPlayer1);
                });
            });

            describe('and the first player is set', function() {
                beforeEach(function() {
                    this.game.playersAndSpectators['test1'] = this.setPlayer1;

                    this.players = this.game.getPlayersInFirstPlayerOrder();
                });

                it('should return the player', function() {
                    expect(this.players[0]).toBe(this.setPlayer1);
                });
            });
        });

        describe('when there are two players', function() {
            describe('when player 1 is first player', function() {
                beforeEach(function() {
                    this.game.playersAndSpectators['test1'] = this.setPlayer1;
                    this.game.playersAndSpectators['test2'] = this.notSetPlayer2;

                    this.players = this.game.getPlayersInFirstPlayerOrder();
                });

                it('should return player 1 then player 2', function() {
                    this.game.playersAndSpectators['test1'] = this.setPlayer1;
                    expect(this.players[0]).toBe(this.setPlayer1);
                    expect(this.players[1]).toBe(this.notSetPlayer2);
                });
            });

            describe('when player 2 is first player', function() {
                beforeEach(function() {
                    this.game.playersAndSpectators['test1'] = this.notSetPlayer1;
                    this.game.playersAndSpectators['test2'] = this.setPlayer2;

                    this.players = this.game.getPlayersInFirstPlayerOrder();
                });

                it('should return player 2 then player 1', function() {
                    expect(this.players[0]).toBe(this.setPlayer2);
                    expect(this.players[1]).toBe(this.notSetPlayer1);
                });
            });

            describe('when player 2 is first player and player 1 is explicitly not first player', function() {
                beforeEach(function() {
                    this.game.playersAndSpectators['test1'] = this.setFalsePlayer1;
                    this.game.playersAndSpectators['test2'] = this.setPlayer2;

                    this.players = this.game.getPlayersInFirstPlayerOrder();
                });

                it('should return player 2 then player 1', function() {
                    expect(this.players[0]).toBe(this.setPlayer2);
                    expect(this.players[1]).toBe(this.setFalsePlayer1);
                });
            });
        });
    });
});
