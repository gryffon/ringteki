const DrawCard = require('../../drawcard.js');

class WayOfThePhoenix extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Prevent an opponent contesting a ring',
            condition: context => context.player.opponent,
            target: {
                mode: 'ring',
                ringCondition: () => true
            },
            effect: 'prevent {1} from delcaring a conflict with {0}',
            effectArgs: context => context.player.opponent,
            handler: context => {
                for(const element of context.ring.getElements()) {
                    context.source.untilEndOfPhase(ability => ({
                        match: this.game.rings[element],
                        effect: ability.effects.cannotDeclareRing(player => player === context.player.opponent)                    
                    }));    
                }
            },
            max: ability.limit.perPhase(1)
        });
    }
}

WayOfThePhoenix.id = 'way-of-the-phoenix';

module.exports = WayOfThePhoenix;
