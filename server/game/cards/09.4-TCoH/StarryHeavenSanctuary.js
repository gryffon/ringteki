import { Phases } from '../../Constants.js';

const EventRegistrar = require('../../eventregistrar.js');
const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes } = require('../../Constants');

class StarryHeavenSanctuary extends DrawCard {
    onPhaseEnded(event) {
        console.log('event;phase', event.phase)
        if (event.phase === Phases.Fate)
            this.removedFate = 0;
    }

    onMoveFate(event) {
        if(event.context.game.currentPhase === Phases.Fate)
            this.removedFate++;
    }
    setupCardAbilities() {
        this.removedFate = 0;
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register(['onPhaseEnded', 'onMoveFate']);
        this.reaction({
            title: 'Gain 2 fate',
            when: {
                onMoveFate: (event, context) => {
                    return context.game.currentPhase === Phases.Fate && this.removedFate >= 4
                }
            },
            effect: 'gain 2 fate',
            gameAction: AbilityDsl.actions.gainFate({amount: 2})
        });
    }
}

StarryHeavenSanctuary.id = 'starry-heaven-sanctuary';

module.exports = StarryHeavenSanctuary;

