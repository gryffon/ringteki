const ProvinceCard = require('../../provincecard.js');

class MeditationsOnTheTao extends ProvinceCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Remove a fate from a character',
            condition: context => context.source.isConflictProvince(),
            target: {
                cardType: 'character', 
                gameAction: ability.actions.removeFate(),
                cardCondition: card => card.isAttacking()
            }
        });
    }
}

MeditationsOnTheTao.id = 'meditations-on-the-tao';

module.exports = MeditationsOnTheTao;
