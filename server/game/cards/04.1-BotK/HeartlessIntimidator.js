const DrawCard = require('../../drawcard.js');

class HeartlessIntimidator extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Force opponent to discard 1 card',
            limit: ability.limit.perPhase(Infinity),
            when: {
                onModifyHonor: (event, context) => event.player === context.player.opponent && event.amount < 0
            },
            gameAction: ability.actions.discardCard(context => ({
                target: context.player.opponent.conflictDeck.first()
            }))
        });
    }
}

HeartlessIntimidator.id = 'heartless-intimidator'; // This is a guess at what the id might be - please check it!!!

module.exports = HeartlessIntimidator;
