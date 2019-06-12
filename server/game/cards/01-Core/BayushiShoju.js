const DrawCard = require('../../drawcard.js');
const { Players, CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class BayushiShoju extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Give a character -0/-1',
            limit: AbilityDsl.limit.perRound(2),
            condition: context => context.source.isParticipating() && this.game.currentConflict.conflictType === 'political',
            target: {
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                cardCondition: card => card.isParticipating(),
                gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                    effect: [
                        AbilityDsl.effects.modifyPoliticalSkill(-1),
                        AbilityDsl.effects.terminalCondition({
                            context: context,
                            condition: () => context.target.getPoliticalSkill() < 1,
                            message: '{1} is discarded due to {0}\'s lasting effect',
                            gameAction: AbilityDsl.actions.discardFromPlay()
                        })
                    ]
                }))
            },
            effect: 'reduce {0}\'s political skill by 1 - they will die if they reach 0'
        });
    }
}

BayushiShoju.id = 'bayushi-shoju';

module.exports = BayushiShoju;
