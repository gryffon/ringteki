const StrongholdCard = require('../../strongholdcard.js');
const { Durations } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class ShiroKitsuki extends StrongholdCard {
    setupCardAbilities() {
        this.action({
            title: 'Name a card that your opponent cannot play for the phase',
            handler: context => this.game.promptWithMenu(context.player, this, {
                source: context.source,
                activePrompt: {
                    menuTitle: 'Name a card',
                    controls: [
                        { type: 'card-name', command: 'menuButton', method: 'selectCardName', name: 'card-name' }
                    ]
                }
            })
        });
    }

    selectCardName(player, cardName, source) {
        this.game.addMessage('{0} names {1} - if {2} plays copies of this card {0} gets to claim a ring', player, cardName, player.opponent);
        this.game.actions.cardLastingEffect(() => ({
            duration: Durations.UntilEndOfConflict,
            effect: AbilityDsl.effects.delayedEffect({
                when: {
                    onCardPlayed: (event, context) => {
                        return event.player === context.player.opponent &&
                            event === cardName;
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
        })).resolve(player, source);
        return true;
    }
}

ShiroKitsuki.id = 'shiro-kitsuki';
module.exports = ShiroKitsuki;

