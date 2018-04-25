const StrongholdCard = require('../../strongholdcard.js');

class IsawaMoriSeido extends StrongholdCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Bow this stronghold',
            cost: ability.costs.bowSelf(),
            target: {
                activePromptTitle: 'Select a character',
                cardType: 'character',
                cardCondition: card => card.location === 'play area'
            },
            message: '{0} bows {1} to give +2 glory to {2} until the end of the phase',
            untilEndOfPhase: {
                effect: ability.effects.modifyGlory(2)
            }
        });
    }
}

IsawaMoriSeido.id = 'isawa-mori-seido';

module.exports = IsawaMoriSeido;


