/* global jasmine */

const _ = require('underscore');
const Jasmine = require('jasmine');
const jasmine = (new Jasmine()).jasmine;
const Game = require('../../server/game/game.js');
const PlayerInteractionWrapper = require('./playerinteractionwrapper.js');
const Settings = require('../../server/settings.js');

class GameFlowWrapper {
    constructor() {
        var gameRouter = jasmine.createSpyObj('gameRouter', ['gameWon', 'playerLeft', 'reportError']);
        var details = {
            name: 'player1\'s game',
            id: 12345,
            owner: 'player1',
            saveGameId: 12345,
            players: [
                { id: '111', user: Settings.getUserWithDefaultsSet({ username: 'player1' }) },
                { id: '222', user: Settings.getUserWithDefaultsSet({ username: 'player2' }) }
            ]
        };
        this.game = new Game(details, { router: gameRouter });

        this.player1 = new PlayerInteractionWrapper(this.game, this.game.getPlayerByName('player1'));
        this.player2 = new PlayerInteractionWrapper(this.game, this.game.getPlayerByName('player2'));
        this.allPlayers = [this.player1, this.player2];
    }

    get firstPlayer() {
        return _.find(this.allPlayers, player => player.firstPlayer);
    }

    eachPlayerInFirstPlayerOrder(handler) {
        var playersInOrder = _.sortBy(this.allPlayers, player => !player.firstPlayer);

        _.each(playersInOrder, player => handler(player));
    }

    eachPlayerStartingWithPrompted(handler) {
        var playersInPromptedOrder = _.sortBy(this.allPlayers, player => player.hasPrompt('Waiting for opponent to take an action or pass'));

        _.each(playersInPromptedOrder, player=> handler(player));
    }

    startGame() {
        this.game.initialise();
    }

    selectProvinces() {
        this.guardCurrentPhase('setup');
        this.eachPlayerInFirstPlayerOrder(player => {
            let card = player.player.provinceDeck.value()[0];
            player.clickCard(card);
            player.clickPrompt('Done');
        });
    }

    keepDynasty() {
        this.guardCurrentPhase('setup');
        this.eachPlayerInFirstPlayerOrder(player => player.clickPrompt('Done'));
    }

    keepConflict() {
        this.guardCurrentPhase('setup');
        this.eachPlayerInFirstPlayerOrder(player => player.clickPrompt('Done'));
    }

    skipSetupPhase() {
        this.selectProvinces();
        this.keepDynasty();
        this.keepConflict();
    }

    noMoreActions() {
        if(this.game.currentPhase === 'dynasty') {
            this.eachPlayerStartingWithPrompted(player => {
                if(!player.player.passedDynasty) {
                    player.clickPrompt('Pass');
                }
            });
        } else {
            this.eachPlayerStartingWithPrompted(player => player.clickPrompt('Pass'));
        }
    }

    /*
        Executes the honor bidding
    */
    bidHonor(player1amt = 1, player2amt = 1) {
        this.guardCurrentPhase('draw');
        this.player1.bidHonor(player1amt);
        this.player2.bidHonor(player2amt);
        this.guardCurrentPhase('conflict');
    }

    guardCurrentPhase(phase) {
        if(this.game.currentPhase !== phase) {
            throw new Error(`Expected to be in the ${phase} phase but actually was ${this.game.currentPhase}`);
        }
    }

    getPromptedPlayer(title) {
        var promptedPlayer = this.allPlayers.find(p => p.hasPrompt(title));

        if(!promptedPlayer) {
            var promptString = _.map(this.allPlayers, player => player.name + ': ' + player.formatPrompt()).join('\n\n');
            throw new Error(`No players are being prompted with "${title}". Current prompts are:\n\n${promptString}`);
        }

        return promptedPlayer;
    }

    selectFirstPlayer(player) {
        var promptedPlayer = this.getPromptedPlayer('You won the flip. Do you want to be:');
        if(player === promptedPlayer) {
            promptedPlayer.clickPrompt('First Player');
        } else {
            promptedPlayer.clickPrompt('Second Player');
        }
    }

}

module.exports = GameFlowWrapper;
