const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { AbilityTypes } = require('../../Constants');

class Shukujo extends DrawCard {
    setupCardAbilities() {
        this.grantedAbilityLimits = {};
        this.whileAttached({
            match: card => card.hasTrait('champion'),
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Action, {
                title: 'Switch the conflict type',
                condition: context => context.source.isParticipating(),
                printedAbility: false,
                gameAction: AbilityDsl.actions.switchConflictType()
            })
        });
    }

    canAttach(card, context) {
        if(card.controller !== context.player) {
            return false;
        }
        return card.isUnique() && card.isFaction('crane') ? super.canAttach(card, context) : false;
    }
}

Shukujo.id = 'shukujo';

module.exports = Shukujo;
