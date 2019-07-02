const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class AsceticVisionary extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Ready a character',
            cost: AbilityDsl.costs.payFateToRing(1),
            condition: context => context.source.isAttacking(),
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.hasTrait('monk') || card.attachments.any(card => card.hasTrait('monk')),
                gameAction: AbilityDsl.actions.ready()
            }
        });
    }
}

AsceticVisionary.id = 'ascetic-visionary';

module.exports = AsceticVisionary;
