const DrawCard = require('../../drawcard.js');

class WayOfTheLion extends DrawCard {
    setupCardAbilities() {
        this.action({
            clickToActivate: true,
            target: {
                activePromptTitle: 'Choose a character',
                cardType: 'character',
                cardCondition: card => this.game.currentConflict && card.location === 'play area' && card.isFaction('lion')
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to double the military skill of {2}', this.controller, this, context.target);
                this.untilEndOfConflict(ability => ({
                    match: context.target,
                    effect: ability.effects.modifyMilitarySkill(context.target.getMilitarySkill(true))
                }));
            }
        });
    }
}

WayOfTheLion.id = 'way-of-the-lion';

module.exports = WayOfTheLion;
