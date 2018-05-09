const DrawCard = require('../../drawcard.js');

class SmokeAndMirrors extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move shinobi home',
            condition: context => context.player.isAttackingPlayer(),
            target: {
                activePromptTitle: 'Choose characters',
                numCards: 0,
                cardType: 'character',
                cardCondition: (card, context) => card.controller === context.player && card.hasTrait('shinobi'),
                gameAction: ability.actions.sendHome()
            }
        });
    }
}

SmokeAndMirrors.id = 'smoke-and-mirrors';

module.exports = SmokeAndMirrors;
