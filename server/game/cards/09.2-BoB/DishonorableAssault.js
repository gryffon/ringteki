const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl');
import { CardTypes, TargetModes } from '../../Constants.js';

class DishonorableAssault extends ProvinceCard {
    setupCardAbilities() {
        this.action({
            title: 'Discard cards to dishonor attackers',
            effect: 'discard {1} and dishonor {2}',
            effectArgs: context => [context.costs.multipleCardDiscardCost.map(a => a.name).sort().join(', '), context.target],
            cost: AbilityDsl.costs.multipleCardDiscardCost(context => {
                if (context && context.target) {
                    return context.target.length;
                }
                return 1;
            }),
            target: {
                mode: TargetModes.UpToVariable,
                numCardsFunc: (context) => {
                    let hand  = 0;
                    let paid = 0;
                    if (context && context.player && context.player.hand) {
                        hand = context.player.hand.size();
                    }
                    if (context && context.costs && context.costs.multipleCardDiscardCost) {
                        paid = context.costs.multipleCardDiscardCost.length;
                    }

                    return hand + paid;
                },
                cardType: CardTypes.Character,
                cardCondition: card => card.isAttacking(),
                gameAction: AbilityDsl.actions.dishonor()
            },
            cannotTargetFirst: true
        });
    }
}

DishonorableAssault.id = 'dishonorable-assault';

module.exports = DishonorableAssault;

