/* global jasmine */

const _ = require('underscore');
const Jasmine = require('jasmine');
const jasmine = (new Jasmine()).jasmine;
const Game = require('../../server/game/game.js');
const PlayerInteractionWrapper = require('./playerinteractionwrapper.js');
const Settings = require('../../server/settings.js');
const DeckBuilder = require('./deckbuilder.js');
const deckBuilder = new DeckBuilder();

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
        _.each(playersInPromptedOrder, player => handler(player));
    }

    startGame() {
        this.game.initialise();
    }

    /*
     * strongholds: {
        player1: String,
        player2: String
    }
     */
    selectStrongholdProvinces(strongholds = {}) {
        this.guardCurrentPhase('setup');
        this.player1.selectStrongholdProvince(strongholds.player1);
        this.player2.selectStrongholdProvince(strongholds.player2);

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
        this.selectStrongholdProvinces();
        this.keepDynasty();
        this.keepConflict();
    }

    noMoreActions() {
        if(this.game.currentPhase === 'dynasty') {
            // Players that have already passed aren't prompted again in dynasty
            this.eachPlayerStartingWithPrompted(player => {
                if(!player.player.passedDynasty) {
                    player.clickPrompt('Pass');
                }
            });
        } else {
            this.eachPlayerStartingWithPrompted(player => player.clickPrompt('Pass'));
        }
    }

    finishConflictPhase() {
        this.guardCurrentPhase('conflict');
        while(this.player1.player.conflicts.conflictOpportunities > 0 ||
            this.player2.player.conflicts.conflictOpportunities > 0) {
            try {
                this.noMoreActions();
            } catch(e) {
                // Case: handle skipping a player's conflict
                var playersInPromptedOrder = _.sortBy(this.allPlayers, player => player.hasPrompt('Waiting for opponent to declare conflict'));
                playersInPromptedOrder[0].clickPrompt('Pass Conflict');
                playersInPromptedOrder[0].clickPrompt('yes');
            }
        }
        this.noMoreActions();
        // Resolve claiming imperial favor, if any
        var claimingPlayer = _.find(this.allPlayers, player => player.hasPrompt('Which side of the Imperial Favor would you like to claim?'));
        if(claimingPlayer) {
            claimingPlayer.clickPrompt('military');
        }
        // this.guardCurrentPhase('fate');
    }

    finishFatePhase() {
        // this.guardCurrentPhase('fate');
        var playersInPromptedOrder = _.sortBy(this.allPlayers, player => player.hasPrompt('Waiting for opponent to discard dynasty cards'));
        _.each(playersInPromptedOrder, player => {
            if(player.inPlay.length > 0) {
                player.clickPrompt('Done');
            }
        });
        this.guardCurrentPhase('regroup');
    }

    finishRegroupPhase() {
        this.guardCurrentPhase('regroup');
        var playersInPromptedOrder = _.sortBy(this.allPlayers, player => player.hasPrompt('Waiting for opponent to discard dynasty cards'));
        _.each(playersInPromptedOrder, player => player.clickPrompt('Done'));
        // End the round
        var promptedToEnd = _.sortBy(this.allPlayers, player => player.hasPrompt('Waiting for opponent to end the round'));
        _.each(promptedToEnd, player => player.clickPrompt('End Round'));
        this.guardCurrentPhase('dynasty');
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
    /**
     * Factory method. Creates a new simulation of a game.
     */
    static async setupTest(options) {
        var game = new GameFlowWrapper();
        var player1 = game.player1;
        var player2 = game.player2;

        //Set defaults
        if(!options.player1) {
            options.player1 = {};
        }
        if(!options.player2) {
            options.player2 = {};
        }

        //Build decks (somehow)
        var deck1 = deckBuilder.customDeck(options.player1)
            .then(deck => player1.selectDeck(deck));
        var deck2 = deckBuilder.customDeck(options.player2)
            .then(deck => player2.selectDeck(deck));
        await Promise.all([deck1, deck2]);

        game.startGame();
        //Setup phase
        game.selectFirstPlayer(player1);
        // Select the filler province, so that provinces specified in options
        // aren't accidentally selected for stronghold
        game.selectStrongholdProvinces({
            player1: options.player1.strongholdProvince || deckBuilder.fillers.province,
            player2: options.player2.strongholdProvince || deckBuilder.fillers.province
        });
        game.keepDynasty();
        game.keepConflict();

        //Advance the phases to the specified
        game.advancePhases(options.phase);

        //Set state
        player1.fate = options.player1.fate;
        player2.fate = options.player2.fate;
        player1.hand = options.player1.hand;
        player2.hand = options.player2.hand;
        player1.inPlay = options.player1.inPlay;
        player2.inPlay = options.player2.inPlay;
        player1.dynastyDiscardPile = options.player1.dynastyDiscard;
        player2.dynastyDiscardPile = options.player2.dynastyDiscard;
        player1.conflictDiscardPile = options.player1.conflictDiscard;
        player2.conflictDiscardPile = options.player2.conflictDiscard;

        return game;
    }

    /*
     * Moves through phases, until a certain one is reached
     */
    advancePhases(endphase = 'dynasty') {
        if(endphase === 'dynasty') {
            return;
        }
        //Dynasty actions
        this.noMoreActions();

        if(endphase === 'draw') {
            return;
        }
        //Draw actions
        this.bidHonor();

        if(endphase === 'conflict') {
            return;
        }
        //Conflict actions
        this.finishConflictPhase();

        if(endphase === 'fate') {
            return;
        }
        //Fate actions
        this.finishFatePhase();

        //Finish at the regroup phase
        return;
    }
}

module.exports = GameFlowWrapper;
