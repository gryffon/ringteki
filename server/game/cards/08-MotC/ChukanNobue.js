const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');

class ChukanNobue extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.cardCannot({
                cannot: 'discard',
                restricts: 'opponentsTriggeredAbilities'
            })
        });
    }
}

ChukanNobue.id = 'chukan-nobue';
module.exports = ChukanNobue;
