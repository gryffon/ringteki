const DrawCard = require('../../drawcard.js');
const { Players, CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class CallingInFavors extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Take control of an attachment',
            cost: AbilityDsl.costs.dishonor(),
            target: {
                cardType: CardTypes.Attachment,
                controller: Players.Opponent
            },
            gameAction: AbilityDsl.actions.ifAble(context => ({
                ifAbleAction: AbilityDsl.actions.attach({
                    target: context.costs.dishonor,
                    attachment: context.target,
                    takeControl: true
                }),
                otherwiseAction: AbilityDsl.actions.discardFromPlay({ target: context.target })
            }))
        });
    }
}

CallingInFavors.id = 'calling-in-favors';

module.exports = CallingInFavors;
