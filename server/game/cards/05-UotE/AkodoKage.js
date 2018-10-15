const DrawCard = require('../../drawcard.js');

class AkodoKage extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Set your opponent\'s dial to equal yours',
            when: {
                onHonorDialsRevealed: (event, context) =>
                    context.player.opponent &&
                    context.player.honorBid < context.player.opponent.honorBid &&
                    context.player.honor > context.player.opponent.honor
            },
            gameAction: ability.actions.setHonorDial(context => ({ value: context.player.showBid }))
        });
    }
}

AkodoKage.id = 'akodo-kage'; // This is a guess at what the id might be - please check it!!!

module.exports = AkodoKage;
