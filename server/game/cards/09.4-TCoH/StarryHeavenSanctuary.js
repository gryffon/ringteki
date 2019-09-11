import { EventNames, Phases } from '../../Constants.js';

const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class StarryHeavenSanctuary extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Gain 2 fate',
            aggregateWhen: (events, context) =>
                context.game.currentPhase === Phases.Fate &&
                events.reduce((total, event) => total + (event.name === EventNames.OnMoveFate ? event.fate : 0), 0) >= 4,
            effect: 'gain 2 fate',
            gameAction: AbilityDsl.actions.gainFate({amount: 2})
        });
    }
}

StarryHeavenSanctuary.id = 'starry-heaven-sanctuary';

module.exports = StarryHeavenSanctuary;

