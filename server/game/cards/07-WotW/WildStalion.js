const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Players, CardTypes } = require('../../Constants');

class WildStalion extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move this and another character to the conflict',
            condition: context => !context.source.isParticipating(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: (card, context) => card !== context.source && !card.isParticipating(),
                optional: true,
                gameAction: AbilityDsl.actions.moveToConflict(context => {
                    return context.target ? { target: [context.target, context.source] } : { target: context.source };
                })
            },
            effect: 'move {1}{2}{3} into the conflict',
            effectArgs: context => [context.source, context.target ? ' and ' : '', context.target ? context.target : '']
        });
    }
}

WildStalion.id = 'wild-stalion';

module.exports = WildStalion;
