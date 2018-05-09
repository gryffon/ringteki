const DrawCard = require('../../drawcard.js');

class WanderingRonin extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give this character +2/+2',
            condition: () => this.game.isDuringConflict(),
            cost: ability.costs.discardFateFromSelf(),
            effect: 'give himself +2{1}/+2{2}',
            effectArgs: () => ['military', 'political'],
            untilEndOfConflict: context => ({
                metch: context.source,
                effect: [
                    ability.effects.modifyMilitarySkill(2),
                    ability.effects.modifyPoliticalSkill(2)
                ]
            }),
            limit: ability.limit.perConflict(2)
        });
    }
}

WanderingRonin.id = 'wandering-ronin';

module.exports = WanderingRonin;
