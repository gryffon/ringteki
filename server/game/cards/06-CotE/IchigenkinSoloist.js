const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class IchigenkinSoloist extends DrawCard {
    setupCardAbilities() {
        this.composure({
            effect: AbilityDsl.effects.cardCannot({
                cannot: 'target',
                restricts: 'opponentsTriggeredAbilities'
            })
        });
    }
}

IchigenkinSoloist.id = 'ichigenkin-soloist';

module.exports = IchigenkinSoloist;
