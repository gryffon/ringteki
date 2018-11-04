const DrawCard = require('../../drawcard.js');
const { Locations, Durations } = require('../../Constants');

class KaiuInventor extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Add an additional ability use to a holding',
            target: {
                cardType: 'holding',
                location: Locations.Provinces,
                controller: 'self',
                gameAction: ability.actions.cardLastingEffect({
                    duration: Durations.UntilEndOfRound,
                    targetLocation: Locations.Provinces,
                    effect: ability.effects.increaseLimitOnAbilities(1)
                })
            },
            effect: 'add an additional use to each of {0}\'s abilities'
        });
    }
}

KaiuInventor.id = 'kaiu-inventor';

module.exports = KaiuInventor;
