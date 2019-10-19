const DrawCard = require('../../drawcard.js');
const { Durations, CardTypes, PlayTypes } = require('../../Constants');

class DaimyosFavor extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentConditions({
            myControl: true
        });

        this.action({
            title: 'Bow to reduce attachment cost',
            cost: ability.costs.bowSelf(),
            effect: 'reduce the cost of the next attachment they play on {1} by 1',
            effectArgs: context => context.source.parent,
            gameAction: ability.actions.playerLastingEffect(context => ({
                duration: Durations.UntilEndOfPhase,
                effect: ability.effects.reduceCost({
                    playingTypes: PlayTypes.PlayFromHand,
                    amount: 1,
                    cardType: CardTypes.Attachment,
                    targetCondition: target => target === context.source.parent,
                    limit: ability.limit.fixed(1)
                })
            }))
        });
    }
}

DaimyosFavor.id = 'daimyo-s-favor';

module.exports = DaimyosFavor;
