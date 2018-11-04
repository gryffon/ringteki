const zmq = require('zeromq');
const router = zmq.socket('router');
const logger = require('./log.js');
const _ = require('underscore');
const monk = require('monk');
const EventEmitter = require('events');
const GameService = require('./services/GameService.js');

class GameRouter extends EventEmitter {
    constructor(config) {
        super();

        this.workers = {};
        this.gameService = new GameService(monk(config.dbPath));

        router.bind(config.mqUrl, err => {
            if(err) {
                logger.info(err);
            }
        });

        router.on('message', this.onMessage.bind(this));

        setInterval(this.checkTimeouts.bind(this), 1000 * 60);
    }

    // External methods
    startGame(game) {
        var node = this.getNextAvailableGameNode();

        if(!node) {
            logger.error('Could not find new node for game');
            return;
        }

        this.gameService.create(game.getSaveState());

        node.numGames++;

        this.sendCommand(node.identity, 'STARTGAME', game);
        return node;
    }

    addSpectator(game, user) {
        this.sendCommand(game.node.identity, 'SPECTATOR', { game: game, user: user });
    }

    getNextAvailableGameNode() {
        if(_.isEmpty(this.workers)) {
            return undefined;
        }

        var returnedWorker = undefined;

        _.each(this.workers, worker => {
            if(worker.numGames >= worker.maxGames || worker.disabled) {
                return;
            }

            if(!returnedWorker || returnedWorker.numGames > worker.numGames) {
                returnedWorker = worker;
            }
        });

        return returnedWorker;
    }

    getNodeStatus() {
        return _.map(this.workers, worker => {
            return { name: worker.identity, numGames: worker.numGames, status: worker.disabled ? 'disabled' : 'active' };
        });
    }

    disableNode(nodeName) {
        var worker = this.workers[nodeName];
        if(!worker) {
            return false;
        }

        worker.disabled = true;

        return true;
    }

    enableNode(nodeName) {
        var worker = this.workers[nodeName];
        if(!worker) {
            return false;
        }

        worker.disabled = false;

        return true;
    }

    notifyFailedConnect(game, username) {
        if(!game.node) {
            return;
        }

        this.sendCommand(game.node.identity, 'CONNECTFAILED', { gameId: game.id, username: username });
    }

    closeGame(game) {
        if(!game.node) {
            return;
        }

        this.sendCommand(game.node.identity, 'CLOSEGAME', { gameId: game.id });
    }

    // Events
    onMessage(identity, msg) {
        var identityStr = identity.toString();

        var worker = this.workers[identityStr];

        var message = undefined;

        try {
            message = JSON.parse(msg.toString());
        } catch(err) {
            logger.info(err);
            return;
        }

        switch(message.command) {
            case 'HELLO':
                this.emit('onWorkerStarted', identityStr);
                this.workers[identityStr] = {
                    identity: identityStr,
                    maxGames: message.arg.maxGames,
                    numGames: 0,
                    address: message.arg.address,
                    port: message.arg.port,
                    protocol: message.arg.protocol
                };
                worker = this.workers[identityStr];

                this.emit('onNodeReconnected', identityStr, message.arg.games);

                worker.numGames = _.size(message.arg.games);

                break;
            case 'PONG':
                if(worker) {
                    worker.pingSent = undefined;
                } else {
                    logger.error('PONG received for unknown worker');
                }
                break;
            case 'GAMEWIN':
                this.gameService.update(message.arg.game);
                break;
            case 'GAMECLOSED':
                if(worker) {
                    worker.numGames--;
                } else {
                    logger.error('Got close game for non existant worker', identity);
                }

                this.emit('onGameClosed', message.arg.game);

                break;
            case 'PLAYERLEFT':
                if(!message.arg.spectator) {
                    this.gameService.update(message.arg.game);
                }

                this.emit('onPlayerLeft', message.arg.gameId, message.arg.player);

                break;
        }

        if(worker) {
            worker.lastMessage = Date.now();
        }
    }

    // Internal methods
    sendCommand(identity, command, arg) {
        router.send([identity, '', JSON.stringify({ command: command, arg: arg })]);
    }

    checkTimeouts() {
        var currentTime = Date.now();
        const pingTimeout = 1 * 60 * 1000;

        _.each(this.workers, worker => {
            if(worker.pingSent && currentTime - worker.pingSent > pingTimeout) {
                logger.info('worker', worker.identity + ' timed out');
                delete this.workers[worker.identity];
                this.emit('onWorkerTimedOut', worker.identity);
            } else if(!worker.pingSent) {
                if(currentTime - worker.lastMessage > pingTimeout) {
                    worker.pingSent = currentTime;
                    this.sendCommand(worker.identity, 'PING');
                }
            }
        });
    }
}

module.exports = GameRouter;
