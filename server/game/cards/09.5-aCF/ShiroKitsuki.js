const StrongholdCard = require('../../strongholdcard.js');
const { Durations } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

const shiroKitsukiCost = function() {
    return {
        action: { name: 'shiroKitsukiCost', getCostMessage: () => ['naming {0}', []] },
        canPay: function() {
            return true;
        },
        resolve: function(context) {
            context.game.promptWithMenu(context.player, context.source, {
                context: context,
                activePrompt: {
                    menuTitle: 'Name a card',
                    controls: [
                        { type: 'card-name', command: 'menuButton', method: 'selectCardName', name: 'card-name' }
                    ]
                }
            });
        },
        pay: function() {
        }
    };

};

class ShiroKitsuki extends StrongholdCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Name a card',
            when: {
                onConflictDeclared: () => true
            },
            cost: [shiroKitsukiCost()],
            limit: AbilityDsl.limit.unlimitedPerConflict(),
            gameAction: AbilityDsl.actions.playerLastingEffect(playerLastingEffectContext => ({
                duration: Durations.UntilEndOfConflict,
                effect: AbilityDsl.effects.delayedEffect({
                    when: {
                        onCardPlayed: (event, context) => {
                            return event.player === context.player.opponent &&
                                event.card.name === playerLastingEffectContext.costs.shiroKitsukiCost;
                        }
                    },
                    multipleTrigger: true,
                    gameAction: AbilityDsl.actions.selectRing(context => ({
                        activePromptTitle: 'Choose a ring to claim',
                        ringCondition: ring => ring.isUnclaimed(),
                        message: '{0} claim {1}',
                        messageArgs: ring => [context.player, ring],
                        gameAction: AbilityDsl.actions.claimRing({ takeFate: true, type: 'political'})
                    }))
                })
            }))
        });
    }

    selectCardName(player, cardName, context) {
        context.game.addMessage('{0} names {1} - if {2} plays copies of this card {0} gets to claim a ring', player, cardName, player.opponent);
        context.costs.shiroKitsukiCost = cardName;
        return true;
    }
}

ShiroKitsuki.id = 'shiro-kitsuki';
module.exports = ShiroKitsuki;

