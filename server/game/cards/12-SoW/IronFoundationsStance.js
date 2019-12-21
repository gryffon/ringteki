import { Durations, CardTypes, Players } from '../../Constants.js';
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
                        }),
                    }),
                    AbilityDsl.actions.cardLastingEffect({
                        effect: AbilityDsl.effects.cardCannot({
                            cannot: 'bow',
                            restricts: 'opponentsCardEffects'
                        })
                    }),
                ]
            },
            then: context => ({
                condition: () => {
                    console.log('Stance # of cards: ' + this.game.currentConflict.getNumberOfCardsPlayed(context.player));
                    return this.game.currentConflict.getNumberOfCardsPlayed(context.player) >= 5 },
                gameAction: AbilityDsl.actions.draw()
            }),
            effect: 'prevent opponents\' actions from bowing or moving home {0}'
        });
    }
}

IronFoundationsStance.id = 'iron-foundations-stance';

module.exports = IronFoundationsStance;
