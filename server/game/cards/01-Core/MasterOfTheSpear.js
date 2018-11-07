const DrawCard = require('../../drawcard.js');
const { Players } = require('../../Constants');

class MasterOfTheSpear extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Send home character',
            condition: () => this.isAttacking(),
            target: {
                player: Players.Opponent,
                activePromptTitle: 'Choose a character to send home',
                controller: Players.Opponent,
                gameAction: ability.actions.sendHome()
            }
        });
    }
}

MasterOfTheSpear.id = 'master-of-the-spear';

module.exports = MasterOfTheSpear;
