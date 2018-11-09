const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class StrengthInNumbers extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Send home defending character',
            condition: context => context.player.isAttackingPlayer(),
            target: {
                cardType: CardTypes.Character,
                cardCondition: card =>
                    card.isDefending() &&
                    card.getGlory() <= this.game.currentConflict.getNumberOfParticipantsFor('attacker'),
                gameAction: ability.actions.sendHome()
            },
            cannotBeMirrored: true
        });
    }
}

StrengthInNumbers.id = 'strength-in-numbers';

module.exports = StrengthInNumbers;
