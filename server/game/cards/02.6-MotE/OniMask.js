const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class OniMask extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentConditions({
            myControl: true
        });

        this.action({
            title: 'Blank participating character',
            cost: ability.costs.removeFateFromParent(),
            condition: () => this.game.isDuringConflict(),
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isParticipating(),
                gameAction: ability.actions.cardLastingEffect({ effect: ability.effects.blank() })
            },
            effect: 'blank {0} until the end of the conflict'
        });
    }
}

OniMask.id = 'oni-mask';

module.exports = OniMask;
