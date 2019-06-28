const { Locations, Players } = require('../Constants');
const _ = require('underscore');

class BaseCardSelector {
    constructor(properties) {
        this.cardCondition = properties.cardCondition;
        this.cardType = properties.cardType;
        this.optional = properties.optional;
        this.location = this.buildLocation(properties.location);
        this.controller = properties.controller || Players.Any;
        this.checkTarget = !!properties.targets;

        if(!Array.isArray(properties.cardType)) {
            this.cardType = [properties.cardType];
        }
    }

    buildLocation(property) {
        let location = property || Locations.PlayArea;
        if(!Array.isArray(location)) {
            location = [location];
        }
        let index = location.indexOf(Locations.Provinces);
        if(index > -1) {
            location.splice(index, 1, Locations.ProvinceOne, Locations.ProvinceTwo, Locations.ProvinceThree, Locations.ProvinceFour, Locations.StrongholdProvince);
        }
        return location;
    }

    findPossibleCards(context) {
        if(this.location.includes(Locations.Any)) {
            if(this.controller === Players.Self) {
                return context.game.allCards.filter(card => card.controller === context.player);
            } else if(this.controller === Players.Opponent) {
                return context.game.allCards.filter(card => card.controller === context.player.opponent);
            }
            return context.game.allCards.toArray();
        }
        let attachments = context.player.cardsInPlay.reduce((array, card) => array.concat(card.attachments.toArray()), []);

        if(context.source.game.rings) {
            let rings = Object.values(context.source.game.rings);
            let allRingAttachments = _.flatten(rings.map(ring => ring.attachments));
            attachments = attachments.concat(allRingAttachments);
        }
        if(context.player.opponent) {
            attachments.concat(...context.player.opponent.cardsInPlay.map(card => card.attachments.toArray()));
        }
        let possibleCards = [];
        if(this.controller !== Players.Opponent) {
            possibleCards = this.location.reduce((array, location) => {
                let cards = context.player.getSourceList(location).toArray();
                if(location === Locations.PlayArea) {
                    return array.concat(cards, attachments.filter(card => card.controller === context.player));
                }
                return array.concat(cards);
            }, possibleCards);
        }
        if(this.controller !== Players.Self && context.player.opponent) {
            possibleCards = this.location.reduce((array, location) => {
                let cards = context.player.opponent.getSourceList(location).toArray();
                if(location === Locations.PlayArea) {
                    return array.concat(cards, attachments.filter(card => card.controller === context.player.opponent));
                }
                return array.concat(cards);
            }, possibleCards);
        }
        return possibleCards;
    }

    canTarget(card, context, choosingPlayer) {
        if(!card) {
            return false;
        }
        if(this.checkTarget && !card.checkRestrictions('target', context)) {
            return false;
        }
        if(this.controller === Players.Self && card.controller !== context.player) {
            return false;
        }
        if(this.controller === Players.Opponent && card.controller !== context.player.opponent) {
            return false;
        }
        if(!this.location.includes(Locations.Any) && !this.location.includes(card.location)) {
            return false;
        }
        if(card.location === Locations.Hand && card.controller !== choosingPlayer) {
            return false;
        }
        return this.cardType.includes(card.getType()) && this.cardCondition(card, context);
    }

    getAllLegalTargets(context, choosingPlayer) {
        return this.findPossibleCards(context).filter(card => this.canTarget(card, context, choosingPlayer));
    }

    hasEnoughSelected(selectedCards) {
        return this.optional || selectedCards.length > 0;
    }

    hasEnoughTargets(context, choosingPlayer) {
        return this.findPossibleCards(context).some(card => this.canTarget(card, context, choosingPlayer));
    }

    defaultActivePromptTitle() {
        return 'Choose cards';
    }

    automaticFireOnSelect() {
        return false;
    }

    wouldExceedLimit(selectedCards, card) { // eslint-disable-line no-unused-vars
        return false;
    }

    hasReachedLimit(selectedCards) { // eslint-disable-line no-unused-vars
        return false;
    }

    hasExceededLimit(selectedCards) { // eslint-disable-line no-unused-vars
        return false;
    }

    formatSelectParam(cards) {
        return cards;
    }
}

module.exports = BaseCardSelector;
