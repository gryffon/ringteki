const DrawCard = require('../../drawcard.js');

class IndomitableWill extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Prevent a character from bowing at the end of the conflict',
            when: {
                afterConflict: event => (event.conflict.winner === this.controller && 
                        ((event.conflict.attackingPlayer === this.controller && event.conflict.attackers.length === 1) || 
                        (event.conflict.defendingPlayer === this.controller && event.conflict.defenders.length === 1)))
            },
            handler: context => {
                let character = context.player.cardsInPlay.find(card => card.isParticipating());
                this.game.addMessage('{0} uses {1} to prevent {2} from bowing as a result of the conflict\'s resolution', this.controller, this, character);
                this.untilEndOfConflict(ability => ({
                    match: character,
                    effect: ability.effects.doesNotBowonReturnHome()
                }));
            }
        });
    }
}

IndomitableWill.id = 'indomitable-will';

module.exports = IndomitableWill;
