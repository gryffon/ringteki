const _ = require('underscore');
const StrongholdCard = require('../../strongholdcard.js');
const AbilityContext = require('../../AbilityContext.js');


class KyudenIsawa extends StrongholdCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Play a spell event from discard',
            cost: ability.costs.bowSelf(),
            condition: () => this.game.currentConflict,
            target: {
                activePromptTitle: 'Choose a spell event',
                cardType: 'event',
                cardCondition: (card, context) => {
                    if(card.controller !== context.player || card.location !== 'conflict discard pile' || !card.hasTrait('spell')) {
                        return false;
                    }
                    return _.any(card.abilities.actions, action => {
                        let reason = action.meetsRequirements();
                        return reason === '' || reason === 'location';
                    });
                }
            },
            handler: context => {
                this.game.addMessage('{0} bows {1} to play {2} from discard', this.controller, this, context.target);
                // TODO: make this work for events with multiple actions
                let spellContext = new AbilityContext({
                    game: context.game,
                    player: context.player,
                    source: context.target,
                    ability: context.target.abilities.actions[0]
                });
                this.game.resolveAbility(spellContext);
                this.game.queueSimpleStep(() => {
                    this.game.addMessage('{0} is removed from the game by {1}\'s ability', context.target, this);
                    this.controller.moveCard(context.target, 'removed from game');
                });
            }
        });
    }
}

KyudenIsawa.id = 'kyuden-isawa';

module.exports = KyudenIsawa;
