const _ = require('underscore');
const DrawCard = require('../../drawcard');
const AbilityDsl = require('../../abilitydsl');

class AkodoMotivator extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Opponent discards an equal number of cards at random',
            when: {
                onCardsDiscardedFromHand: (event, context) => {
                    const discardedFromOwnHand = (event.player === context.player);
                    const discardedByOpponentsEffect = (event.player.opponent === event.context.player);
                    const discardedByRingEffect = (event.context.source.type === 'ring');
                    const discardedByCardEffect = event.context.ability.isCardAbility();
                    return discardedFromOwnHand && discardedByOpponentsEffect && (discardedByRingEffect || discardedByCardEffect);
                }
            },
            gameAction: AbilityDsl.actions.discardAtRandom(context => ({
                amount: _.isArray(context.event.cards) ? context.event.cards.length : context.event.amount
            }))
        });
    }
}

AkodoMotivator.id = 'akodo-motivator';

module.exports = AkodoMotivator;
