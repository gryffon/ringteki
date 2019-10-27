const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class AdornedBarcha extends DrawCard {
    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true,
            unique: true
        });

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
}

AdornedBarcha.id = 'adorned-barcha';

module.exports = AdornedBarcha;
