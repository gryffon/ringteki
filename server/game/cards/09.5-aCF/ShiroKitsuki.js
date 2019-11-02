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
            context.game.promptWithMenu(context.player, this, {
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
            title: 'Name a card that your opponent cannot play for the phase',
            when: {
                onConflictDeclared: () => true
            },
            cost: [shiroKitsukiCost()],
            limit: AbilityDsl.limit.unlimitedPerConflict(),
            gameAction: AbilityDsl.actions.playerLastingEffect(() => ({
                duration: Durations.UntilEndOfConflict,
                effect: AbilityDsl.effects.delayedEffect({
                    when: {
                        onCardPlayed: (event, context) => {
                            return event.player === context.player.opponent &&
                                event.card.name === context.cost[0];
                        }
                    },
                    gameAction: AbilityDsl.actions.selectRing(context => ({
                        activePromptTitle: 'Choose a ring to take',
                        ringCondition: ring => ring.isUnclaimed(),
                        message: '{0} takes {1}',
                        messageArgs: ring => [context.player, ring],
                        gameAction: AbilityDsl.actions.takeRing({ takeFate: true })
                    }))
                })
            }))
        });
    }

    selectCardName(player, cardName, context) {
        this.game.addMessage('{0} names {1} - if {2} plays copies of this card {0} gets to claim a ring', player, cardName, player.opponent);
        context.costs.shiroKitsukiCost = cardName;
        return true;
    }
}

ShiroKitsuki.id = 'shiro-kitsuki';
module.exports = ShiroKitsuki;

