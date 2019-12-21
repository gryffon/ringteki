import { CardTypes, Players } from '../../Constants.js';
const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');

class IronFoundationsStance extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Lower military skill',
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
                    })
                ]
            },
            then: context => {
                if(this.game.currentConflict.getNumberOfCardsPlayed(context.player, card => card.hasTrait('kiho')) < 2) {
                    return;
                }
                return { gameAction: AbilityDsl.actions.draw() };
            },
            effect: 'prevent opponents\' actions from bowing or moving home {0}'
        });
    }
}

IronFoundationsStance.id = 'iron-foundations-stance';

module.exports = IronFoundationsStance;
