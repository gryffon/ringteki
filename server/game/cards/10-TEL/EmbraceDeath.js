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
                    context.player.isAttackingPlayer() &&
                    event.conflict.attackers.some(card => card.hasTrait('bushi'))
            },
            cost: AbilityDsl.costs.sacrifice({
                cardType: CardTypes.Character,
                cardCondition: (card, context) => card.hasTrait('bushi') && card.isAttacking()
            }),
            gameAction: AbilityDsl.actions.selectCard({
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                gameAction: AbilityDsl.actions.conditional({
                    // @ts-ignore
                    condition: (context, properties) => properties.target.fate > 0,
                    trueGameAction: AbilityDsl.actions.removeFate(),
                    falseGameAction: AbilityDsl.actions.discardFromPlay()
                })
            }),
            effect: '{1} {0}',
            effectArgs: context => context.target.fate > 0 ? 'remove 1 fate from' : 'discard'
        });
    }
}

EmbraceDeath.id = 'embrace-death';

module.exports = EmbraceDeath;
