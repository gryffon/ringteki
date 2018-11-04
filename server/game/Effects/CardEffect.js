const Effect = require('./Effect.js');
const { Locations } = require('../Constants');

class CardEffect extends Effect {
    constructor(game, source, properties, effect) {
        if(!properties.match) {
            properties.match = (card, context) => card === context.source;
            if(properties.location === Locations.Any) {
                properties.targetLocation = Locations.Any;
            } else if(['province', 'stronghold', 'holding'].includes(source.type)) {
                properties.targetLocation = 'province';
            }
        }
        super(game, source, properties, effect);
        this.targetController = properties.targetController || 'current';
        this.targetLocation = properties.targetLocation || Locations.PlayArea;
    }

    isValidTarget(target) {
        if(target === this.match) {
            // This is a hack to check whether this is a lasting effect
            return true;
        }
        return (
            target.allowGameAction('applyEffect', this.context) &&
            (this.targetController !== 'current' || target.controller === this.source.controller) &&
            (this.targetController !== 'opponent' || target.controller !== this.source.controller)
        );
    }

    getTargets() {
        if(this.targetLocation === Locations.Any) {
            return this.game.allCards.filter(card => this.match(card, this.context));
        } else if(this.targetLocation === 'province') {
            let cards = this.game.allCards.filter(card =>
                ['province 1', 'province 2', 'province 3', 'province 4', 'stronghold province'].includes(card.location));
            return cards.filter(card => this.match(card, this.context));
        } else if(this.targetLocation === Locations.PlayArea) {
            return this.game.findAnyCardsInPlay(card => this.match(card, this.context));
        }
        return this.game.allCards.filter(card => this.match(card, this.context) && card.location === this.targetLocation);
    }
}

module.exports = CardEffect;
