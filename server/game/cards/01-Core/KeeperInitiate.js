const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class KeeperInitiate extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Put this into play',
            when: {
                onClaimRing: (event, context) => (
                    event.player === context.player && !context.source.facedown && context.player.role && 
                    _.any(event.conflict.getElements(), element => context.player.role.hasTrait(element)) && 
                    context.source.location !== 'play area' && context.source.allowGameAction('putIntoPlay', context)
                )
            },
            location: ['province 1', 'province 2', 'province 3', 'province 4', 'dynasty discard pile'],
            message: '{0} puts {1} into play from their {2}',
            messageItems: context => [context.source.location === 'dynasty discard pile' ? 'discard pile' : 'province'],
            handler: context => {
                let event = this.game.applyGameAction(context, { putIntoPlay: context.source })[0];
                event.addThenGameAction(context, { placeFate: context.source });
            }
        });
    }
}

KeeperInitiate.id = 'keeper-initiate';

module.exports = KeeperInitiate;
