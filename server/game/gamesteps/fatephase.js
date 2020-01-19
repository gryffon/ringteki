const _ = require('underscore');
const Phase = require('./phase.js');
const ActionWindow = require('./actionwindow.js');
const SimpleStep = require('./simplestep.js');
const { Players, Phases, CardTypes, EventNames, Locations } = require('../Constants');

/*
IV. Fate Phase
4.1 Fate phase begins.
4.2 Discard characters with no fate.
4.3 Remove fate from characters.
4.4 Place fate on unclaimed rings.
◊ ACTION WINDOW
Proceed to Dynasty Phase.
4.6 Discard from provinces.
4.5 Ready cards.
4.7 Return rings.
4.8 Pass first player token.
4.9 Fate phase ends
 */

class FatePhase extends Phase {
    constructor(game) {
        super(game, Phases.Fate);
        this.initialise([
            new SimpleStep(game, () => this.discardCharactersWithNoFate()),
            new SimpleStep(game, () => this.removeFateFromCharacters()),
            new SimpleStep(game, () => this.placeFateOnUnclaimedRings()),
            new ActionWindow(this.game, 'Action Window', 'fate'),
            new SimpleStep(game, () => this.readyCards()),
            new SimpleStep(game, () => this.discardFromProvinces()),
            new SimpleStep(game, () => this.returnRings()),
            new SimpleStep(game, () => this.passFirstPlayer())]);
    }

    discardCharactersWithNoFate() {
        for(let player of this.game.getPlayersInFirstPlayerOrder()) {
            this.game.queueSimpleStep(() => this.promptPlayerToDiscard(player, player.cardsInPlay.filter(card => (
                card.fate === 0 && card.allowGameAction('discardFromPlay')
            ))));
        }
    }

    promptPlayerToDiscard(player, cardsToDiscard) {
        if(cardsToDiscard.length === 0) {
            return;
        }
        this.game.promptForSelect(player, {
            source: 'Fate Phase',
            activePromptTitle: 'Choose character to discard\n(or click Done to discard all characters with no fate)',
            waitingPromptTitle: 'Waiting for opponent to discard characters with no fate',
            cardCondition: card => cardsToDiscard.includes(card),
            cardType: CardTypes.Character,
            controller: Players.Self,
            buttons: [{ text: 'Done', arg: 'cancel' }],
            onSelect: (player, card) => {
                this.game.applyGameAction(null, { discardFromPlay: card });
                this.promptPlayerToDiscard(player, cardsToDiscard.filter(c => c !== card));
                return true;
            },
            onCancel: () => {
                for(let character of cardsToDiscard) {
                    this.game.applyGameAction(null, { discardFromPlay: character });
                }
            }
        });
    }

    removeFateFromCharacters() {
        this.game.applyGameAction(null, { removeFate: this.game.findAnyCardsInPlay(card => card.allowGameAction('removeFate')) });
    }

    placeFateOnUnclaimedRings() {
        this.game.raiseEvent(EventNames.OnPlaceFateOnUnclaimedRings, {}, () => {
            _.each(this.game.rings, ring => {
                if(!ring.claimed) {
                    ring.modifyFate(1);
                }
            });
        });
    }

    discardFromProvinces() {
        _.each(this.game.getPlayersInFirstPlayerOrder(), player => {
            this.game.queueSimpleStep(() => this.discardFromProvincesForPlayer(player));
        });
    }

    discardFromProvincesForPlayer(player) {
        let cardsToDiscard = [];
        let cardsOnUnbrokenProvinces = [];
        _.each([Locations.ProvinceOne, Locations.ProvinceTwo, Locations.ProvinceThree, Locations.ProvinceFour, Locations.StrongholdProvince], location => {
            let provinceCard = player.getProvinceCardInProvince(location);
            let province = player.getSourceList(location);
            let dynastyCards = province.filter(card => card.isDynasty && !card.facedown);
            if(dynastyCards.length > 0 && provinceCard) {
                if(provinceCard.isBroken) {
                    cardsToDiscard = cardsToDiscard.concat(dynastyCards);
                } else {
                    cardsOnUnbrokenProvinces = cardsOnUnbrokenProvinces.concat(dynastyCards);
                }
            }
        });

        if(cardsOnUnbrokenProvinces.length > 0) {
            this.game.promptForSelect(player, {
                source: 'Discard Dynasty Cards',
                numCards: 0,
                multiSelect: true,
                optional: true,
                activePromptTitle: 'Select dynasty cards to discard',
                waitingPromptTitle: 'Waiting for opponent to discard dynasty cards',
                location: Locations.Provinces,
                controller: Players.Self,
                cardCondition: card => cardsOnUnbrokenProvinces.includes(card),
                onSelect: (player, cards) => {
                    cardsToDiscard = cardsToDiscard.concat(cards);
                    if(cardsToDiscard.length > 0) {
                        this.game.addMessage('{0} discards {1} from their provinces', player, cardsToDiscard);
                        this.game.applyGameAction(this.game.getFrameworkContext(), { discardCard: cardsToDiscard });
                    }
                    return true;
                },
                onCancel: () => {
                    if(cardsToDiscard.length > 0) {
                        this.game.addMessage('{0} discards {1} from their provinces', player, cardsToDiscard);
                        this.game.applyGameAction(this.game.getFrameworkContext(), { discardCard: cardsToDiscard });
                    }
                    return true;
                }
            });
        } else if(cardsToDiscard.length > 0) {
            this.game.addMessage('{0} discards {1} from their provinces', player, cardsToDiscard);
            this.game.applyGameAction(this.game.getFrameworkContext(), { discardCard: cardsToDiscard });
        }

        this.game.queueSimpleStep(() => {
            for(let location of [Locations.ProvinceOne, Locations.ProvinceTwo, Locations.ProvinceThree, Locations.ProvinceFour]) {
                this.game.queueSimpleStep(() => {
                    player.replaceDynastyCard(location);
                    return true;
                });
            }
        });
    }

    readyCards() {
        let cardsToReady = this.game.allCards.filter(card => card.bowed && card.readiesDuringReadyPhase());
        this.game.actions.ready().resolve(cardsToReady, this.game.getFrameworkContext());
    }

    returnRings() {
        this.game.actions.returnRing().resolve(_.filter(this.game.rings, ring => ring.claimed), this.game.getFrameworkContext());
    }

    passFirstPlayer() {
        let firstPlayer = this.game.getFirstPlayer();
        let otherPlayer = this.game.getOtherPlayer(firstPlayer);
        if(otherPlayer) {
            this.game.raiseEvent(EventNames.OnPassFirstPlayer, { player: otherPlayer }, () => this.game.setFirstPlayer(otherPlayer));
        }
    }
}

module.exports = FatePhase;
