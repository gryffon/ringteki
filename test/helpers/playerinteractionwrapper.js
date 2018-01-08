const _ = require('underscore');

const { matchCardByNameAndPack } = require('./cardutil.js');

class PlayerInteractionWrapper {
    constructor(game, player) {
        this.game = game;
        this.player = player;

        player.noTimer = true;
        player.user = {
            settings: {}
        };
    }

    get name() {
        return this.player.name;
    }

    get fate() {
        return this.player.fate;
    }

    set fate(newFate) {
        if(newFate > 0) {
            this.player.fate = newFate;
        }
    }

    get honor() {
        return this.player.honor;
    }

    set honor(newHonor) {
        if(newHonor > 0) {
            this.player.newHonor = newHonor;
        }
    }

    get hand() {
        return this.player.hand.value();
    }

    /**
     * Sets the player's hand to contain the specified cards. Moves cards between
     * hand and conflict deck
     * @param {String|DrawCard)[]} [cards] - a list of card names, ids or objects
     */
    set hand(cards = []) {
        //Move all cards in hand to the deck
        var cardsInHand = this.hand;
        _.each(cardsInHand, card => this.moveCard(card, 'conflict deck'));
        cards = this.mixedListToCardList(cards, 'conflict deck');
        _.each(cards, card => this.moveCard(card, 'hand'));
    }

    get stronghold() {
        return this.player.strongholdProvince.value();
    }

    get provinces() {
        var provinceOne = this.player.provinceOne.value();
        var provinceTwo = this.player.provinceTwo.value();
        var provinceThree = this.player.provinceThree.value();
        var provinceFour = this.player.provinceFour.value();
        return {
            'province 1': {
                provinceCard: _.find(provinceOne, (card) => card.isProvince),
                dynastyCards: _.reject(provinceOne, (card) => card.isProvince)
            },
            'province 2': {
                provinceCard: _.find(provinceTwo, (card) => card.isProvince),
                dynastyCards: _.reject(provinceTwo, (card) => card.isProvince)
            },
            'province 3': {
                provinceCard: _.find(provinceThree, (card) => card.isProvince),
                dynastyCards: _.reject(provinceThree, (card) => card.isProvince)
            },
            'province 4': {
                provinceCard: _.find(provinceFour, (card) => card.isProvince),
                dynastyCards: _.reject(provinceFour, (card) => card.isProvince)
            }
        };
    }

    /*
        new ProvinceState
        -province 1: {
            - {String|DrawCard} provinceCard
            - {(String|DrawCard)[]} dynastyCards
        },
        -province 2,3,4 similarly

        Does not touch the stronghold. Assumed that the stronghold is set during setup.
    */
    set provinces(newProvinceState = {}) {
        //Move all cards from all provinces to decks
        var allProvinceLocations = _.keys(this.provinces);
        _.each(this.provinces, (contents) => {
            this.moveCard(contents.provinceCard, 'province deck');
            _.each(contents.dynastyCards, card => this.moveCard(card, 'dynasty deck'));
        });
        //Fill the specified provinces
        _.each(newProvinceState, (state, location) => {
            if(!_.contains(allProvinceLocations, location)) {
                throw new Error(`${location} is not a valid province`);
            }
            var provinceCard = state.provinceCard;
            var dynastyCards = state.dynastyCards;
            if(provinceCard) {
                provinceCard = this.mixedListToCardList([provinceCard], 'province deck')[0];
                this.moveCard(provinceCard, location);
            }
            if(dynastyCards) {
                dynastyCards = this.mixedListToCardList(dynastyCards, 'dynasty deck');
                _.each(dynastyCards, (card) => this.moveCard(card, location));
            }
        });
        //Assign the rest of province cards
        _.each(this.provinces, (state, location) => {
            var provinceCard = state.provinceCard;
            if(!provinceCard) {
                provinceCard = this.provinceDeck[0];
                this.moveCard(provinceCard, location);
            }
        });

    }

    /**
     * Gets all cards in play for a player
     */
    get inPlay() {
        return this.player.filterCardsInPlay(() => true);
    }
    /**
     * List of objects describing characters in play and any attachments:
     * [ {
          card: String,
          fate: Integer,
          honor: 'honored' or 'dishonored',
          bowed: Boolean
          covert: Boolean,
          attachments: String[]
        },...]
     */
    set inPlay(newState = []) {
        // First, move all cards in play back to the appropriate decks
        _.each(this.inPlay, card => {
            if(card.isDynasty) {
                this.moveCard(card, 'dynasty deck');
            }
            if(card.isConflict) {
                this.moveCard(card, 'conflict deck');
            }
        });
        // Set up each of the cards
        _.each(newState, options => {
            //TODO: Optionally, accept just a string as a parameter???
            if(_.isString(options)) {
                options = {
                    card: options
                };
            }
            if(!options.card) {
                throw new Error('You must provide a card name');
            }
            var card = this.findCardByName(options.card, ['dynasty deck', 'conflict deck', 'hand', 'provinces']);
            // Move card to play
            this.moveCard(card, 'play area');
            // Set the fate
            if(options.fate) {
                card.fate = options.fate;
            }
            // Set honored state
            if(options.honor) {
                if(options.honor === 'honored') {
                    card.honor();
                }
                if(options.honor === 'dishonored') {
                    card.dishonor();
                }
            }
            // Set bowed state
            if(options.bowed !== undefined) {
                options.bowed ? card.bow() : card.ready();
            }
            // Get the attachments
            if(options.attachments) {
                var attachments = [];
                _.each(options.attachments, card => {
                    var attachment = this.findCardByName(card, ['conflict deck', 'hand']);
                    attachments.push(attachment);
                });
                // Attach to the card
                _.each(attachments, attachment => {
                    this.player.attach(attachment, card);
                });
            }
        });
    }

    get conflictDeck() {
        return this.player.conflictDeck.value();
    }

    get conflictDiscardPile() {
        return this.player.conflictDiscardPile.value();
    }

    /**
     * Sets the contents of the conflict discard pile
     */
    set conflictDiscardPile(newContents = []) {
        //  Move cards to the deck
        _.each(this.conflictDiscardPile, card => {
            this.moveCard(card, 'conflict deck');
        });
        // Move cards to the discard
        _.each(newContents, name => {
            var card = this.findCardByName(name, 'conflict deck');
            this.moveCard(card, 'conflict discard pile');
        });
    }

    get dynastyDeck() {
        return this.player.dynastyDeck.value();
    }

    get dynastyDiscardPile() {
        return this.player.dynastyDiscardPile.value();
    }

    set dynastyDiscardPile(newContents = []) {
        // Move cards to the deck
        _.each(this.dynastyDiscardPile, card => {
            this.moveCard(card, 'dynasty deck');
        });
        // Move cards to the discard
        _.each(newContents, name => {
            var card = this.findCardByName(name, 'dynasty deck');
            this.moveCard(card, 'dynasty discard pile');
        });
    }

    get provinceDeck() {
        return this.player.provinceDeck.value();
    }

    get firstPlayer() {
        return this.player.firstPlayer;
    }

    get opponent() {
        return this.player.opponent;
    }

    currentPrompt() {
        return this.player.currentPrompt();
    }

    get currentButtons() {
        var buttons = this.currentPrompt().buttons;
        return _.map(buttons, button => button.text.toString());
    }

    get currentActionTargets() {
        return this.player.playerState.selectableCards;
    }

    get canAct() {
        return !this.hasPrompt('Waiting for opponent to take an action or pass');
    }

    formatPrompt() {
        var prompt = this.currentPrompt();

        if(!prompt) {
            return 'no prompt active';
        }

        return prompt.menuTitle + '\n' + _.map(prompt.buttons, button => '[ ' + button.text + ' ]').join('\n');
    }

    findCardByName(name, locations = 'any', side) {
        return this.filterCardsByName(name, locations, side)[0];
    }

    filterCardsByName(name, locations = 'any', side) {
        var matchFunc = matchCardByNameAndPack(name);
        // So that function can accept either lists or single locations
        if(locations !== 'any') {
            locations = [].concat(locations);
        }
        // 'provinces' = ['province 1', 'province 2', etc.]
        if(_.contains(locations, 'provinces')) {
            locations = _.reject(locations, elem => elem === 'provinces').concat('province 1', 'province 2', 'province 3', 'province 4');
        }
        try {
            var cards = this.filterCards(card => matchFunc(card.cardData) && (locations === 'any' || _.contains(locations, card.location)), side);
        } catch(e) {
            throw new Error(`Name: ${name}, Locations: ${locations}. Error thrown: ${e}`);
        }
        return cards;
    }

    findCard(condition, side) {
        return this.filterCards(condition, side)[0];
    }

    /*
        Filters cards by given condition
        - {function(card: DrawCard)} condition - card matching function
        - {String} [side] - if set to 'opponent', filters opponent's cards instead
    */
    filterCards(condition, side) {
        var player = this.player;
        if(side === 'opponent') {
            player = this.opponent;
        }
        var cards = player.preparedDeck.allCards.filter(condition);
        if(cards.length === 0) {
            throw new Error(`Could not find any matching cards for ${player.name}`);
        }

        return cards;
    }

    hasPrompt(title) {
        var currentPrompt = this.player.currentPrompt();
        return !!currentPrompt && currentPrompt.menuTitle.toLowerCase() === title.toLowerCase();
    }


    selectDeck(deck) {
        this.game.selectDeck(this.player.name, deck);
    }

    clickPrompt(text) {
        text = text.toString();
        var currentPrompt = this.player.currentPrompt();
        var promptButton = _.find(currentPrompt.buttons, button => button.text.toString().toLowerCase() === text.toLowerCase());

        if(!promptButton) {
            throw new Error(`Couldn't click on "${text}" for ${this.player.name}. Current prompt is:\n${this.formatPrompt()}`);
        }

        this.game.menuButton(this.player.name, promptButton.arg, promptButton.uuid, promptButton.method);
        this.game.continue();
    }

    clickCard(card, location = 'any', side) {
        if(_.isString(card)) {
            card = this.findCardByName(card, location, side);
        }
        this.game.cardClicked(this.player.name, card.uuid);
        this.game.continue();
    }

    clickRing(element) {
        this.game.ringClicked(this.player.name, element);
        this.game.continue();
    }

    clickMenu(card, menuText) {
        if(_.isString(card)) {
            card = this.findCardByName(card);
        }

        var items = _.filter(card.getMenu(), item => item.text === menuText);

        if(items.length === 0) {
            throw new Error(`Card ${card.name} does not have a menu item "${menuText}"`);
        }

        this.game.menuItemClick(this.player.name, card.uuid, items[0]);
        this.game.continue();
    }

    dragCard(card, targetLocation) {
        this.game.drop(this.player.name, card.uuid, card.location, targetLocation);
        this.game.continue();
    }

    moveCard(card, targetLocation) {
        this.player.moveCard(card, targetLocation);
        this.game.continue();
    }

    togglePromptedActionWindow(window, value) {
        this.player.promptedActionWindows[window] = value;
    }

    pass() {
        if(!this.canAct) {
            throw new Error(`${this.name} can't pass, because they don't have priority`);
        }
        this.clickPrompt('Pass');
    }

    selectStrongholdProvince(card) {
        if(!this.hasPrompt('Select stronghold province')) {
            throw new Error(`${this.name} is not prompted to select a province`);
        }
        card = this.findCardByName(card, 'province deck');
        this.clickCard(card);
        this.clickPrompt('Done');
    }

    bidHonor(honoramt) {
        if(!_.contains(this.currentButtons, honoramt.toString())) {
            throw new Error(`${honoramt} is not a valid selection for ${this.name}`);
        }
        if(honoramt > this.player.deck.conflictCards.length) {
            throw new Error(`${this.name} cannot bid ${honoramt}, because they don't have enough cards in the deck`);
        }
        this.clickPrompt(honoramt);
    }

    /*
        Playes a card during the dynasty phase
    */
    playFromProvinces(card, fate = 0) {
        if(!this.canAct) {
            throw new Error(`${this.name} cannot act`);
        }
        if(fate > 4) {
            throw new Error(`Can't place ${fate} tokens. Currently, up to 4 may be placed`);
        }
        if(this.player.deck.dynastyCards.length <= 0) {
            throw new Error(`${this.name} can't play cards from dynasty, because player has no cards to refill the province with`);
        }
        var candidates = this.filterCardsByName(card, 'provinces');
        //Remove any face-down cards
        candidates = _.reject(candidates, card => card.facedown);
        if(candidates.length === 0) {
            throw new Error(`${this.name} cannot play the specified card from the provinces`);
        }
        card = candidates[0];
        this.clickCard(card, 'provinces');
        if(!_.contains(this.currentButtons, fate.toString())) {
            this.clickPrompt('Cancel');
            throw new Error(`Player ${this.name} does not have enough fate to place ${fate} tokens.`);
        }
        this.clickPrompt(fate);
    }
    /**
      Initiates a conflict for the player
      @param {String} [ring] - element of the ring to initiate on, void by default
      @param {number} [province] - id of the province location, 1 by default
      @param {String} conflictType - type of conflict ('military' or 'political')
      @param {(String|DrawCard)[]} attackers - list of attackers. can be either names,
        ids, or card objects
     */
    initiateConflict(conflictType, attackers, province = 1, ring = 'void') {
        if(!ring || !_.contains(['void','fire','water','air','earth'], ring)) {
            throw new Error(`${ring} is not a valid ring selection`);
        }
        if(!province || province < 0 || province > 4) {
            throw new Error(`province ${province} is not a valid selection`);
        }
        if(!conflictType || !_.contains(['military', 'political'], conflictType)) {
            throw new Error(`${conflictType} is not a valid conflict type`);
        }
        if(!attackers || attackers.length === 0) {
            throw new Error(`Player ${this.name} must declare at least one attacker`);
        }
        province = 'province ' + province;
        var provinceCard = this.filterCards(card => card.isProvince && card.location === province, 'opponent')[0];
        if(provinceCard.isBroken) {
            throw new Error(`Cannot initiate conflict on ${province} because it is broken`);
        }
        //Turn to list of card objects
        attackers = this.mixedListToCardList(attackers, 'play area');
        //Filter out those that are unable to participate
        attackers = this.filterUnableToParticipate(attackers, conflictType);

        if(attackers.length === 0) {
            throw new Error(`None of the specified attackers can participate in ${conflictType} conflicts`);
        }
        this.clickRing(ring);
        if(this.game.currentConflict !== conflictType) {
            this.clickRing(ring);
        }
        this.clickCard(provinceCard);
        _.each(attackers, card => this.clickCard(card));
        this.clickPrompt('Initiate Conflict');
    }

    /**
        Assigns defenders for the player
        @param {(String|DrawCard)[]} defenders - a list of defender names, ids or
        card objects
     */
    assignDefenders(defenders = []) {
        if(!defenders) {
            return;
        }
        //Some defenders assigned
        if(defenders.length !== 0) {
            var conflictType = this.game.currentConflict.conflictType;
            // Turn to list of card objects
            defenders = this.mixedListToCardList(defenders, 'play area');
            // Filter out those that can't participate
            defenders = this.filterUnableToParticipate(defenders, conflictType);
            if(defenders.length === 0) {
                throw new Error(`None of the specified attackers can participate in ${conflictType} conflicts`);
            }

            _.each(defenders, card => {
                this.clickCard(card);
            });
        }
        this.clickPrompt('Done');
    }

    mixedListToCardList(mixed, locations = 'any') {
        // Yank all the non-string cards
        var cardList = _.reject(mixed, card => _.isString(card));
        mixed = _.filter(mixed, card => _.isString(card));
        // Find cards objects for the rest
        _.each(mixed, (card) => {
            //Find only those cards that aren't already in the list
            var cardObject = this.filterCardsByName(card, locations).find(card => !_.contains(cardList, card));
            if(!cardObject) {
                throw new Error (`Could not find card named ${card}`);
            }
            cardList.push(cardObject);
        });

        return cardList;
    }

    filterUnableToParticipate(cardList, type) {
        return _.filter(cardList, card => {
            if(!card) {
                return false;
            }
            return !card.conflictOptions.cannotParticipateIn[type];
        });
    }
}

module.exports = PlayerInteractionWrapper;
