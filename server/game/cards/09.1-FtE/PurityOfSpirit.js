const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes } = require('../../Constants');

class PurityOfSpirit extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Choose a bushi character to honor',
            condition: () => this.game.isDuringConflict(),
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.hasTrait('bushi') && card.isParticipating(),
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.honor(),
                    AbilityDsl.actions.delayedEffect({
                        when : {
                            onConflictFinished: () => true
                        },
                        gameAction: AbilityDsl.actions.discardStatusToken(context => ({ target: context.target.personalHonor })),
                        message: '{2} removes the {3} from {1} due to the delayed effect of {0}',
                        messageArgs: context => [context.player, context.target.personalHonor]
                    })])
            }
        });
    }
}

PurityOfSpirit.id = 'purity-of-spirit';

module.exports = PurityOfSpirit;
