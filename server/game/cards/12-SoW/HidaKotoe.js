const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class HidaKotoe extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterConflict: (event, context) => event.conflict.winner === context.player && context.source.isDefending()
            },
            title: 'Discard an attachment',
            target: {
                cardType: CardTypes.Attachment,
                gameAction: ability.actions.discardFromPlay()
            }
        });
    }
}

HidaKotoe.id = 'hida-kotoe';

module.exports = HidaKotoe;
