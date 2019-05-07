const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class TryAgainTomorrow extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Send a Character home',
            condition: context =>
                context.player.anyCardsInPlay(card => card.isParticipating() &&
                card.hasTrait('courtier') && card.isHonored),
            cannotBeMirrored: true,
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isAttacking(),
                gameAction: ability.actions.sendHome()
            }
        });
    }
}

TryAgainTomorrow.id = 'try-again-tomorrow';

module.exports = TryAgainTomorrow;
