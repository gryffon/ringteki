const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Players, CardTypes } = require('../../Constants');

class WildStallion extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move this and another character to the conflict',
            condition: context => context.game.currentConflict && !context.source.isParticipating(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: (card, context) => card !== context.source,
                optional: true,
                gameAction: AbilityDsl.actions.moveToConflict()
            },
            gameAction: AbilityDsl.actions.moveToConflict(),
            effect: 'move {0}{1}{2} into the conflict',
            effectArgs: context => [!context.target || context.target.length === 0 ? '' : ' and ', context.source]
        });
    }
}

WildStallion.id = 'wild-stallion';

module.exports = WildStallion;
