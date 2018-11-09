const DrawCard = require('../../drawcard.js');
const { Players, CardTypes } = require('../../Constants');

class SmokeAndMirrors extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move shinobi home',
            condition: context => context.player.isAttackingPlayer(),
            target: {
                activePromptTitle: 'Choose characters',
                numCards: 0,
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: card => card.hasTrait('shinobi'),
                gameAction: ability.actions.sendHome()
            }
        });
    }
}

SmokeAndMirrors.id = 'smoke-and-mirrors';

module.exports = SmokeAndMirrors;
