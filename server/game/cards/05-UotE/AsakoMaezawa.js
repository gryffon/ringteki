const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class AsakoMaezawa extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Double a character\'s base political skill',
            condition: context => context.source.isParticipating() && context.player.opponent && (
                // My total glory
                context.player.cardsInPlay.reduce((myTotal, card) => myTotal + (card.isParticipating() && !card.bowed ? card.getGlory() : 0), 0) >
                // is greater than Opponents total glory
                context.player.opponent.cardsInPlay.reduce((oppTotal, card) => oppTotal + (card.isParticipating() && !card.bowed ? card.getGlory() : 0), 0)
            ),
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isParticipating(),
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    effect: AbilityDsl.effects.modifyBasePoliticalSkillMultiplier(2)
                })
            },
            effect: 'double {0}\'s base {1} skill',
            effectArgs: () => ['political']
        });
    }
}

AsakoMaezawa.id = 'asako-maezawa'; // This is a guess at what the id might be - please check it!!!

module.exports = AsakoMaezawa;
