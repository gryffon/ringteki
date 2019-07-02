const DrawCard = require('../../drawcard.js');
const { Durations, CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class CityOfLies extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Reduce cost of next event by 1',
            effect: 'reduce the cost of their next event by 1',
            gameAction: AbilityDsl.actions.playerLastingEffect({
                duration: Durations.UntilEndOfPhase,
                effect: AbilityDsl.effects.reduceNextPlayedCardCost(1, card => card.type === CardTypes.Event)
            })
        });
    }
}

CityOfLies.id = 'city-of-lies';

module.exports = CityOfLies;
