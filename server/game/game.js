const _ = require('underscore');
const EventEmitter = require('events');

const ChatCommands = require('./chatcommands.js');
const GameChat = require('./gamechat.js');
const EffectEngine = require('./effectengine.js');
const Player = require('./player.js');
const Spectator = require('./spectator.js');
const AnonymousSpectator = require('./anonymousspectator.js');
const GamePipeline = require('./gamepipeline.js');
const SetupPhase = require('./gamesteps/setupphase.js');
const DynastyPhase = require('./gamesteps/dynastyphase.js');
const DrawPhase = require('./gamesteps/drawphase.js');
const ConflictPhase = require('./gamesteps/conflictphase.js');
const FatePhase = require('./gamesteps/fatephase.js');
const RegroupPhase = require('./gamesteps/regroupphase.js');
const SimpleStep = require('./gamesteps/simplestep.js');
const MenuPrompt = require('./gamesteps/menuprompt.js');
const HandlerMenuPrompt = require('./gamesteps/handlermenuprompt.js');
const SelectCardPrompt = require('./gamesteps/selectcardprompt.js');
const SelectRingPrompt = require('./gamesteps/selectringprompt.js');
const GameWonPrompt = require('./gamesteps/GameWonPrompt');
const GameActions = require('./GameActions/GameActions');
const EventBuilder = require('./Events/EventBuilder.js');
const EventWindow = require('./Events/EventWindow.js');
const ThenEventWindow = require('./Events/ThenEventWindow');
const InitiateAbilityEventWindow = require('./Events/InitiateAbilityEventWindow.js');
const AbilityResolver = require('./gamesteps/abilityresolver.js');
const SimultaneousEffectWindow = require('./gamesteps/SimultaneousEffectWindow');
const AbilityContext = require('./AbilityContext.js');
const Ring = require('./ring.js');
const Duel = require('./Duel.js');
const DuelFlow = require('./gamesteps/DuelFlow.js');
const MenuCommands = require('./MenuCommands');

class Game extends EventEmitter {
    constructor(details, options = {}) {
        super();

        this.effectEngine = new EffectEngine(this);
        this.playersAndSpectators = {};
        this.playerCards = {};
        this.gameChat = new GameChat();
        this.chatCommands = new ChatCommands(this);
        this.pipeline = new GamePipeline();
        this.id = details.id;
        this.name = details.name;
        this.allowSpectators = details.allowSpectators;
        this.spectatorSquelch = details.spectatorSquelch;
        this.owner = details.owner;
        this.started = false;
        this.playStarted = false;
        this.createdAt = new Date();
        this.savedGameId = details.savedGameId;
        this.gameType = details.gameType;
        this.currentActionWindow = null;
        this.currentEventWindow = null;
        this.currentConflict = null;
        this.currentDuel = null;
        this.manualMode = false;
        this.cancelPromptUsed = false;
        this.currentPhase = '';
        this.password = details.password;
        this.roundNumber = 0;

        this.militaryConflictCompleted = false;
        this.politicalConflictCompleted = false;
        this.rings = {
            air: new Ring(this, 'air','military'),
            earth: new Ring(this, 'earth','political'),
            fire: new Ring(this, 'fire','military'),
            void: new Ring(this, 'void','political'),
            water: new Ring(this, 'water','military')
        };
        this.shortCardData = options.shortCardData || [];

        _.each(details.players, player => {
            this.playersAndSpectators[player.user.username] = new Player(player.id, player.user, this.owner === player.user.username, this);
        });

        _.each(details.spectators, spectator => {
            this.playersAndSpectators[spectator.user.username] = new Spectator(spectator.id, spectator.user);
        });

        this.setMaxListeners(0);

        this.router = options.router;
    }
    /*
     * Reports errors from the game engine back to the router
     * @param {type} e
     * @returns {undefined}
     */
    reportError(e) {
        this.router.handleError(this, e);
    }

    /*
     * Adds a message to the in-game chat e.g 'Jadiel draws 1 card'
     * @param {String} message to display (can include {i} references to args)
     * @param {} args to match the references in @string
     * @returns {undefined}
     */
    addMessage() {
        this.gameChat.addMessage(...arguments);
    }

    /*
     * Adds a message to in-game chat with a graphical icon
     * @param {String} one of: 'endofround', 'success', 'info', 'danger', 'warning'
     * @param {String} message to display (can include {i} references to args)
     * @param {} args to match the references in @string
     * @returns {undefined}
     */
    addAlert() {
        this.gameChat.addAlert(...arguments);
    }

    get messages() {
        return this.gameChat.messages;
    }

    /*
     * Checks if a player is a spectator
     * @param {Object} player
     * @returns {Boolean}
     */
    isSpectator(player) {
        return player.constructor === Spectator;
    }

    /*
     * Checks whether a player/spectator is still in the game
     * @param {String} playerName
     * @returns {Boolean}
     */
    hasActivePlayer(playerName) {
        return this.playersAndSpectators[playerName] && !this.playersAndSpectators[playerName].left;
    }

    /*
     * Get all players (not spectators) in the game
     * @returns {Object} {name1: Player, name2: Player}
     */
    getPlayers() {
        return _.omit(this.playersAndSpectators, player => this.isSpectator(player));
    }

    /*
     * Returns the Player object (not spectator) for a name
     * @param {String} playerName
     * @returns {Player}
     */
    getPlayerByName(playerName) {
        return this.getPlayers()[playerName];
    }

    /*
     * Get all players (not spectators) with the first player at index 0
     * @returns {Array} Array of Player objects
     */
    getPlayersInFirstPlayerOrder() {
        return _.sortBy(this.getPlayers(), player => !player.firstPlayer);
    }

    /*
     * Get all players and spectators in the game
     * @returns {Object} {name1: Player, name2: Player, name3: Spectator}
     */
    getPlayersAndSpectators() {
        return this.playersAndSpectators;
    }

    /*
     * Get all spectators in the game
     * @returns {Object} {name1: Spectator, name2: Spectator}
     */
    getSpectators() {
        return _.pick(this.playersAndSpectators, player => this.isSpectator(player));
    }

    /*
     * Gets the current First Player
     * @returns {Player}
     */
    getFirstPlayer() {
        return _.find(this.getPlayers(), p => {
            return p.firstPlayer;
        });
    }

    /*
     * Gets a player other than the one passed (usually their opponent)
     * @param {Player} player
     * @returns {Player}
     */
    getOtherPlayer(player) {
        var otherPlayer = _.find(this.getPlayers(), p => {
            return p.name !== player.name;
        });

        return otherPlayer;
    }

    /*
     * Returns the card (i.e. character) with matching uuid from either players
     * 'in play' area.
     * @param {String} cardId
     * @returns {DrawCard}
     */
    findAnyCardInPlayByUuid(cardId) {
        return _.reduce(this.getPlayers(), (card, player) => {
            if(card) {
                return card;
            }
            return player.findCardInPlayByUuid(cardId);
        }, null);
    }

    /*
     * Returns the card with matching uuid from anywhere in the game
     * @param {String} cardId
     * @returns {BaseCard}
     */
    findAnyCardInAnyList(cardId) {
        return this.allCards.find(card => card.uuid === cardId);
    }

    /*
     * Returns all cards (i.e. characters) which matching the passed predicated
     * function from either players 'in play' area.
     * @param {Function} predicate - card => Boolean
     * @returns {Array} Array of DrawCard objects
     */
    findAnyCardsInPlay(predicate) {
        var foundCards = [];

        _.each(this.getPlayers(), player => {
            foundCards = foundCards.concat(player.findCards(player.cardsInPlay, predicate));
        });

        return foundCards;
    }

    /*
     * This function is called from the client whenever a card is clicked
     * @param {String} sourcePlayer - name of the clicking player
     * @param {String} cardId - uuid of the card clicked
     * @returns {undefined}
     */
    cardClicked(sourcePlayer, cardId) {
        var player = this.getPlayerByName(sourcePlayer);

        if(!player) {
            return;
        }

        var card = this.findAnyCardInAnyList(cardId);

        if(!card) {
            return;
        }

        // Check to see if the current step in the pipeline is waiting for input
        this.pipeline.handleCardClicked(player, card);
    }

    /*
     * This function is called from the client whenever a ring is clicked
     * @param {String} sourcePlayer - name of the clicking player
     * @param {String} ringindex - element of the ring clicked
     * @returns {undefined}
     */
    ringClicked(sourcePlayer, ringindex) {
        var ring = this.rings[ringindex];
        var player = this.getPlayerByName(sourcePlayer);

        if(!player || !ring) {
            return;
        }

        // Check to see if the current step in the pipeline is waiting for input
        if(this.pipeline.handleRingClicked(player, ring)) {
            return;
        }

        // If it's not the conflict phase and the ring hasn't been claimed, flip it
        if(this.currentPhase !== 'conflict' && !ring.claimed) {
            ring.flipConflictType();
        }
    }

    /**
     * This function is called by the client when a card menu item is clicked
     * @param {String} sourcePlayer - name of clicking player
     * @param {String} cardId - uuid of card whose menu was clicked
     * @param {Object} menuItem - { command: String, text: String, arg: String, method: String }
     * @returns {undefined}
     */
    menuItemClick(sourcePlayer, cardId, menuItem) {
        var player = this.getPlayerByName(sourcePlayer);
        var card = this.findAnyCardInAnyList(cardId);
        if(!player || !card) {
            return;
        }

        if(menuItem.command === 'click') {
            this.cardClicked(sourcePlayer, cardId);
            return;
        }

        MenuCommands.cardMenuClick(menuItem, this, player, card);
        this.checkGameState(true);
    }

    /*
     * This function is called by the client when a ring menu item is clicked
     * @param {String} sourcePlayer - name of clicking player
     * @param {Object} sourceRing - not sure what this is, but it has an element!
     * @param {Object} menuItem - { command: String, text: String, arg: String, method: String }
     * @returns {undefined}
     */
    ringMenuItemClick(sourcePlayer, sourceRing, menuItem) {
        var player = this.getPlayerByName(sourcePlayer);
        var ring = this.rings[sourceRing.element];
        if(!player || !ring) {
            return;
        }

        if(menuItem.command === 'click') {
            this.ringClicked(sourcePlayer, ring.element);
            return;
        }
        MenuCommands.ringMenuClick(menuItem, this, player, ring);
        this.checkGameState(true);
    }

    /*
     * Sets a Player flag and displays a chat message to show that a popup with a
     * player's conflict deck is open
     * @param {String} playerName
     * @returns {undefined}
     */
    showConflictDeck(playerName) {
        var player = this.getPlayerByName(playerName);

        if(!player) {
            return;
        }

        if(!player.showConflict) {
            player.showConflictDeck();

            this.addMessage('{0} is looking at their conflict deck', player);
        } else {
            player.showConflict = false;

            this.addMessage('{0} stops looking at their conflict deck', player);
        }
    }

    /*
     * Sets a Player flag and displays a chat message to show that a popup with a
     * player's dynasty deck is open
     * @param {String} playerName
     * @returns {undefined}
     */
    showDynastyDeck(playerName) {
        var player = this.getPlayerByName(playerName);

        if(!player) {
            return;
        }

        if(!player.showDynasty) {
            player.showDynastyDeck();

            this.addMessage('{0} is looking at their dynasty deck', player);
        } else {
            player.showDynasty = false;

            this.addMessage('{0} stops looking at their dynasty deck', player);
        }
    }

    /*
     * This function is called from the client whenever a card is dragged from
     * one place to another
     * @param {String} playerName
     * @param {String} cardId - uuid of card
     * @param {String} source - area where the card was dragged from
     * @param {String} target - area where the card was dropped
     * @returns {undefined}
     */
    drop(playerName, cardId, source, target) {
        var player = this.getPlayerByName(playerName);

        if(!player) {
            return;
        }

        player.drop(cardId, source, target);
    }

    /*
     * Change a players total honor
     * @param {Player} player
     * @param {Int} honor
     * @returns {undefined}
     */
    addHonor(player, honor) {
        player.honor += honor;

        if(player.honor < 0) {
            player.honor = 0;
        }

        this.checkWinCondition(player);
    }

    /*
     * Change a players total fate
     * @param {Player} player
     * @param {Int} fate
     * @returns {undefined}
     */
    addFate(player, fate) {
        player.fate += fate;

        if(player.fate < 0) {
            player.fate = 0;
        }
    }

    /*
     * Transfer honor from one player to another (NB: parameters for honor are
     * the opposite way round to those for fate!)
     * @param {Player} source
     * @param {Player} target
     * @param {Int} honor
     * @returns {undefined}
     */
    transferHonor(source, target, honor) {
        var appliedHonor = Math.min(source.honor, honor);
        source.honor -= appliedHonor;
        target.honor += appliedHonor;

        this.checkWinCondition(target);
        this.checkWinCondition(source);
    }

    /*
     * Transfer fate from one player to another (NB: parameters for honor are
     * the opposite way round to those for fate!)
     * @param {Player} to
     * @param {Player} from
     * @param {Int} fate
     * @returns {undefined}
     */
    transferFate(to, from, fate) {
        var appliedFate = Math.min(from.fate, fate);

        from.fate -= appliedFate;
        to.fate += appliedFate;

        this.raiseEvent('onFateTransferred', { source: from, target: to, amount: fate });
    }

    /*
     * Check to see if this player has won/lost the game due to honor (NB: this
     * function doesn't check to see if a conquest victory has been achieved)
     * @param {Player} player
     * @returns {undefined}
     */
    checkWinCondition(player) {
        if(player.getTotalHonor() >= 25) {
            this.recordWinner(player, 'honor');
        } else if(player.getTotalHonor() === 0) {
            var opponent = this.getOtherPlayer(player);
            if(opponent) {
                this.recordWinner(opponent, 'dishonor');
            }
        }

    }

    /*
     * Display message declaring victory for one player, and record stats for
     * the game
     * @param {Player} winner
     * @param {String} reason
     * @returns {undefined}
     */
    recordWinner(winner, reason) {
        if(this.winner) {
            return;
        }

        this.addMessage('{0} has won the game', winner);

        this.winner = winner;
        this.finishedAt = new Date();
        this.winReason = reason;

        this.router.gameWon(this, reason, winner);

        this.queueStep(new GameWonPrompt(this, winner));
    }

    /*
     * Designate a player as First Player
     * @param {Player} firstPlayer
     * @returns {undefined}
     */
    setFirstPlayer(firstPlayer) {
        _.each(this.getPlayers(), player => {
            if(player === firstPlayer) {
                player.firstPlayer = true;
            } else {
                player.firstPlayer = false;
            }
        });
    }

    /*
     * Changes a Player variable and displays a message in chat
     * @param {String} playerName
     * @param {String} stat
     * @param {Int} value
     * @returns {undefined}
     */
    changeStat(playerName, stat, value) {
        var player = this.getPlayerByName(playerName);
        if(!player) {
            return;
        }

        var target = player;

        target[stat] += value;

        if(target[stat] < 0) {
            target[stat] = 0;
        } else {
            this.addMessage('{0} sets {1} to {2} ({3})', player, stat, target[stat], (value > 0 ? '+' : '') + value);
        }
    }

    /*
     * This function is called by the client every time a player enters a chat message
     * @param {String} playerName
     * @param {String} message
     * @returns {undefined}
     */
    chat(playerName, message) {
        var player = this.playersAndSpectators[playerName];
        var args = message.split(' ');

        if(!player) {
            return;
        }

        if(!this.isSpectator(player)) {
            if(this.chatCommands.executeCommand(player, args[0], args)) {
                this.checkGameState(true);
                return;
            }

            let card = _.find(this.shortCardData, c => {
                return c.name.toLowerCase() === message.toLowerCase() || c.id.toLowerCase() === message.toLowerCase();
            });

            if(card) {
                this.gameChat.addChatMessage('{0} {1}', player, card);

                return;
            }
        }

        if(!this.isSpectator(player) || !this.spectatorSquelch) {
            this.gameChat.addChatMessage('{0} {1}', player, message);
        }
    }

    /*
     * This is called by the client when a player clicks 'Concede'
     * @param {String} playerName
     * @returns {undefined}
     */
    concede(playerName) {
        var player = this.getPlayerByName(playerName);

        if(!player) {
            return;
        }

        this.addMessage('{0} concedes', player);

        var otherPlayer = this.getOtherPlayer(player);

        if(otherPlayer) {
            this.recordWinner(otherPlayer, 'concede');
        }
    }

    selectDeck(playerName, deck) {
        let player = this.getPlayerByName(playerName);
        if(player) {
            player.selectDeck(deck);
        }

    }

    /*
     * Called when a player clicks Shuffle Deck on the conflict deck menu in
     * the client
     * @param {String} playerName
     * @returns {undefined}
     */
    shuffleConflictDeck(playerName) {
        let player = this.getPlayerByName(playerName);
        if(player) {
            player.shuffleConflictDeck();
        }
    }

    /*
     * Called when a player clicks Shuffle Deck on the dynasty deck menu in
     * the client
     * @param {String} playerName
     * @returns {undefined}
     */
    shuffleDynastyDeck(playerName) {
        let player = this.getPlayerByName(playerName);
        if(player) {
            player.shuffleDynastyDeck();
        }
    }

    /*
     * Prompts a player with a multiple choice menu
     * @param {Player} player
     * @param {Object} contextObj - the object which contains the methods that are referenced by the menubuttons
     * @param {Object} properties - see menuprompt.js
     * @returns {undefined}
     */
    promptWithMenu(player, contextObj, properties) {
        this.queueStep(new MenuPrompt(this, player, contextObj, properties));
    }

    /*
     * Prompts a player with a multiple choice menu
     * @param {Player} player
     * @param {Object} properties - see handlermenuprompt.js
     * @returns {undefined}
     */
    promptWithHandlerMenu(player, properties) {
        this.queueStep(new HandlerMenuPrompt(this, player, properties));
    }

    /*
     * Prompts a player to click a card
     * @param {Player} player
     * @param {Object} properties - see selectcardprompt.js
     * @returns {undefined}
     */
    promptForSelect(player, properties) {
        this.queueStep(new SelectCardPrompt(this, player, properties));
    }

    /*
     * Prompts a player to click a ring
     * @param {Player} player
     * @param {Object} properties - see selectringprompt.js
     * @returns {undefined}
     */
    promptForRingSelect(player, properties) {
        this.queueStep(new SelectRingPrompt(this, player, properties));
    }

    /*
     * This function is called by the client whenever a player clicks a button
     * in a prompt
     * @param {String} playerName
     * @param {String} arg - arg property of the button clicked
     * @param {String} uuid - unique identifier of the prompt clicked
     * @param {String} method - method property of the button clicked
     * @returns {Boolean} no idea what this does...
     */
    menuButton(playerName, arg, uuid, method) {
        var player = this.getPlayerByName(playerName);
        if(!player) {
            return false;
        }

        // check to see if the current step in the pipeline is waiting for input
        return this.pipeline.handleMenuCommand(player, arg, uuid, method);
    }

    /*
     * This function is called by the client when a player clicks an action window
     * toggle in the settings menu
     * @param {String} playerName
     * @param {String} windowName - the name of the action window being toggled
     * @param {Boolean} toggle - the new setting of the toggle
     * @returns {undefined}
     */
    togglePromptedActionWindow(playerName, windowName, toggle) {
        var player = this.getPlayerByName(playerName);
        if(!player) {
            return;
        }

        player.promptedActionWindows[windowName] = toggle;
    }

    /*
     * This function is called by the client when a player clicks an timer setting
     * toggle in the settings menu
     * @param {String} playerName
     * @param {String} settingName - the name of the setting being toggled
     * @param {Boolean} toggle - the new setting of the toggle
     * @returns {undefined}
     */
    toggleTimerSetting(playerName, settingName, toggle) {
        var player = this.getPlayerByName(playerName);
        if(!player) {
            return;
        }

        player.timerSettings[settingName] = toggle;
    }

    /*
     * This function is called by the client when a player clicks an option setting
     * toggle in the settings menu
     * @param {String} playerName
     * @param {String} settingName - the name of the setting being toggled
     * @param {Boolean} toggle - the new setting of the toggle
     * @returns {undefined}
     */
    toggleOptionSetting(playerName, settingName, toggle) {
        var player = this.getPlayerByName(playerName);
        if(!player) {
            return;
        }

        player.optionSettings[settingName] = toggle;
    }

    toggleManualMode(playerName) {
        this.chatCommands.manual(playerName);
    }

    /*
     * Sets up Player objects, creates allCards, checks each player has a stronghold
     * and starts the game pipeline
     * @returns {undefined}
     */
    initialise() {
        var players = {};

        _.each(this.playersAndSpectators, player => {
            if(!player.left) {
                players[player.name] = player;
            }
        });

        this.playersAndSpectators = players;

        let playerWithNoStronghold = null;

        _.each(this.getPlayers(), player => {
            player.initialise();
            if(!player.stronghold) {
                playerWithNoStronghold = player;
            }
        });

        this.allCards = _(_.reduce(this.getPlayers(), (cards, player) => {
            return cards.concat(player.preparedDeck.allCards);
        }, []));
        this.provinceCards = this.allCards.filter(card => card.isProvince);

        if(playerWithNoStronghold) {
            this.addMessage('{0} does not have a stronghold in their decklist', playerWithNoStronghold);
            return;
        }

        this.pipeline.initialise([
            new SetupPhase(this),
            new SimpleStep(this, () => this.beginRound())
        ]);

        this.playStarted = true;
        this.startedAt = new Date();

        this.continue();
    }

    /*
     * Adds each of the game's main phases to the pipeline
     * @returns {undefined}
     */
    beginRound() {
        this.raiseEvent('onBeginRound');
        this.queueStep(new DynastyPhase(this));
        this.queueStep(new DrawPhase(this));
        this.queueStep(new ConflictPhase(this));
        this.queueStep(new FatePhase(this));
        this.queueStep(new RegroupPhase(this));
        this.queueStep(new SimpleStep(this, () => this.beginRound()));
    }

    /*
     * Adds a step to the pipeline queue
     * @param {BaseStep} step
     * @returns {undefined}
     */
    queueStep(step) {
        this.pipeline.queueStep(step);
    }

    /*
     * Creates a step which calls a handler function
     * @param {Function} handler - () => undefined
     * @returns {undefined}
     */
    queueSimpleStep(handler) {
        this.pipeline.queueStep(new SimpleStep(this, handler));
    }

    /*
     * Tells the current action window that the player with priority has taken
     * an action (and so priority should pass to the other player)
     * @returns {undefined}
     */
    markActionAsTaken() {
        if(this.currentActionWindow) {
            this.currentActionWindow.markActionAsTaken();
        }
    }

    /*
     * Resolves a card ability or ring effect
     * @param {AbilityContext} context - see AbilityContext.js
     * @returns {undefined}
     */
    resolveAbility(context) {
        this.queueStep(new AbilityResolver(this, context));
    }

    openSimultaneousEffectWindow(choices) {
        let window = new SimultaneousEffectWindow(this);
        _.each(choices, choice => window.addChoice(choice));
        this.queueStep(window);
    }

    getEvent(eventName, params, handler) {
        return EventBuilder.for(eventName, params, handler);
    }

    /*
     * Creates a game Event, and opens a window for it.
     * @param {String} eventName
     * @param {Object} params - parameters for this event
     * @param {Function} handler - (Event + params) => undefined
     * @returns {Event} - this allows the caller to track Event.resolved and
     * tell whether or not the handler resolved successfully
     */
    raiseEvent(eventName, params = {}, handler) {
        let event = this.getEvent(eventName, params, handler);
        this.openEventWindow([event]);
        return event;
    }

    emitEvent(eventName, params = {}) {
        let event = this.getEvent(eventName, params);
        this.emit(event.name, event);
    }

    /* Creates an EventWindow which will open windows for each kind of triggered
     * ability which can respond any passed events, and execute their handlers.
     * @param {type} events - Array of Event
     * @returns {undefined}
     */
    openEventWindow(events) {
        if(!_.isArray(events)) {
            events = [events];
        }
        this.queueStep(new EventWindow(this, events));
    }

    openThenEventWindow(events) {
        if(this.currentEventWindow) {
            this.queueStep(new ThenEventWindow(this, events));
        } else {
            this.openEventWindow(events);
        }
    }

    /**
     * Raises a custom event window for checking for any cancels to a card
     * ability
     * @param {Object} params
     * @param {Function} handler - this is an arrow function which is called if
     * nothing cancels the event
     */
    raiseInitiateAbilityEvent(params, handler) {
        this.raiseMultipleInitiateAbilityEvents([{ params: params, handler: handler}]);
    }

    /**
     * Raises a custom event window for checking for any cancels to several card
     * abilities which initiate simultaneously
     * @param {Array} eventProps
     */
    raiseMultipleInitiateAbilityEvents(eventProps) {
        let events = _.map(eventProps, event => EventBuilder.for('onCardAbilityInitiated', event.params, event.handler));
        this.queueStep(new InitiateAbilityEventWindow(this, events));
    }

    getEventsForGameAction(action, cards, context) {
        if(!context) {
            context = new AbilityContext({ game: this });
        }
        return EventBuilder.getEventsForAction(action, cards, context);
    }

    /* TODO: Add an applySingleGameAction function?
     * Checks whether a game action can be performed on a card or an array of
     * cards, and performs it on all legal targets.
     * @param {String} actionType
     * @param {Array or BaseCard} cards - Array of BaseCard
     * @param {Function} func - (Array or BaseCard) => undefined
     * @returns {undefined}
     */
    applyGameAction(context, actions) {
        if(!context) {
            context = new AbilityContext({ game: this });
        }
        let actionPairs = Object.entries(actions);
        let events = actionPairs.reduce((array, [action, cards]) => array.concat(GameActions.eventArrayTo[action](cards, context)), []);
        if(events.length > 0) {
            this.openEventWindow(events);
        }
        return events;
    }

    /*
     * Transfers honor equal to the difference in bids from the high bidder to
     * the low bidder
     * @returns {undefined}
     */
    tradeHonorAfterBid() {
        var honorDifference = 0;
        var remainingPlayers = this.getPlayersInFirstPlayerOrder();
        let currentPlayer = remainingPlayers.shift();
        if(remainingPlayers.length > 0) {

            var otherPlayer = remainingPlayers.shift();
            if(currentPlayer.honorBid > otherPlayer.honorBid) {
                honorDifference = currentPlayer.honorBid - otherPlayer.honorBid;
                this.addMessage('{0} gives {1} {2} honor', currentPlayer, otherPlayer, honorDifference);
                this.raiseEvent('onHonorTradedAfterBid', { 
                    giver: currentPlayer, 
                    receiver: otherPlayer, 
                    amount: honorDifference 
                }, () => this.transferHonor(currentPlayer, otherPlayer, honorDifference));
            } else if(otherPlayer.honorBid > currentPlayer.honorBid) {
                honorDifference = otherPlayer.honorBid - currentPlayer.honorBid;
                this.addMessage('{0} gives {1} {2} honor', otherPlayer, currentPlayer, honorDifference);
                this.raiseEvent('onHonorTradedAfterBid', { 
                    giver: otherPlayer, 
                    receiver: currentPlayer, 
                    amount: honorDifference 
                }, () => this.transferHonor(otherPlayer, currentPlayer, honorDifference));
            }
        }
    }

    /*
     * Changes the controller of a card in play to the passed player, and cleans
     * all the related stuff up (swapping sides in a conflic)
     * @param {Player} player
     * @param {DrawCard} card
     * @returns {undefined}
     */
    takeControl(player, card) {
        if(card.controller === player || !card.allowGameAction('takeControl')) {
            return;
        }
        card.controller.removeCardFromPile(card);
        player.cardsInPlay.push(card);
        card.controller = player;
        if(card.isParticipating()) {
            this.currentConflict.removeFromConflict(card);
            if(player.isAttackingPlayer()) {
                this.currentConflict.addAttacker(card);
            } else {
                this.currentConflict.addDefender(card);
            }
        }
    }

    /*
     * Starts a duel between two characters. Prompts for bids, deals with costs
     * of bids, and then resolves the outcome
     * @param {DrawCard} source - card which initiated the duel
     * @param {DrawCard} target - other card partipating in duel
     * @param {Function} getSkill = card => Int // gets the skill to add to bid
     * @param {Function} resolutionHandler - (winner, loser) => undefined //
     * function which deals with any effects due to winning/losing the duel
     * @param {Function} costHandler - () => undefined // function which resolves
     * costsas a result of bids (transfering honor is the default)
     * @returns {undefined}
     */
    initiateDuel(challenger, target, type, resolutionHandler, costHandler = () => this.tradeHonorAfterBid()) {
        if(challenger.location !== 'play area' || target.location !== 'play area') {
            this.addMessage('The duel cannot proceed as one participant is no longer in play');
            return;
        }
        this.currentDuel = new Duel(this, challenger, target, type);
        this.queueStep(new DuelFlow(this, this.currentDuel, costHandler, resolutionHandler));
    }

    watch(socketId, user) {
        if(!this.allowSpectators) {
            return false;
        }

        this.playersAndSpectators[user.username] = new Spectator(socketId, user);
        this.addMessage('{0} has joined the game as a spectator', user.username);

        return true;
    }

    join(socketId, user) {
        if(this.started || _.values(this.getPlayers()).length === 2) {
            return false;
        }

        this.playersAndSpectators[user.username] = new Player(socketId, user, this.owner === user.username, this);

        return true;
    }

    isEmpty() {
        return _.all(this.playersAndSpectators, player => player.disconnected || player.left || player.id === 'TBA');
    }

    leave(playerName) {
        var player = this.playersAndSpectators[playerName];

        if(!player) {
            return;
        }

        this.addMessage('{0} has left the game', player);

        if(this.isSpectator(player) || !this.started) {
            delete this.playersAndSpectators[playerName];
        } else {
            player.left = true;

            if(!this.finishedAt) {
                this.finishedAt = new Date();
            }
        }
    }

    disconnect(playerName) {
        var player = this.playersAndSpectators[playerName];

        if(!player) {
            return;
        }

        this.addMessage('{0} has disconnected', player);

        if(this.isSpectator(player)) {
            delete this.playersAndSpectators[playerName];
        } else {
            player.disconnected = true;
        }

        player.socket = undefined;
    }

    failedConnect(playerName) {
        var player = this.playersAndSpectators[playerName];

        if(!player) {
            return;
        }

        if(this.isSpectator(player) || !this.started) {
            delete this.playersAndSpectators[playerName];
        } else {
            this.addMessage('{0} has failed to connect to the game', player);

            player.disconnected = true;

            if(!this.finishedAt) {
                this.finishedAt = new Date();
            }
        }
    }

    reconnect(socket, playerName) {
        var player = this.getPlayerByName(playerName);
        if(!player) {
            return;
        }

        player.id = socket.id;
        player.socket = socket;
        player.disconnected = false;

        this.addMessage('{0} has reconnected', player);
    }

    checkGameState(hasChanged = false, events = []) {
        // check for a game state change (recalculating conflict skill if necessary)
        if(
            (!this.currentConflict && this.effectEngine.checkEffects(hasChanged)) ||
            (this.currentConflict && this.currentConflict.calculateSkill(hasChanged)) || hasChanged
        ) {
            // if the state has changed, check for:
            _.each(this.getPlayers(), player => player.cardsInPlay.each(card => {
                if(card.getModifiedController() !== player) {
                    // any card being controlled by the wrong player
                    this.applyGameAction(null, { takeControl: card });
                }
                // any attachments which are illegally attached
                card.checkForIllegalAttachments();
            }));
            if(this.currentConflict) {
                // conflicts with illegal participants
                this.currentConflict.checkForIllegalParticipants();
            }
            // any terminal conditions which have met their condition
            this.effectEngine.checkTerminalConditions();
        }
        if(events.length > 0) {
            // check for any delayed effects which need to fire
            this.effectEngine.checkDelayedEffects(events);
        }
    }

    continue() {
        this.pipeline.continue();
    }

    /*
     * This information is all logged when a game is won
     */
    getSaveState() {
        var players = _.map(this.getPlayers(), player => {
            return {
                name: player.name,
                faction: player.faction.name || player.faction.value,
                alliance: player.alliance ? player.alliance.name : undefined,
                honor: player.getTotalHonor()
            };
        });

        return {
            id: this.savedGameId,
            gameId: this.id,
            startedAt: this.startedAt,
            players: players,
            winner: this.winner ? this.winner.name : undefined,
            winReason: this.winReason,
            finishedAt: this.finishedAt
        };
    }

    /*
     * This information is sent to the client
     */
    getState(activePlayerName) {
        let activePlayer = this.playersAndSpectators[activePlayerName] || new AnonymousSpectator();
        let playerState = {};
        let ringState = {};

        if(this.started) {
            _.each(this.getPlayers(), player => {
                playerState[player.name] = player.getState(activePlayer);
            });

            _.each(this.rings, ring => {
                ringState[ring.element] = ring.getState(activePlayer);
            });

            return {
                id: this.id,
                manualMode: this.manualMode,
                name: this.name,
                owner: this.owner,
                players: playerState,
                rings: ringState,
                messages: this.gameChat.messages,
                spectators: _.map(this.getSpectators(), spectator => {
                    return {
                        id: spectator.id,
                        name: spectator.name
                    };
                }),
                started: this.started,
                winner: this.winner ? this.winner.name : undefined,
                cancelPromptUsed: this.cancelPromptUsed
            };
        }

        return this.getSummary(activePlayerName);
    }

    /*
     * This is used for debugging?
     */
    getSummary(activePlayerName) {
        var playerSummaries = {};
        let activePlayer = this.getPlayerByName(activePlayerName);

        _.each(this.getPlayers(), player => {
            var deck = undefined;
            if(player.left) {
                return;
            }

            if(activePlayerName === player.name && player.deck) {
                deck = { name: player.deck.name, selected: player.deck.selected };
            } else if(player.deck) {
                deck = { selected: player.deck.selected };
            } else {
                deck = {};
            }

            playerSummaries[player.name] = {
                deck: deck,
                emailHash: player.emailHash,
                faction: player.faction.value,
                id: player.id,
                lobbyId: player.lobbyId,
                left: player.left,
                name: player.name,
                owner: player.owner
            };
        });

        return {
            allowSpectators: this.allowSpectators,
            createdAt: this.createdAt,
            gameType: this.gameType,
            id: this.id,
            manualMode: this.manualMode,
            messages: this.gameChat.messages,
            name: this.name,
            owner: _.omit(this.owner, ['blocklist', 'email', 'emailHash', 'promptedActionWindows', 'settings']),
            players: playerSummaries,
            rings: {
                air: this.rings.air.getState(activePlayer),
                earth: this.rings.earth.getState(activePlayer),
                fire: this.rings.fire.getState(activePlayer),
                void: this.rings.void.getState(activePlayer),
                water: this.rings.water.getState(activePlayer)
            },
            started: this.started,
            startedAt: this.startedAt,
            spectators: _.map(this.getSpectators(), spectator => {
                return {
                    id: spectator.id,
                    lobbyId: spectator.lobbyId,
                    name: spectator.name
                };
            })
        };
    }
}

module.exports = Game;
