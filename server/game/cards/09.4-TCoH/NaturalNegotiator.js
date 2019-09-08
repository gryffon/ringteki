import { Durations } from '../../Constants.js';
const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class NaturalNegotiator extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Switch attached characters base skills',
            effect: 'switch {1}\'s base {2} and {3} skill',
            effectArgs: context => [context.source.parent, 'military', 'political'],
            cost: AbilityDsl.costs.giveHonorToOpponent(),
            gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                duration: Durations.UntilEndOfConflict,
                target: context.source.parent,
                effect: AbilityDsl.effects.switchBaseSkills()
            }))
        });
    }

    canAttach(card, context) {
        if(card.hasTrait('courtier') && card.controller === context.player) {
            return super.canAttach(card, context);
        }

        return false;
    }
}

NaturalNegotiator.id = 'natural-negotiator';

module.exports = NaturalNegotiator;

