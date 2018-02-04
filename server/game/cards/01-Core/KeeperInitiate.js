const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class KeeperInitiate extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Put this into play',
            when: {
                onClaimRing: event => (event.player === this.controller && this.controller.role && 
                        _.any(event.conflict.getElements(), element => this.controller.role.hasTrait(element)) && !this.facedown && 
                        this.location !== 'play area' && this.controller.canPutIntoPlay(this))
            },
            location: ['province 1', 'province 2', 'province 3', 'province 4', 'dynasty discard pile'],
            handler: () => {
                this.game.addMessage('{0} puts {1} into play from their {2}', this.controller, this, this.location === 'dynasty discard pile' ? 'discard pile' : 'province');
                this.controller.putIntoPlay(this);
                this.modifyFate(1);
            }
        });
    }
}

KeeperInitiate.id = 'keeper-initiate';

module.exports = KeeperInitiate;
