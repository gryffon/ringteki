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
            handler: context => {
                let bonus = 2 * context.player.getNumberOfHoldingsInPlay();
                this.game.addMessage('{0} uses {1} to give {2} +{3}/+{3}', context.player, context.source, context.target, bonus);
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
