import { CardTypes, TargetModes } from '../../Constants.js';

const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class UnfulfilledDuty extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Ready characters',
            target: {
                mode: TargetModes.MaxStat,
                activePromptTitle: 'Choose characters',
                cardStat: card => card.getCost(),
                maxStat: () => 6,
                numCards: 0,
                cardType: CardTypes.Character,
                cardCondition: card => card.fate === 0,
                gameAction: AbilityDsl.actions.ready()
            }
        });
    }
}

UnfulfilledDuty.id = 'unfulfilled-duty';

module.exports = UnfulfilledDuty;
