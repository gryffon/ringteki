const ProvinceCard = require('../../provincecard.js');
const { Players } = require('../../Constants');

class MeditationsOnTheTao extends ProvinceCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Remove a fate from a character',
            condition: context => context.source.isConflictProvince(),
            target: {
                cardType: 'character',
                controller: Players.Opponent,
                cardCondition: card => card.isAttacking(),
                gameAction: ability.actions.removeFate()
            }
        });
    }
}

MeditationsOnTheTao.id = 'meditations-on-the-tao';

module.exports = MeditationsOnTheTao;
