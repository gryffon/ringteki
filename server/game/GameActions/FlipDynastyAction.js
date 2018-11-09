const CardGameAction = require('./CardGameAction');
const { Locations, CardTypes } = require('../Constants');


class FlipDynastyAction extends CardGameAction {
    setup() {
        this.name = 'reveal';
        this.targetType = [CardTypes.Character, CardTypes.Holding];
        this.effectMsg = 'reveal the facedown card in {1}';
        this.effectArgs = () => this.target[0].location;
    }

    canAffect(card, context) {
        if([Locations.ProvinceOne, Locations.ProvinceTwo, Locations.ProvinceThree, Locations.ProvinceFour].includes(card.location) && card.isDynasty && card.facedown) {
            return super.canAffect(card, context);
        }
        return false;
    }

    getEvent(card, context) {
        return super.createEvent('onDynastyCardTurnedFaceup', { card: card, context: context }, () => {
            card.facedown = false;
        });
    }
}

module.exports = FlipDynastyAction;
