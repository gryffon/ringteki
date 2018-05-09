const StrongholdCard = require('../../strongholdcard.js');

class MountainsAnvilCastle extends StrongholdCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give a character with attachments bonus skill',
            cost: ability.costs.bowSelf(),
            condition: () => this.game.currentConflict,
            target: {
                cardCondition: card => card.isParticipating() && card.attachments.size() > 0
            },
            effect: 'give {0} +{1}{2}/{1}{3}',
            effectArgs: context => [Math.max(context.target.attachments.size(), 2), 'military', 'political'],
            untilEndOfConflict: context => ({
                match: context.target,
                effect: [
                    ability.effects.modifyMilitarySkill(Math.max(context.target.attachments.size(), 2)),
                    ability.effects.modifyPoliticalSkill(Math.max(context.target.attachments.size(), 2))
                ]
            })
        });
    }
}

MountainsAnvilCastle.id = 'mountain-s-anvil-castle';

module.exports = MountainsAnvilCastle;
