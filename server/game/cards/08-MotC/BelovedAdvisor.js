const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class BelovedAdvisor extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Each player draws 1 card',
            gameAction: AbilityDsl.actions.draw(context => ({
                target: context.game.getPlayers()
            }))
        });
    }
}

BelovedAdvisor.id = 'beloved-advisor';

module.exports = BelovedAdvisor;
