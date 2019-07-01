const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class AdornedBarcha extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move character into the conflict',
            condition: context => !context.source.parent.isParticipating() && this.game.isDuringConflict('military'),
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isParticipating(),
                gameAction: AbilityDsl.actions.bow()
            },
            gameAction: AbilityDsl.actions.moveToConflict(context => ({ target: context.source.parent }))
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
