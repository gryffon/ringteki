const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl');
import { CardTypes, TargetModes } from '../../Constants.js';

class DishonorableAssault extends ProvinceCard {
    setupCardAbilities() {
        this.action({
            title: 'Discard cards to dishonor attackers',
            effect: 'discard {1}',
            effectArgs: context => context.costs.variableCardDiscardCost.map(a => a.name).join(', '),
            cost: AbilityDsl.costs.variableCardDiscardCost(context => this.getNumberOfLegalTargets(context)),
            handler: context => {
                this.game.promptForSelect(context.player, {
                    activePromptTitle: 'Choose characters to dishonor',
                    mode: TargetModes.Exactly,
                    numCards: context.costs.variableCardDiscardCost.length,
                    context: context,
                    cardCondition: card => card.type === CardTypes.Character && card.isAttacking(),
                    onSelect: (player, cards) => {
                        this.game.addMessage('{0} uses {1} to dishonor {2}', player, context.source, cards);
                        this.game.applyGameAction(context, { dishonor: cards });
                        return true;
                    }
                });
            }
        });
    }

    getNumberOfLegalTargets(context) {
        if (this.game.isDuringConflict()) {
            let cards = context.game.currentConflict.getParticipants(card => card.isAttacking());
            let count = 0;
            cards.forEach(card => {
                if (card.allowGameAction('dishonor', context)) {
                    count++;
                }
            });

            return count;
        }
        return 0;
    }
}

DishonorableAssault.id = 'dishonorable-assault';

module.exports = DishonorableAssault;

