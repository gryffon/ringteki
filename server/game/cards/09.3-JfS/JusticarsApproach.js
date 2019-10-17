const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { AbilityTypes, DuelTypes } = require('../../Constants');

class JusticarsApproach extends DrawCard {
    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Action, {
                title: 'Initiate a duel to dishonor/bow/discard',
                condition: context => context.source.isParticipating(),
                printedAbility: false,
                initiateDuel: {
                    type: DuelTypes.Military,
                    gameAction: duel => AbilityDsl.actions.multiple([
                        AbilityDsl.actions.dishonor({ target: duel.loser }),
                        AbilityDsl.actions.bow({ target: duel.loser && duel.loser.isDishonored ? duel.loser : null }),
                        AbilityDsl.actions.discardFromPlay({ target: duel.loser && duel.loser.isDishonored && duel.loser.bowed ? duel.loser : null })
                    ])
                }
            })
        });
    }

    canAttach(card, context) {
        if(!card.hasTrait('courtier')) {
            return false;
        }
        return super.canAttach(card, context);
    }
}

JusticarsApproach.id = 'justicar-s-approach';

module.exports = JusticarsApproach;
