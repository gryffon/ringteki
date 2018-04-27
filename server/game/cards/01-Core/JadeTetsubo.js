const DrawCard = require('../../drawcard.js');

class JadeTetsubo extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Return all fate from a character',
            cost: ability.costs.bowSelf(),
            condition: context => this.game.currentConflict && context.source.parent.isParticipating(),
            target: {
                cardType: 'character',
                gameAction: context => {
                    if(context.target) {
                        return ability.actions.removeFate(context.target.fate, context.target.owner);
                    }
                    return ability.actions.removeFate();
                },
                cardCondition: (card, context) => (
                    card.isParticipating() &&
                    card.getMilitarySkill() < context.source.parent.getMilitarySkill()
                )
            },
            effect: 'return all fate from {0} to {1}',
            effectItems: context => context.target.owner
        });
    }

    canAttach(card) {
        if(this.controller !== card.controller) {
            return false;
        }

        return super.canAttach(card);
    }
}

JadeTetsubo.id = 'jade-tetsubo';

module.exports = JadeTetsubo;
