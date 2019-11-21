const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Locations } = require('../../Constants');

class SharpenTheMind extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Give +3/+3 to attached character',
            cost: AbilityDsl.costs.discardCard({ location: Locations.Hand }),
            condition: context => context.game.isDuringConflict(),
            gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                target: context.source.parent,
                effect: AbilityDsl.effects.modifyBothSkills(3)
            })),
            effect: 'give +3{1}/+3{2} to {3}',
            effectArgs: context => ['military', 'political', context.source.parent]
        });
    }
}

SharpenTheMind.id = 'sharpen-the-mind';

module.exports = SharpenTheMind;
