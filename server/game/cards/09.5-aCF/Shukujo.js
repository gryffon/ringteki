const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { AbilityTypes } = require('../../Constants');

class Shukujo extends DrawCard {
    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true,
            unique: true,
            faction: 'crane'
        });

        this.grantedAbilityLimits = {};
        this.whileAttached({
            match: card => card.hasTrait('champion'),
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Action, {
                title: 'Switch the conflict type',
                condition: context => context.source.isParticipating(),
                printedAbility: false,
                effect: 'switch the conflict type',
                gameAction: AbilityDsl.actions.switchConflictType()
            })
        });
    }
}

Shukujo.id = 'shukujo';

module.exports = Shukujo;
