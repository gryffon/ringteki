import { CardTypes, AbilityTypes } from '../../Constants.js';

const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class TacticalIngenuity extends DrawCard {
    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Action, {
                title: "Reveal and draw an event",
                condition: context => context.source.isParticipating(),
                effect: 'look at the top four cards of their deck',
                gameAction: AbilityDsl.actions.deckSearch({
                    amount: 4,
                    cardCondition: card => card.type === CardTypes.Event,
                    reveal: true
                })
            })
        });
    }
}

TacticalIngenuity.id = 'tactical-ingenuity';

module.exports = TacticalIngenuity;
