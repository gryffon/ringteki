import { CardTypes, Players } from '../../Constants.js';
const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class YogoAsami extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            match:  card => card.name === 'Bayushi Kachiko',
            targetController: Players.Any,
            effect: AbilityDsl.effects.cardCannot({
                cannot: 'target',
                restricts: 'abilitiesTriggeredByOpponents'
            })
        });
        this.action({
            title: 'Give a character -2/-0',
            cost: AbilityDsl.costs.bowSelf(),
            condition: context => context.source.isParticipating(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Any,
                cardCondition: card => card.isParticipating(),
                gameAction: AbilityDsl.actions.cardLastingEffect({ effect: AbilityDsl.effects.modifyMilitarySkill(-2) })
            },
            effect: 'reduce {0}\'s military skill by 2'
        });
    }
}

YogoAsami.id = 'yogo-asami';

module.exports = YogoAsami;
