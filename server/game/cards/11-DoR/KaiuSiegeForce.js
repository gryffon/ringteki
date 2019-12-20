const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Locations, CardTypes } = require('../../Constants');

class KaiuSiegeForce extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Ready this character',
            cost: AbilityDsl.costs.returnToDeck({
                location: Locations.Provinces,
                cardCondition: card => card.type === CardTypes.Holding,
                bottom: true
            }),
            gameAction: AbilityDsl.actions.ready()
        });
    }
}

KaiuSiegeForce.id = 'kaiu-siege-force';

module.exports = KaiuSiegeForce;


