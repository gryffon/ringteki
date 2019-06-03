const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class AdornedBarcha extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move character into the conflict',
            condition: context => !context.source.parent.isParticipating() && this.game.isDuringConflict('military'),
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isParticipating(),
                gameAction: ability.actions.bow()
            },
            gameAction: ability.actions.moveToConflict(context => ({ target: context.source.parent }))
        });
    }

    canAttach(card, context) {
        if(card.controller !== context.player ||
            !card.isUnique()) {
            return false;
        }
        return super.canAttach(card, context);
    }
}

AdornedBarcha.id = 'adorned-barcha';

module.exports = AdornedBarcha;
