import { CardTypes, Players } from '../../Constants.js';
const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');

class IronFoundationsStance extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Prevent opponent\'s bow and send home effects',
            condition: () => this.game.isDuringConflict(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: card => card.isParticipating() && card.hasTrait('monk'),
                gameAction: [
                    AbilityDsl.actions.cardLastingEffect({
                        effect: AbilityDsl.effects.cardCannot({
                            cannot: 'sendHome',
                            restricts: 'opponentsCardEffects'
                        })
                    }),
                    AbilityDsl.actions.cardLastingEffect({
                        effect: AbilityDsl.effects.cardCannot({
                            cannot: 'bow',
                            restricts: 'opponentsCardEffects'
                        })
                    }),
                    AbilityDsl.actions.conditional({
                        condition: context => this.game.currentConflict.getNumberOfCardsPlayed(context.player, card => card.hasTrait('kiho')) >= 2,
                        trueGameAction: AbilityDsl.actions.draw(context => ({ target: context.player })),
                        falseGameAction: AbilityDsl.actions.draw({ amount: 0 })
                    })
                ]
            },
            effect: 'prevent opponents\' actions from bowing or moving home {0}{1}',
            effectArgs: context => this.game.currentConflict.getNumberOfCardsPlayed(context.player, card => card.hasTrait('kiho')) >= 2 ? ' and draw 1 card' : ''
        });
    }
}

IronFoundationsStance.id = 'iron-foundations-stance';

module.exports = IronFoundationsStance;
