import { CardTypes, Players } from '../../Constants.js';

const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class EmbraceDeath extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Sacrifice a bushi, remove a fate/discard',
            when: {
                afterConflict: (event, context) =>
                    event.conflict.loser === context.player &&
                    event.conflict.defendingPlayer !== context.player &&
                    event.conflict.attackers.some(card => card.hasTrait('bushi'))
            },
            cost: AbilityDsl.costs.sacrifice({
                cardType: CardTypes.Character,
                cardCondition: (card, context) => card.hasTrait('bushi') && context.game.currentConflict.attackers.includes(card)
            }),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                cardCondition: (card, context) => (card.fate > 0 ? card.allowGameAction('removeFate', context) : card.allowGameAction('discardFromPlay', context))
            },
            handler: context => {
                if(context.target.fate === 0) {
                    AbilityDsl.actions.discardFromPlay().resolve(context.target, context);
                } else {
                    AbilityDsl.actions.removeFate().resolve(context.target, context);
                }
            },
            effect: '{1} {0}',
            effectArgs: context => context.target.fate > 0 ? 'remove 1 fate from' : 'discard',
        });
    }
}

EmbraceDeath.id = 'embrace-death';

module.exports = EmbraceDeath;
