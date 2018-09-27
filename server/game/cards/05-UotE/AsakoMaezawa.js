const DrawCard = require('../../drawcard.js');

class AsakoMaezawa extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Double a character\'s base political skill',
            condition: context => context.source.isParticipating() && context.player.opponent && (
                // My total glory
                context.player.cardsInPlay.reduce((myTotal, card) => myTotal + (card.isParticipating() && !card.bowed ? card.getGlory() : 0), 0) >
                // is greater than Opponents total glory
                context.player.opponent.cardsInPlay.reduce((oppTotal, card) => oppTotal + (card.isParticipating() && !card.bowed ? card.getGlory() : 0), 0)
            ),
            target: {
                cardType: 'character',
                cardCondition: card => card.isParticipating(),
                gameAction: ability.actions.cardLastingEffect(context => ({
                    effect: ability.effects.modifyBasePoliticalSkill(context.target.getBasePoliticalSkill())
                }))
            },
            effect: 'double {0}\'s base {1} skill',
            effectArgs: () => ['political']
        });
    }
}

AsakoMaezawa.id = 'asako-maezawa'; // This is a guess at what the id might be - please check it!!!

module.exports = AsakoMaezawa;
