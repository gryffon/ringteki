const DrawCard = require('../../drawcard.js');

class LionsPrideBrawler extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Bow a character',
            condition: context => this.game.currentConflict && context.source.isAttacking(),
            target: {
                cardType: 'character',
                gameAction: ability.actions.bow(),
                cardCondition: (card, context) => card.getMilitarySkill() <= context.source.getMilitarySkill()
            }
        });
    }
}

LionsPrideBrawler.id = 'lion-s-pride-brawler';

module.exports = LionsPrideBrawler;
