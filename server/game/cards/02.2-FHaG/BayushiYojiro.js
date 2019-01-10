const DrawCard = require('../../drawcard.js');
const { Players } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class BayushiYojiro extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isParticipating(),
            targetController: Players.Any,
            match: card => card.isParticipating(),
            effect: [
                AbilityDsl.effects.honorStatusDoesNotModifySkill(),
                AbilityDsl.effects.honorStatusDoesNotAffectLeavePlay()
            ]
        });
    }
}

BayushiYojiro.id = 'bayushi-yojiro';

module.exports = BayushiYojiro;
