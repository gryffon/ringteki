const DrawCard = require('../../drawcard.js');

class HidaGuardian extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Give a character a bonus for each holding',
            condition: context => context.source.isParticipating(),
            target: {
                cardType: 'character',
                cardCondition: (card, context) => card.isParticipating() && card !== context.source
            },
            effect: 'give {0} +{1}{2}/+{1}{3}',
            effectArgs: context => [2 * context.player.getNumberOfHoldingsInPlay(), 'military', 'political'],
            handler: context => {
                let bonus = 2 * context.player.getNumberOfHoldingsInPlay();
                context.source.untilEndOfConflict(ability => ({
                    match: context.target,
                    effect: [
                        ability.effects.modifyMilitarySkill(bonus),
                        ability.effects.modifyPoliticalSkill(bonus)
                    ]
                }));
            }
        });
    }
}

HidaGuardian.id = 'hida-guardian';

module.exports = HidaGuardian;
