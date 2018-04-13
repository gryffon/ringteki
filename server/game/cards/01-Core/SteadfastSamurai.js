const DrawCard = require('../../drawcard.js');

class SteadfastSamurai extends DrawCard {
    setupCardAbilities() {
        this.forcedReaction({
            title: 'Can\'t be discarded or remove fate',
            when: {
                onPhaseStarted: event => event.phase === 'fate' && this.controller.opponent && this.controller.honor > this.controller.opponent.honor + 4
            },
            handler: () => {
                this.game.addMessage('{0} uses {1}\'s ability to stop him being discarded or losing fate in this phase', this.controller, this);
                this.untilEndOfPhase(ability => ({
                    match: this,
                    effect: [
                        ability.effects.cardCannot('removeFate'),
                        ability.effects.cardCannot('discardFromPlay')
                    ]
                }));
            }
        });
    }
}

SteadfastSamurai.id = 'steadfast-samurai';

module.exports = SteadfastSamurai;

