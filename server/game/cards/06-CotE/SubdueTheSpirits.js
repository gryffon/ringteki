const DrawCard = require('../../drawcard.js');

class SubdueTheSpirits extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Add glory to both skills',
            condition: context => this.game.isDuringConflict() && context.player && context.player.opponent && context.player.opponent.honor < context.player.honor,
            gameAction: ability.actions.cardLastingEffect(context => ({
                target: context.game.currentConflict.getCharacters(context.player),
                effect: ability.effects.addGloryToBothSkills()
            })),
            effect: 'add glory to {1} and {2} skills on participating characters they control',
            effectArgs: () => ['military', 'political']
        });
    }
}

SubdueTheSpirits.id = 'subdue-the-spirits';

module.exports = SubdueTheSpirits;
