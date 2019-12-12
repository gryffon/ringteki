const ProvinceCard = require('../../provincecard.js');
import { CardTypes, TargetModes } from '../../Constants.js';
const AbilityDsl = require('../../abilitydsl');

class DishonorableAssault extends ProvinceCard {
    setupCardAbilities() {
        this.action({
            title: 'Discard cards to dishonor attackers',
            effect: 'discard {1} and dishonor {2}',
            effectArgs: context => [context.costs.discardCardsUpToVariableX.map(a => a.name).sort().join(', '), context.target],
            cost: AbilityDsl.costs.discardCardsUpToVariableX(context => this.getNumberOfLegalTargets(context)),
            target: {
                mode: TargetModes.ExactlyVariable,
                numCardsFunc: (context) => {
                    if(context && context.costs && context.costs.discardCardsUpToVariableX) {
                        return context.costs.discardCardsUpToVariableX.length;
                    }

                    return this.getNumberOfLegalTargets(context);
                },
                cardType: CardTypes.Character,
                cardCondition: card => card.isAttacking(),
                gameAction: AbilityDsl.actions.dishonor()
            },
            cannotTargetFirst: true
        });
    }

    getNumberOfLegalTargets(context) {
        if(this.game.isDuringConflict()) {
            let cards = this.game.currentConflict.getParticipants(card => card.isAttacking());
            let count = 0;
            cards.forEach(card => {
                if(card.allowGameAction('dishonor', context)) {
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

