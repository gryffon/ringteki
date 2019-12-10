const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl');
import { CardTypes, TargetModes } from '../../Constants.js';

class DishonorableAssault extends ProvinceCard {
    setupCardAbilities() {
        this.action({
            title: 'Discard cards to dishonor attackers',
            effect: 'discards cards to dishonor attacking characters',
            cost: AbilityDsl.costs.variableCardDiscardCost(context => this.getNumberOfLegalTargets(context)),
            handler: context => {
                this.game.promptForSelect(context.player, {
                    activePromptTitle: 'Choose characters to dishonor',
                    mode: TargetModes.Exactly,
                    numCards: context.costs.variableCardDiscardCost.length,
                    context: context,
                    cardCondition: card => card.isAttacking(),
                    onSelect: (player, cards) => {
                        this.game.addMessage('{0} dishonors {1}', player, cards);
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

