const DrawCard = require('../../drawcard.js');
const { CardTypes, Durations, Locations } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class AgashaTaiko extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Choose a province',
            when: {
                onCardPlayed: (event, context) => event.card === context.source
            },
            target: {
                cardType: CardTypes.Province,
                location: Locations.Provinces,
                cardCondition: card => card.location !== 'stronghold province',
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    targetLocation: Locations.Provinces,
                    duration: Durations.UntilEndOfRound,
                    effect: AbilityDsl.effects.cannotBeAttacked()
                })
            },
            effect: 'prevent {1}\'s {2} in {3} from being attacked this round',
            effectArgs: context => [
                context.target.controller,
                context.target.facedown ? 'hidden province' : context.target,
                context.target.location
            ]
        });
    }
}

AgashaTaiko.id = 'agasha-taiko';

module.exports = AgashaTaiko;
