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
                cardCondition: card => card.hasTrait('bushi') && card.isAttacking()
            }),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Opponent,
            },
            gameAction: AbilityDsl.actions.conditional({
                // @ts-ignore
                condition: context => context.target.fate > 0,
                trueGameAction: AbilityDsl.actions.removeFate(context => ({
                    target: context.target
                })),
                falseGameAction: AbilityDsl.actions.discardFromPlay(context => ({
                    target: context.target
                }))
            })
        });
    }
}

EmbraceDeath.id = 'embrace-death';

module.exports = EmbraceDeath;
