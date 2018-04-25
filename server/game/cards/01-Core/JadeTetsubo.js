const DrawCard = require('../../drawcard.js');

class JadeTetsubo extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Return all fate from a character',
            cost: ability.costs.bowSelf(),
            condition: context => this.game.currentConflict && context.source.parent.isParticipating(),
            target: {
                activePromptTitle: 'Choose a character',
                cardType: 'character',
                gameAction: 'removeFate',
                cardCondition: (card, context) => (
                    card.isParticipating() &&
                    card.getMilitarySkill() < context.source.parent.getMilitarySkill()
                )
            },
            message: '{0} uses {1} to return all fate from {2}',
            handler: context => {
                let event = this.game.applyGameAction(context, { removeFate: context.target })[0];
                event.fate = context.target.getFate();
                event.recipient = context.target.controller;
            }
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
