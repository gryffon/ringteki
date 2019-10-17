const DrawCard = require('../../drawcard.js');
const { CardTypes, Elements, Durations } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class IsawaHeiko extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Switch a character\'s base skills',
            when: {
                onCardPlayed: (event, context) => {
                    return event.card.hasTrait(Elements.Water) &&
                        event.player === context.player;
                }
            },
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => !card.hasDash(),
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    duration: Durations.UntilEndOfPhase,
                    effect: AbilityDsl.effects.switchBaseSkills()
                })
            },
            effect: 'switch {0}\'s military and political skill'
        });
    }
}

IsawaHeiko.id = 'isawa-heiko';

module.exports = IsawaHeiko;
