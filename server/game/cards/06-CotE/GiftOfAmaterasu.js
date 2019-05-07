const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');
const { Players, CardTypes } = require('../../Constants');

class GiftofAmaterasu extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Honor a character',
            when: {
                afterConflict: (event, context) => event.conflict.winner === context.player && event.conflict.skillDifference >= 5
            },
            cannotBeMirrored: true,
            target: {
                cardType: CardTypes.Character,
                activePromptTitle: 'Choose a character to honor',
                controller: Players.Self,
                gameAction: AbilityDsl.actions.honor()
            }
        });
    }
}

GiftofAmaterasu.id = 'gift-of-amaterasu';

module.exports = GiftofAmaterasu;
