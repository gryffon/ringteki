const CardGameAction = require('./CardGameAction');
const { Locations } = require('../Constants');

class LookAtAction extends CardGameAction {
    setup() {
        super.setup();
        this.name = 'lookAt';
        this.effectMsg = 'look at a facedown card';
    }

    canAffect(card, context) {
        let testLocations = [Locations.ProvinceOne, Locations.ProvinceTwo, Locations.ProvinceThree, Locations.ProvinceFour, Locations.StrongholdProvince, Locations.PlayArea];
        if(!card.facedown && testLocations.includes(card.location)) {
            return false;
        }
        return super.canAffect(card, context);
    }

    checkEventCondition() {
        return true;
    }

    getEventArray(context) {
        this.target = this.target.filter(card => this.canAffect(card, context));
        if(this.target.length === 0) {
            return [];
        }
        return [this.createEvent('onLookAtCards', { cards: this.target, context: context }, event => {
            context.game.addMessage('{0} sees {1}', context.source, event.cards);
        })];
    }

    getEvent(card, context) {
        return super.createEvent('onLookAtCards', { card: card, context: context }, () => {
            context.game.addMessage('{0} sees {1}', context.source, card);
        });
    }

    fullyResolved() {
        return true;
    }
}

module.exports = LookAtAction;
