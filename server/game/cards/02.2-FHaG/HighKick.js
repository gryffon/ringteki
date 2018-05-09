const DrawCard = require('../../drawcard.js');

class HighKick extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Bow and Disable a character',
            condition: () => this.game.isDuringConflict('military'),
            cost: ability.costs.bow(card => card.hasTrait('monk') && card.isParticipating()),
            target: {
                cardType: 'character',
                cardCondition: (card, context) => card.isParticipating() && card.controller === context.player.opponent,
                gameAction: ability.actions.bow()
            },
            untilEndOfConflict: {
                effect: ability.effects.cardCannot('triggerAbilities')
            }
        });
    }
}

HighKick.id = 'high-kick';

module.exports = HighKick;
