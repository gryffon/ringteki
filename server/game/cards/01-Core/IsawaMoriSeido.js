const StrongholdCard = require('../../strongholdcard.js');

class IsawaMoriSeido extends StrongholdCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Bow this stronghold',
            cost: ability.costs.bowSelf(),
            target: {
                cardType: 'character',
                cardCondition: card => card.location === 'play area'
            },
            effect: 'give +2 glory to {0} until the end of the phase',
            untilEndOfPhase: context => ({
                match: context.target,
                effect: ability.effects.modifyGlory(2)
            })
        });
    }
}

IsawaMoriSeido.id = 'isawa-mori-seido';

module.exports = IsawaMoriSeido;


