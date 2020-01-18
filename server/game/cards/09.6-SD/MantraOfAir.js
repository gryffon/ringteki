const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class MantraOfAir extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Honor a monk and draw a card',
            when: {
                onConflictDeclared: (event, context) => event.ring.hasElement('air') && event.conflict.attackingPlayer === context.player.opponent
            },
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.hasTrait('monk') || card.attachments.any(card => card.hasTrait('monk')),
                gameAction: AbilityDsl.actions.honor()
            },
            effect: 'honor {0} and draw a card',
            gameAction: AbilityDsl.actions.draw()
        });
    }
}

MantraOfAir.id = 'mantra-of-air';

module.exports = MantraOfAir;
