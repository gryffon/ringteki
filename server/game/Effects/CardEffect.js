const Effect = require('./Effect.js');
const { Locations, Players } = require('../Constants');

class CardEffect extends Effect {
    constructor(game, source, properties, effect) {
        if(!properties.match) {
            properties.match = (card, context) => card === context.source;
            if(properties.location === Locations.Any) {
                properties.targetLocation = Locations.Any;
            } else if(['province', 'stronghold', 'holding'].includes(source.type)) {
                properties.targetLocation = Locations.Provinces;
            }
        }
        super(game, source, properties, effect);
        this.targetController = properties.targetController || Players.Self;
        this.targetLocation = properties.targetLocation || Locations.PlayArea;
    }

    isValidTarget(target) {
        if(target === this.match) {
            // This is a hack to check whether this is a lasting effect
            return true;
        }
        return (
            target.allowGameAction('applyEffect', this.context) &&
            (this.targetController !== Players.Self || target.controller === this.source.controller) &&
            (this.targetController !== Players.Opponent || target.controller !== this.source.controller)
        );
    }

    getTargets() {
        if(this.targetLocation === Locations.Any) {
            return this.game.allCards.filter(card => this.match(card, this.context));
        } else if(this.targetLocation === Locations.Provinces) {
            let cards = this.game.allCards.filter(card =>
                [Locations.ProvinceOne, Locations.ProvinceTwo, Locations.ProvinceThree, Locations.ProvinceFour, Locations.StrongholdProvince].includes(card.location));
            return cards.filter(card => this.match(card, this.context));
        } else if(this.targetLocation === Locations.PlayArea) {
            return this.game.findAnyCardsInPlay(card => this.match(card, this.context));
        }
        return this.game.allCards.filter(card => this.match(card, this.context) && card.location === this.targetLocation);
    }
}

module.exports = CardEffect;
