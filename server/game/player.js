const _ = require('underscore');

const GameObject = require('./GameObject');
const Deck = require('./deck.js');
const AttachmentPrompt = require('./gamesteps/attachmentprompt.js');
const ClockSelector = require('./Clocks/ClockSelector');
const CostReducer = require('./costreducer.js');
const GameActions = require('./GameActions/GameActions');
const RingEffects = require('./RingEffects.js');
const PlayableLocation = require('./playablelocation.js');
const PlayerPromptState = require('./playerpromptstate.js');
const RoleCard = require('./rolecard.js');
const StrongholdCard = require('./strongholdcard.js');

const { Locations, Decks, EffectNames, CardTypes, PlayTypes, EventNames, AbilityTypes, ConflictTypes } = require('./Constants');
const provinceLocations = [Locations.StrongholdProvince, Locations.ProvinceOne, Locations.ProvinceTwo, Locations.ProvinceThree, Locations.ProvinceFour];

class Player extends GameObject {
    constructor(id, user, owner, game, clockdetails) {
        super(game, user.username);
        this.user = user;
        this.emailHash = this.user.emailHash;
        this.id = id;
        this.owner = owner;
        this.printedType = 'player';
        this.socket = null;
        this.disconnected = false;
        this.left = false;
        this.lobbyId = null;

        this.dynastyDeck = _([]);
        this.conflictDeck = _([]);
        this.provinceDeck = _([]);
        this.hand = _([]);
        this.cardsInPlay = _([]); // This stores references to all characters in play.  Holdings, provinces and attachments are not stored here.
        this.strongholdProvince = _([]);
        this.provinceOne = _([]);
        this.provinceTwo = _([]);
        this.provinceThree = _([]);
        this.provinceFour = _([]);
        this.dynastyDiscardPile = _([]);
        this.conflictDiscardPile = _([]);
        this.removedFromGame = _([]);
        this.additionalPiles = {};

        this.faction = {};
        this.stronghold = null;
        this.role = null;

        //Phase Values
        this.hideProvinceDeck = false;
        this.takenDynastyMulligan = false;
        this.takenConflictMulligan = false;
        this.passedDynasty = false;
        this.actionPhasePriority = false;
        this.honorBidModifier = 0; // most recent bid modifiers
        this.showBid = 0; // amount shown on the dial
        this.conflictOpportunities = {
            military: 1,
            political: 1,
            total: 2
        };
        this.imperialFavor = '';

        this.clock = ClockSelector.for(this, clockdetails);

        this.deck = {};
        this.costReducers = [];
        this.playableLocations = [
            new PlayableLocation(PlayTypes.PlayFromHand, this, Locations.Hand),
            new PlayableLocation(PlayTypes.PlayFromProvince, this, Locations.ProvinceOne),
            new PlayableLocation(PlayTypes.PlayFromProvince, this, Locations.ProvinceTwo),
            new PlayableLocation(PlayTypes.PlayFromProvince, this, Locations.ProvinceThree),
            new PlayableLocation(PlayTypes.PlayFromProvince, this, Locations.ProvinceFour)
        ];
        this.abilityMaxByIdentifier = {}; // This records max limits for abilities
        this.promptedActionWindows = user.promptedActionWindows || { // these flags represent phase settings
            dynasty: true,
            draw: true,
            preConflict: true,
            conflict: true,
            fate: true,
            regroup: true
        };
        this.timerSettings = user.settings.timerSettings || {};
        this.timerSettings.windowTimer = user.settings.windowTimer;
        this.optionSettings = user.settings.optionSettings;
        this.resetTimerAtEndOfRound = false;

        this.promptState = new PlayerPromptState(this);
    }

    startClock() {
        this.clock.start();
        if(this.opponent) {
            this.opponent.clock.opponentStart();
        }
    }

    stopClock() {
        this.clock.stop();
    }

    resetClock() {
        this.clock.reset();
    }

    /**
     * Checks whether a card with a uuid matching the passed card is in the passed _(Array)
     * @param list _(Array)
     * @param card BaseCard
     */
    isCardUuidInList(list, card) {
        return list.any(c => {
            return c.uuid === card.uuid;
        });
    }

    /**
     * Checks whether a card with a name matching the passed card is in the passed list
     * @param list _(Array)
     * @param card BaseCard
     */
    isCardNameInList(list, card) {
        return list.any(c => {
            return c.name === card.name;
        });
    }

    /**
     * Checks whether any cards in play are currently marked as selected
     */
    areCardsSelected() {
        return this.cardsInPlay.any(card => {
            return card.selected;
        });
    }

    /**
     * Removes a card with the passed uuid from a list. Returns an _(Array)
     * @param list _(Array)
     * @param {String} uuid
     */
    removeCardByUuid(list, uuid) {
        return _(list.reject(card => {
            return card.uuid === uuid;
        }));
    }

    /**
     * Returns a card with the passed name in the passed list
     * @param list _(Array)
     * @param {String} name
     */
    findCardByName(list, name) {
        return this.findCard(list, card => card.name === name);
    }

    /**
     * Returns a card with the passed uuid in the passed list
     * @param list _(Array)
     * @param {String} uuid
     */
    findCardByUuid(list, uuid) {
        return this.findCard(list, card => card.uuid === uuid);
    }

    /**
     * Returns a card with the passed uuid from cardsInPlay
     * @param {String} uuid
     */
    findCardInPlayByUuid(uuid) {
        return this.findCard(this.cardsInPlay, card => card.uuid === uuid);
    }

    /**
     * Returns a card which matches passed predicate in the passed list
     * @param cardList _(Array)
     * @param {Function} predicate - BaseCard => Boolean
     */
    findCard(cardList, predicate) {
        var cards = this.findCards(cardList, predicate);
        if(!cards || _.isEmpty(cards)) {
            return undefined;
        }

        return cards[0];
    }

    /**
     * Returns an Array of BaseCard which match (or whose attachments match) passed predicate in the passed list
     * @param cardList _(Array)
     * @param {Function} predicate - BaseCard => Boolean
     */
    findCards(cardList, predicate) {
        if(!cardList) {
            return;
        }

        var cardsToReturn = [];

        cardList.each(card => {
            if(predicate(card)) {
                cardsToReturn.push(card);
            }

            if(card.attachments) {
                cardsToReturn = cardsToReturn.concat(card.attachments.filter(predicate));
            }

            return cardsToReturn;
        });

        return cardsToReturn;
    }

    areLocationsAdjacent(location1, location2) {
        let index1 = provinceLocations.indexOf(location1);
        let index2 = provinceLocations.indexOf(location2);
        return index1 > -1 && index2 > -2 && Math.abs(index1 - index2) === 1;
    }

    /**
     * Returns the dynasty card from the passed province name
     * @param {String} location - one of 'province 1', 'province 2', 'province 3', 'province 4', 'stronghold province'
     */
    getDynastyCardInProvince(location) {
        let province = this.getSourceList(location);
        return province.find(card => card.isDynasty);
    }

    /**
     * Returns the dynasty card from the passed province name
     * @param {String} location - one of 'province 1', 'province 2', 'province 3', 'province 4', 'stronghold province'
     */
    getDynastyCardsInProvince(location) {
        let province = this.getSourceList(location);
        return province.filter(card => card.isDynasty);
    }

    /**
     * Returns the province card from the passed province name
     * @param {String} location - one of 'province 1', 'province 2', 'province 3', 'province 4', 'stronghold province'
     */
    getProvinceCardInProvince(location) {
        let province = this.getSourceList(location);
        return province.find(card => card.isProvince);
    }

    /**
     * Returns true if any characters or attachments controlled by this playe match the passed predicate
     * @param {Function} predicate - DrawCard => Boolean
     */
    anyCardsInPlay(predicate) {
        return this.game.allCards.any(card => card.controller === this && card.location === Locations.PlayArea && predicate(card));
    }

    /**
     * Returns an Array of all characters and attachments matching the predicate controlled by this player
     * @param {Function} predicate  - DrawCard => Boolean
     */
    filterCardsInPlay(predicate) {
        return this.game.allCards.filter(card => card.controller === this && card.location === Locations.PlayArea && predicate(card));
    }

    hasComposure() {
        return this.opponent && this.opponent.showBid > this.showBid;
    }

    getLegalConflictTypes(properties) {
        let types = properties.type || [ConflictTypes.Military, ConflictTypes.Political];
        types = Array.isArray(types) ? types : [types];
        const forcedDeclaredType = properties.forcedDeclaredType || this.game.currentConflict && this.game.currentConflict.forcedDeclaredType;
        if(forcedDeclaredType) {
            return [forcedDeclaredType].filter(type =>
                types.includes(type) &&
                this.getConflictOpportunities() > 0 &&
                !this.getEffects(EffectNames.CannotDeclareConflictsOfType).includes(type)
            );
        }
        return types.filter(type =>
            this.getConflictOpportunities(type) > 0 &&
            !this.getEffects(EffectNames.CannotDeclareConflictsOfType).includes(type)
        );
    }

    hasLegalConflictDeclaration(properties) {
        let conflictType = this.getLegalConflictTypes(properties);
        if(conflictType.length === 0) {
            return false;
        }
        let conflictRing = properties.ring || Object.values(this.game.rings);
        conflictRing = Array.isArray(conflictRing) ? conflictRing : [conflictRing];
        conflictRing = conflictRing.filter(ring => ring.canDeclare(this));
        if(conflictRing.length === 0) {
            return false;
        }
        let cards = properties.attacker ? [properties.attacker] : this.cardsInPlay.toArray();
        if(!this.opponent) {
            return conflictType.some(type => conflictRing.some(ring =>
                cards.some(card => card.canDeclareAsAttacker(type, ring))
            ));
        }
        let conflictProvince = properties.province || this.opponent && this.opponent.getProvinces();
        conflictProvince = Array.isArray(conflictProvince) ? conflictProvince : [conflictProvince];
        return conflictType.some(type => conflictRing.some(ring => conflictProvince.some(province =>
            province.canDeclare(type, ring) &&
            cards.some(card => card.canDeclareAsAttacker(type, ring, province))
        )));
    }

    /**
     * Returns the province cards (meeting an optional predicate) controlled by this player
     * @param {Function} predicate - format: (card) => return boolean, default: () => true
     * */
    getProvinces(predicate = () => true) {
        return provinceLocations.reduce((array, location) =>
            array.concat(this.getSourceList(location).filter(card => card.type === CardTypes.Province && predicate(card))), []);
    }

    /**
     * Returns the total number of faceup province cards controlled by this player
     * @param {Function} predicate - format: (card) => return boolean, default: () => true
     * */
    getNumberOfFaceupProvinces(predicate = () => true) {
        return this.getProvinces(card => !card.facedown && predicate(card)).length;
    }

    /**
     * Returns the total number of faceup province cards controlled by this player's opponent
     * @param {Function} predicate - format: (card) => return boolean, default: () => true
     * */
    getNumberOfOpponentsFaceupProvinces(predicate = () => true) {
        return this.opponent && this.opponent.getNumberOfFaceupProvinces(predicate) || 0;
    }

    /**
     * Returns the total number of characters and attachments controlled by this player which match the passed predicate
     * @param {Function} predicate - DrawCard => Int
     */
    getNumberOfCardsInPlay(predicate) {
        return this.game.allCards.reduce((num, card) => {
            if(card.controller === this && card.location === Locations.PlayArea && predicate(card)) {
                return num + 1;
            }

            return num;
        }, 0);
    }

    /**
     * Returns the total number of holdings controlled by this player
     */
    getNumberOfHoldingsInPlay() {
        return this.getHoldingsInPlay().length;
    }

    /**
     * Returns and array of holdings controlled by this player
     */
    getHoldingsInPlay() {
        return provinceLocations.reduce((array, province) =>
            array.concat(this.getSourceList(province).filter(card => card.getType() === CardTypes.Holding && !card.facedown)), []);
    }

    /**
     * Checks whether the passes card is in a legal location for the passed type of play
     * @param card BaseCard
     * @param {String} playingType
     */
    isCardInPlayableLocation(card, playingType = null) {
        return _.any(this.playableLocations, location =>
            (!playingType || location.playingType === playingType) && location.contains(card));
    }

    /**
     * Returns a character in play under this player's control which matches (for uniqueness) the passed card.
     * @param card DrawCard
     */
    getDuplicateInPlay(card) {
        if(!card.isUnique()) {
            return undefined;
        }

        return this.findCard(this.cardsInPlay, playCard => {
            return playCard !== card && (playCard.id === card.id || playCard.name === card.name);
        });
    }

    /**
     * Draws the passed number of cards from the top of the conflict deck into this players hand, shuffling and deducting honor if necessary
     * @param {number} numCards
     */
    drawCardsToHand(numCards) {
        let remainingCards = 0;

        if(numCards > this.conflictDeck.size()) {
            remainingCards = numCards - this.conflictDeck.size();
            let cards = this.conflictDeck.toArray();
            this.deckRanOutOfCards('conflict');
            this.game.queueSimpleStep(() => {
                for(let card of cards) {
                    this.moveCard(card, Locations.Hand);
                }
            });
            this.game.queueSimpleStep(() => this.drawCardsToHand(remainingCards));
        } else {
            for(let card of this.conflictDeck.toArray().slice(0, numCards)) {
                this.moveCard(card, Locations.Hand);
            }
        }
    }

    /**
     * Called when one of the players decks runs out of cards, removing 5 honor and shuffling the discard pile back into the deck
     * @param {String} deck - one of 'conflict' or 'dynasty'
     */
    deckRanOutOfCards(deck) {
        let discardPile = this.getSourceList(deck + ' discard pile');
        this.game.addMessage('{0}\'s {1} deck has run out of cards, so they lose 5 honor', this, deck);
        GameActions.loseHonor({ amount: 5 }).resolve(this, this.game.getFrameworkContext());
        this.game.queueSimpleStep(() => {
            discardPile.each(card => this.moveCard(card, deck + ' deck'));
            if(deck === 'dynasty') {
                this.shuffleDynastyDeck();
            } else {
                this.shuffleConflictDeck();
            }
        });
    }

    /**
     * Moves the top card of the dynasty deck to the passed province
     * @param {String} location - one of 'province 1', 'province 2', 'province 3', 'province 4'
     */
    replaceDynastyCard(location) {
        if(this.getSourceList(location).size() > 1) {
            return false;
        }
        if(this.dynastyDeck.size() === 0) {
            this.deckRanOutOfCards('dynasty');
            this.game.queueSimpleStep(() => this.replaceDynastyCard(location));
        } else {
            this.moveCard(this.dynastyDeck.first(), location);
        }
        return true;
    }

    /**
     * Shuffles the conflict deck, emitting an event and displaying a message in chat
     */
    shuffleConflictDeck() {
        if(this.name !== 'Dummy Player') {
            this.game.addMessage('{0} is shuffling their conflict deck', this);
        }
        this.game.emitEvent(EventNames.OnDeckShuffled, { player: this, deck: Decks.ConflictDeck });
        this.conflictDeck = _(this.conflictDeck.shuffle());
    }

    /**
     * Shuffles the dynasty deck, emitting an event and displaying a message in chat
     */
    shuffleDynastyDeck() {
        if(this.name !== 'Dummy Player') {
            this.game.addMessage('{0} is shuffling their dynasty deck', this);
        }
        this.game.emitEvent(EventNames.OnDeckShuffled, { player: this, deck: Decks.DynastyDeck });
        this.dynastyDeck = _(this.dynastyDeck.shuffle());
    }

    addConflictOpportunity(type) {
        if(type) {
            this.conflictOpportunities[type]++;
        }
        this.conflictOpportunities.total++;
    }

    /**
     * Returns the number of conflict opportunities remaining for this player
     * @param {String} type - one of 'military', 'political', ''
     * @returns {Number} opportunities remaining
     */

    getConflictOpportunities(type = 'total') {
        let setConflictDeclarationType = this.mostRecentEffect(EffectNames.SetConflictDeclarationType);
        let maxConflicts = this.mostRecentEffect(EffectNames.SetMaxConflicts);
        if(setConflictDeclarationType && type !== 'total') {
            if(type !== setConflictDeclarationType) {
                return 0;
            } else if(maxConflicts) {
                return Math.max(0, maxConflicts - this.game.getConflicts(this).length);
            }
            return this.conflictOpportunities['total'];
        }
        if(maxConflicts) {
            return Math.max(0, maxConflicts - this.game.getConflicts(this).length);
        }
        return this.conflictOpportunities[type];
    }

    /**
     * Takes a decklist passed from the lobby, creates all the cards in it, and puts references to them in the relevant lists
     */
    prepareDecks() {
        var deck = new Deck(this.deck);
        var preparedDeck = deck.prepare(this);
        this.faction = preparedDeck.faction;
        this.provinceDeck = _(preparedDeck.provinceCards);
        if(preparedDeck.stronghold instanceof StrongholdCard) {
            this.stronghold = preparedDeck.stronghold;
        }
        if(preparedDeck.role instanceof RoleCard) {
            this.role = preparedDeck.role;
        }
        this.conflictDeck = _(preparedDeck.conflictCards);
        this.dynastyDeck = _(preparedDeck.dynastyCards);
        this.preparedDeck = preparedDeck;
        this.conflictDeck.each(card => {
            // register event reactions in case event-in-deck bluff window is enabled
            if(card.type === CardTypes.Event) {
                for(let reaction of card.abilities.reactions) {
                    reaction.registerEvents();
                }
            }
        });
    }

    /**
     * Called when the Game object starts the game. Creates all cards on this players decklist, shuffles the decks and initialises player parameters for the start of the game
     */
    initialise() {
        this.opponent = this.game.getOtherPlayer(this);

        this.prepareDecks();
        this.shuffleConflictDeck();
        this.shuffleDynastyDeck();

        this.fate = 0;
        this.honor = 0;
        this.readyToStart = false;
        this.limitedPlayed = 0;
        this.maxLimited = 1;
        this.firstPlayer = false;
    }

    /**
     * Adds the passed Cost Reducer to this Player
     * @param source = EffectSource source of the reducer
     * @param {Object} properties
     * @returns {CostReducer}
     */
    addCostReducer(source, properties) {
        let reducer = new CostReducer(this.game, source, properties);
        this.costReducers.push(reducer);
        return reducer;
    }

    /**
     * Unregisters and removes the passed Cost Reducer from this Player
     * @param {CostReducer} reducer
     */
    removeCostReducer(reducer) {
        if(_.contains(this.costReducers, reducer)) {
            reducer.unregisterEvents();
            this.costReducers = _.reject(this.costReducers, r => r === reducer);
        }
    }

    addPlayableLocation(type, player, location, cards = []) {
        if(!player) {
            return;
        }
        let playableLocation = new PlayableLocation(type, player, location, cards);
        this.playableLocations.push(playableLocation);
        return playableLocation;
    }

    removePlayableLocation(location) {
        this.playableLocations = _.reject(this.playableLocations, l => l === location);
    }

    getAlternateFatePools(playingType, card) {
        let effects = this.getEffects(EffectNames.AlternateFatePool);
        let alternateFatePools = effects.filter(match => match(card) && match(card).fate > 0).map(match => match(card));
        return _.uniq(alternateFatePools);
    }

    getMinimumCost(playingType, context, target, ignoreType = false) {
        const card = context.source;
        let reducedCost = this.getReducedCost(playingType, card, target, ignoreType);
        let alternateFatePools = this.getAlternateFatePools(playingType, card);
        let alternateFate = alternateFatePools.reduce((total, pool) => total + pool.fate, 0);
        let triggeredCostReducers = 0;
        let fakeWindow = { addChoice: () => triggeredCostReducers++ };
        let fakeEvent = this.game.getEvent(EventNames.OnCardPlayed, { card: card, player: this, context: context });
        this.game.emit(EventNames.OnCardPlayed + ':' + AbilityTypes.Interrupt, fakeEvent, fakeWindow);
        return Math.max(reducedCost - triggeredCostReducers - alternateFate, 0);
    }

    /**
     * Checks if any Cost Reducers on this Player apply to the passed card/target, and returns the cost to play the cost if they are used
     * @param {String} playingType - not sure what legal values for this are
     * @param card DrawCard
     * @param target BaseCard
     */
    getReducedCost(playingType, card, target, ignoreType = false) {
        var baseCost = card.getCost();
        var matchingReducers = _.filter(this.costReducers, reducer => reducer.canReduce(playingType, card, target, ignoreType));
        var reducedCost = _.reduce(matchingReducers, (cost, reducer) => cost - reducer.getAmount(card, this), baseCost);
        return Math.max(reducedCost, 0);
    }

    /**
     * Mark all cost reducers which are valid for this card/target/playingType as used, and remove thim if they have no uses remaining
     * @param {String} playingType
     * @param card DrawCard
     * @param target BaseCard
     */
    markUsedReducers(playingType, card, target = null) {
        var matchingReducers = _.filter(this.costReducers, reducer => reducer.canReduce(playingType, card, target));
        _.each(matchingReducers, reducer => {
            reducer.markUsed();
            if(reducer.isExpired()) {
                this.removeCostReducer(reducer);
            }
        });
    }

    /**
     * Registers a card ability max limit on this Player
     * @param {String} maxIdentifier
     * @param limit FixedAbilityLimit
     */
    registerAbilityMax(maxIdentifier, limit) {
        if(this.abilityMaxByIdentifier[maxIdentifier]) {
            return;
        }

        this.abilityMaxByIdentifier[maxIdentifier] = limit;
        limit.registerEvents(this.game);
    }

    /**
     * Checks whether a max ability is at max
     * @param {String} maxIdentifier
     */
    isAbilityAtMax(maxIdentifier) {
        let limit = this.abilityMaxByIdentifier[maxIdentifier];

        if(!limit) {
            return false;
        }

        return limit.isAtMax(this);
    }

    /**
     * Marks the use of a max ability
     * @param {String} maxIdentifier
     */
    incrementAbilityMax(maxIdentifier) {
        let limit = this.abilityMaxByIdentifier[maxIdentifier];

        if(limit) {
            limit.increment(this);
        }
    }

    /**
     * Called at the start of the Dynasty Phase.  Resets a lot of the single round parameters
     */
    beginDynasty() {
        if(this.resetTimerAtEndOfRound) {
            this.noTimer = false;
        }

        this.cardsInPlay.each(card => {
            card.new = false;
        });

        this.passedDynasty = false;
        this.limitedPlayed = 0;
        this.conflictOpportunities.military = 1;
        this.conflictOpportunities.political = 1;
        this.conflictOpportunities.total = 2;
    }

    collectFate() {
        this.modifyFate(this.getTotalIncome());
        this.game.raiseEvent(EventNames.OnFateCollected, { player: this });
    }

    showConflictDeck() {
        this.showConflict = true;
    }

    showDynastyDeck() {
        this.showDynasty = true;
    }

    /**
     * Gets the appropriate list for the passed location
     * @param {String} source
     */
    getSourceList(source) {
        switch(source) {
            case Locations.Hand:
                return this.hand;
            case Locations.ConflictDeck:
                return this.conflictDeck;
            case Locations.DynastyDeck:
                return this.dynastyDeck;
            case Locations.ConflictDiscardPile:
                return this.conflictDiscardPile;
            case Locations.DynastyDiscardPile:
                return this.dynastyDiscardPile;
            case Locations.RemovedFromGame:
                return this.removedFromGame;
            case Locations.PlayArea:
                return this.cardsInPlay;
            case Locations.ProvinceOne:
                return this.provinceOne;
            case Locations.ProvinceTwo:
                return this.provinceTwo;
            case Locations.ProvinceThree:
                return this.provinceThree;
            case Locations.ProvinceFour:
                return this.provinceFour;
            case Locations.StrongholdProvince:
                return this.strongholdProvince;
            case Locations.ProvinceDeck:
                return this.provinceDeck;
            case Locations.Provinces:
                return _(this.provinceOne.value().concat(
                    this.provinceTwo.value(),
                    this.provinceThree.value(),
                    this.provinceFour.value(),
                    this.strongholdProvince.value()
                ));
            default:
                if(this.additionalPiles[source]) {
                    return this.additionalPiles[source].cards;
                }
        }
    }

    createAdditionalPile(name, properties) {
        this.additionalPiles[name] = _.extend({ cards: _([]) }, properties);
    }

    /**
     * Assigns the passed _(Array) to the parameter matching the passed location
     * @param {String} source
     * @param targetList _(Array)
     */
    updateSourceList(source, targetList) {
        switch(source) {
            case Locations.Hand:
                this.hand = targetList;
                break;
            case Locations.ConflictDeck:
                this.conflictDeck = targetList;
                break;
            case Locations.DynastyDeck:
                this.dynastyDeck = targetList;
                break;
            case Locations.ConflictDiscardPile:
                this.conflictDiscardPile = targetList;
                break;
            case Locations.DynastyDiscardPile:
                this.dynastyDiscardPile = targetList;
                break;
            case Locations.RemovedFromGame:
                this.removedFromGame = targetList;
                break;
            case Locations.PlayArea:
                this.cardsInPlay = targetList;
                break;
            case Locations.ProvinceOne:
                this.provinceOne = targetList;
                break;
            case Locations.ProvinceTwo:
                this.provinceTwo = targetList;
                break;
            case Locations.ProvinceThree:
                this.provinceThree = targetList;
                break;
            case Locations.ProvinceFour:
                this.provinceFour = targetList;
                break;
            case Locations.StrongholdProvince:
                this.strongholdProvince = targetList;
                break;
            case Locations.ProvinceDeck:
                this.provinceDeck = targetList;
                break;
            default:
                if(this.additionalPiles[source]) {
                    this.additionalPiles[source].cards = targetList;
                }
        }
    }

    /**
     * Called when a player drags and drops a card from one location on the client to another
     * @param {String} cardId - the uuid of the dropped card
     * @param source
     * @param target
     */
    drop(cardId, source, target) {
        var sourceList = this.getSourceList(source);
        var card = this.findCardByUuid(sourceList, cardId);

        // Dragging is only legal in manual mode, when the card is currently in source, when the source and target are different and when the target is a legal location
        if(!this.game.manualMode || source === target || !this.isLegalLocationForCard(card, target) || card.location !== source) {
            return;
        }

        // Don't allow two province cards in one province
        if(card.isProvince && target !== Locations.ProvinceDeck && this.getSourceList(target).any(card => card.isProvince)) {
            return;
        }

        let display = 'a card';
        if(!card.facedown && source !== Locations.Hand || [Locations.PlayArea, Locations.DynastyDiscardPile, Locations.ConflictDiscardPile, Locations.RemovedFromGame].includes(target)) {
            display = card;
        }

        this.game.addMessage('{0} manually moves {1} from their {2} to their {3}', this, display, source, target);
        this.moveCard(card, target);
        this.game.checkGameState(true);
    }

    /**
     * Checks whether card.type is consistent with location
     * @param card BaseCard
     * @param {String} location
     */
    isLegalLocationForCard(card, location) {
        if(!card) {
            return false;
        }


        const conflictCardLocations = [Locations.Hand, Locations.ConflictDeck, Locations.ConflictDiscardPile, Locations.RemovedFromGame];
        const dynastyCardLocations = [...provinceLocations, Locations.DynastyDeck, Locations.DynastyDiscardPile, Locations.RemovedFromGame];
        const legalLocations = {
            stronghold: [Locations.StrongholdProvince],
            role: [Locations.Role],
            province: [...provinceLocations, Locations.ProvinceDeck],
            holding: dynastyCardLocations,
            conflictCharacter: [...conflictCardLocations, Locations.PlayArea],
            dynastyCharacter: [...dynastyCardLocations, Locations.PlayArea],
            event: [...conflictCardLocations, Locations.BeingPlayed],
            attachment: [...conflictCardLocations, Locations.PlayArea]
        };

        let type = card.type;
        if(location === Locations.DynastyDiscardPile || location === Locations.ConflictDiscardPile) {
            type = card.printedType || card.type; //fallback to type if printedType doesn't exist (mock cards, token cards)
        }

        if(type === 'character') {
            type = card.isDynasty ? 'dynastyCharacter' : 'conflictCharacter';
        }

        return legalLocations[type] && legalLocations[type].includes(location);
    }

    /**
     * This is only used when an attachment is dragged into play.  Usually,
     * attachments are played by playCard()
     * @deprecated
     */
    promptForAttachment(card, playingType) {
        // TODO: Really want to move this out of here.
        this.game.queueStep(new AttachmentPrompt(this.game, this, card, playingType));
    }

    /**
     * Returns true if there is a conflict underway and this player is attacking
     */
    isAttackingPlayer() {
        return this.game.currentConflict && this.game.currentConflict.attackingPlayer === this;
    }

    /**
     * Returns true if there is a conflict underway and this player is defending
     */
    isDefendingPlayer() {
        return this.game.currentConflict && this.game.currentConflict.defendingPlayer === this;
    }

    /**
     * Returns true if this player is less honorable than its opponent.  Returns false if
     * the player does not have an opponent.
     */
    isLessHonorableThanOpponent() {
        return this.honor < (this.opponent ? this.opponent.honor : -1);
    }

    resetForConflict() {
        this.cardsInPlay.each(card => {
            card.resetForConflict();
        });
    }

    get honorBid() {
        return Math.max(0, this.showBid + this.honorBidModifier);
    }

    get gloryModifier() {
        return this.getEffects(EffectNames.ChangePlayerGloryModifier).reduce((total, value) => total + value, 0);
    }

    get skillModifier() {
        return this.getEffects(EffectNames.ChangePlayerSkillModifier).reduce((total, value) => total + value, 0);
    }

    modifyFate(amount) {
        this.fate = Math.max(0, this.fate + amount);
    }

    modifyHonor(amount) {
        this.honor = Math.max(0, this.honor + amount);
    }

    /**
     * Returns an Array of Rings of all rings claimed by this player
     */
    getClaimedRings() {
        return _.filter(this.game.rings, ring => ring.isConsideredClaimed(this));
    }

    getGloryCount() {
        return this.cardsInPlay.reduce((total, card) => total + card.getContributionToImperialFavor(), this.getClaimedRings().length + this.gloryModifier);
    }

    /**
     * Marks that this player controls the favor for the relevant conflict type
     */
    claimImperialFavor() {
        if(this.opponent) {
            this.opponent.loseImperialFavor();
        }
        let handlers = _.map(['military', 'political'], type => {
            return () => {
                this.imperialFavor = type;
                this.game.addMessage('{0} claims the Emperor\'s {1} favor!', this, type);
            };
        });
        this.game.promptWithHandlerMenu(this, {
            activePromptTitle: 'Which side of the Imperial Favor would you like to claim?',
            source: 'Imperial Favor',
            choices: ['Military', 'Political'],
            handlers: handlers
        });
    }

    /**
     * Marks that this player no longer controls the imperial favor
     */
    loseImperialFavor() {
        this.imperialFavor = '';
    }

    /**
     * Called by the game when the game starts, sets the players decklist
     * @param {*} deck
     */
    selectDeck(deck) {
        this.deck.selected = false;
        this.deck = deck;
        this.deck.selected = true;
        if(deck.stronghold.length > 0) {
            this.stronghold = new StrongholdCard(this, deck.stronghold[0]);
        }
        this.faction = deck.faction;
    }

    /**
     * Moves a card from one location to another. This involves removing in from the list it's currently in, calling DrawCard.move (which changes
     * its location property), and then adding it to the list it should now be in
     * @param card BaseCard
     * @param targetLocation
     * @param {Object} options
     */
    moveCard(card, targetLocation, options = {}) {
        this.removeCardFromPile(card);

        if(targetLocation.endsWith(' bottom')) {
            options.bottom = true;
            targetLocation = targetLocation.replace(' bottom', '');
        }

        var targetPile = this.getSourceList(targetLocation);

        if(!this.isLegalLocationForCard(card, targetLocation) || targetPile && targetPile.contains(card)) {
            return;
        }

        let location = card.location;

        if(location === Locations.PlayArea || (card.type === CardTypes.Holding && card.isInProvince() && !provinceLocations.includes(targetLocation))) {
            if(card.owner !== this) {
                card.owner.moveCard(card, targetLocation, options);
                return;
            }

            // In normal play, all attachments should already have been removed, but in manual play we may need to remove them.
            // This is also used by Back-Alley Hideaway when it is sacrificed. This won't trigger any leaves play effects
            card.attachments.each(attachment => {
                attachment.leavesPlay();
                attachment.owner.moveCard(attachment, attachment.isDynasty ? Locations.DynastyDiscardPile : Locations.ConflictDiscardPile);
            });

            card.leavesPlay();
            card.controller = this;
        } else if(targetLocation === Locations.PlayArea) {
            card.setDefaultController(this);
            card.controller = this;
            // This should only be called when an attachment is dragged into play
            if(card.type === CardTypes.Attachment) {
                this.promptForAttachment(card);
                return;
            }
        } else if(location === Locations.BeingPlayed && card.owner !== this) {
            card.owner.moveCard(card, targetLocation, options);
            return;
        } else if(card.type === CardTypes.Holding && provinceLocations.includes(targetLocation)) {
            card.controller = this;
        } else {
            card.controller = card.owner;
        }

        if(provinceLocations.includes(targetLocation)) {
            if([Locations.DynastyDeck].includes(location)) {
                card.facedown = true;
            }
            if(!this.takenDynastyMulligan && card.isDynasty) {
                card.facedown = false;
            }
            targetPile.push(card);
        } else if([Locations.ConflictDeck, Locations.DynastyDeck].includes(targetLocation) && !options.bottom) {
            targetPile.unshift(card);
        } else if([Locations.ConflictDiscardPile, Locations.DynastyDiscardPile, Locations.RemovedFromGame].includes(targetLocation)) {
            // new cards go on the top of the discard pile
            targetPile.unshift(card);
        } else if(targetPile) {
            targetPile.push(card);
        }

        card.moveTo(targetLocation);
    }

    /**
     * Removes a card from whichever list it's currently in
     * @param card DrawCard
     */
    removeCardFromPile(card) {
        if(card.controller !== this) {
            card.controller.removeCardFromPile(card);
            return;
        }

        var originalLocation = card.location;
        var originalPile = this.getSourceList(originalLocation);

        if(originalPile) {
            originalPile = this.removeCardByUuid(originalPile, card.uuid);
            this.updateSourceList(originalLocation, originalPile);
        }
    }

    /**
     * Returns the amount of fate this player gets from their stronghold a turn
     */
    getTotalIncome() {
        return this.stronghold.cardData.fate;
    }

    /**
     * Returns the amount of honor this player has
     */
    getTotalHonor() {
        return this.honor;
    }

    /**
     * Sets the passed cards as selected
     * @param cards BaseCard[]
     */
    setSelectedCards(cards) {
        this.promptState.setSelectedCards(cards);
    }

    clearSelectedCards() {
        this.promptState.clearSelectedCards();
    }

    setSelectableCards(cards) {
        this.promptState.setSelectableCards(cards);
    }

    clearSelectableCards() {
        this.promptState.clearSelectableCards();
    }

    setSelectableRings(rings) {
        this.promptState.setSelectableRings(rings);
    }

    clearSelectableRings() {
        this.promptState.clearSelectableRings();
    }

    getSummaryForCardList(list, activePlayer, hideWhenFaceup) {
        return list.map(card => {
            return card.getSummary(activePlayer, hideWhenFaceup);
        });
    }

    getCardSelectionState(card) {
        return this.promptState.getCardSelectionState(card);
    }

    getRingSelectionState(ring) {
        return this.promptState.getRingSelectionState(ring);
    }

    currentPrompt() {
        return this.promptState.getState();
    }

    setPrompt(prompt) {
        this.promptState.setPrompt(prompt);
    }

    cancelPrompt() {
        this.promptState.cancelPrompt();
    }

    /**
     * Sets a flag indicating that this player passed the dynasty phase, and can't act again
     */
    passDynasty() {
        this.passedDynasty = true;
    }

    /**
     * Sets te value of the dial in the UI, and sends a chat message revealing the players bid
     */
    setShowBid(bid) {
        this.showBid = bid;
        this.game.addMessage('{0} reveals a bid of {1}', this, bid);
    }

    isTopConflictCardShown() {
        return this.anyEffect(EffectNames.ShowTopConflictCard);
    }

    /**
     * Resolves any number of ring effects.  If there are more than one, then it will prompt the first player to choose what order those effects should be applied in
     * @param {Array} elements - Array of String, alternatively can be passed a String for convenience
     * @param {Boolean} optional - Indicates that the player can choose which effects to resolve.  This parameter only effects resolution of a single effect
     */
    resolveRingEffects(elements, optional = true) {
        if(!Array.isArray(elements)) {
            elements = [elements];
        }
        optional = optional && elements.length === 1;
        let effects = elements.map(element => RingEffects.contextFor(this, element, optional));
        effects = _.sortBy(effects, context => this.firstPlayer ? context.ability.defaultPriority : -context.ability.defaultPriority);
        this.game.openSimultaneousEffectWindow(effects.map(context => ({ title: context.ability.title, handler: () => this.game.resolveAbility(context) })));
    }

    getStats() {
        return {
            fate: this.fate,
            honor: this.getTotalHonor(),
            conflictsRemaining: this.getConflictOpportunities(),
            militaryRemaining: this.getConflictOpportunities('military'),
            politicalRemaining: this.getConflictOpportunities('political')
        };
    }

    /**
     * This information is passed to the UI
     * @param {Player} activePlayer
     */
    getState(activePlayer) {
        let isActivePlayer = activePlayer === this;
        let promptState = isActivePlayer ? this.promptState.getState() : {};
        let state = {
            cardPiles: {
                cardsInPlay: this.getSummaryForCardList(this.cardsInPlay, activePlayer),
                conflictDiscardPile: this.getSummaryForCardList(this.conflictDiscardPile, activePlayer),
                dynastyDiscardPile: this.getSummaryForCardList(this.dynastyDiscardPile, activePlayer),
                hand: this.getSummaryForCardList(this.hand, activePlayer, true),
                removedFromGame: this.getSummaryForCardList(this.removedFromGame, activePlayer),
                provinceDeck: this.getSummaryForCardList(this.provinceDeck, activePlayer, true)
            },
            disconnected: this.disconnected,
            faction: this.faction,
            firstPlayer: this.firstPlayer,
            hideProvinceDeck: this.hideProvinceDeck,
            id: this.id,
            imperialFavor: this.imperialFavor,
            left: this.left,
            name: this.name,
            numConflictCards: this.conflictDeck.size(),
            numDynastyCards: this.dynastyDeck.size(),
            numProvinceCards: this.provinceDeck.size(),
            optionSettings: this.optionSettings,
            phase: this.game.currentPhase,
            promptedActionWindows: this.promptedActionWindows,
            provinces: {
                one: this.getSummaryForCardList(this.provinceOne, activePlayer, !this.readyToStart),
                two: this.getSummaryForCardList(this.provinceTwo, activePlayer, !this.readyToStart),
                three: this.getSummaryForCardList(this.provinceThree, activePlayer, !this.readyToStart),
                four: this.getSummaryForCardList(this.provinceFour, activePlayer, !this.readyToStart)
            },
            showBid: this.showBid,
            stats: this.getStats(),
            timerSettings: this.timerSettings,
            strongholdProvince: this.getSummaryForCardList(this.strongholdProvince, activePlayer),
            user: _.omit(this.user, ['password', 'email'])
        };

        if(this.showConflict) {
            state.showConflictDeck = true;
            state.cardPiles.conflictDeck = this.getSummaryForCardList(this.conflictDeck, activePlayer);
        }

        if(this.showDynasty) {
            state.showDynastyDeck = true;
            state.cardPiles.dynastyDeck = this.getSummaryForCardList(this.dynastyDeck, activePlayer);
        }

        if(this.role) {
            state.role = this.role.getSummary(activePlayer);
        }

        if(this.stronghold) {
            state.stronghold = this.stronghold.getSummary(activePlayer);
        }

        if(this.isTopConflictCardShown()) {
            state.conflictDeckTopCard = this.conflictDeck.first().getSummary(activePlayer);
        }

        if(this.clock) {
            state.clock = this.clock.getState();
        }

        return _.extend(state, promptState);
    }
}

module.exports = Player;
