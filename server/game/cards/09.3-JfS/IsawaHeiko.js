const DrawCard = require('../../drawcard.js');
const { CardTypes, Elements } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class IsawaHeiko extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Switch a character\'s M and P skill',
            when: {
                onCardPlayed: (event, context) => {
                    return event.card.hasTrait(Elements.Water) &&
                        context.game.isDuringConflict() &&
                        event.player === context.player;
                }
            },
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => !card.hasDash() && card.isParticipating(),
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    effect: AbilityDsl.effects.switchBaseSkills()
                })
            },
            effect: 'switch {0}\'s military and political skill'
        });
    }
}

IsawaHeiko.id = 'isawa-heiko';

module.exports = IsawaHeiko;
