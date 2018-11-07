const DrawCard = require('../../drawcard.js');
const { Durations, CardTypes } = require('../../Constants');

class CityOfLies extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Reduce cost of next event by 1',
            effect: 'reduce the cost of their next event by 1',
            gameAction: ability.actions.playerLastingEffect({
                duration: Durations.UntilEndOfPhase,
                effect: ability.effects.reduceNextPlayedCardCost(1, card => card.type === CardTypes.Event)
            })
        });
    }
}

CityOfLies.id = 'city-of-lies';

module.exports = CityOfLies;
