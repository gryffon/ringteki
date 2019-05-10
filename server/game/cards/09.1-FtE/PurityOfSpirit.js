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
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.honor(),
                    AbilityDsl.actions.delayedEffect({
                        when : {
                            onConflictFinished: () => true
                        },
                        gameAction: AbilityDsl.actions.discardStatusToken(context => context.target.personalHonor),
                        message: 'remove the status token from {0}'
                    })])
            }
        });
    }
}

PurityOfSpirit.id = 'purity-of-spirit';

module.exports = PurityOfSpirit;
