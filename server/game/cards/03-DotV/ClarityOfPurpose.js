const DrawCard = require('../../drawcard.js');

class ClarityOfPurpose extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Character cannot be bowed and doesn\'t bow during political conflicts',
            condition: () => this.game.isDuringConflict(),
            target: {
                cardType: 'character',
                cardCondition: (card, context) => card.controller === context.player && card.location === 'play area'
            },
            effect: 'prevent opponents\' actions from bowing {0} and stop it bowing at the end of a political conflict',
            handler: context => {
                let opponent = context.player.opponent;
                context.source.untilEndOfConflict(ability => ({
                    match: context.target,
                    effect: ability.effects.cardCannot('bow', context => (
                        context.source.type !== 'ring' && opponent && context.source.controller === opponent
                    ))
                }));
                context.source.untilEndOfConflict(ability => ({
                    match: context.target,
                    condition: () => this.game.isDuringConflict('political'),
                    effect: ability.effects.doesNotBow
                }));
            }
        });
    }
}

ClarityOfPurpose.id = 'clarity-of-purpose';

module.exports = ClarityOfPurpose;
