const DrawCard = require('../../drawcard.js');
const { Players } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class RighteousMagistrate extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isDefending(),
            targetController: Players.Any,
            effect: [
                AbilityDsl.effects.playerCannot({
                    cannot: 'loseHonor'
                }),
                AbilityDsl.effects.playerCannot({
                    cannot: 'gainHonor'
                }),
                AbilityDsl.effects.playerCannot({
                    cannot: 'takeHonor'
                })
            ]
        });
    }
}

RighteousMagistrate.id = 'righteous-magistrate';

module.exports = RighteousMagistrate;
