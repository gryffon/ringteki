const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class KeeperInitiate extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Put this into play',
            when: {
                onClaimRing: event => (event.player === this.controller && this.controller.role && 
                        _.any(event.conflict.elements, element => this.controller.role.hasTrait(element)) && !this.facedown && 
                        this.location !== 'play area') // TODO: this needs allowGameAction when a context reference is available
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
