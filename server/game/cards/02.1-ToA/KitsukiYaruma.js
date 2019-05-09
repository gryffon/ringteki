const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes } = require('../../Constants');

class KitsukiYaruma extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Flip province facedown',
            when: {
                onCharacterEntersPlay: (event, context) => event.card === context.source
            },
            target: {
                cardType: CardTypes.Province,
                cardCondition: card => !card.isBroken,
                gameAction: AbilityDsl.actions.turnFacedown()
            }
        });
    }
}

KitsukiYaruma.id = 'kitsuki-yaruma';

module.exports = KitsukiYaruma;
