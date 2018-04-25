const DrawCard = require('../../drawcard.js');

class KakitaKaezin extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Duel an opposing character',
            condition: context => context.source.isParticipating(),
            target: {
                player: 'opponent',
                cardType: 'character',
                cardCondition: (card, context) => card.controller !== context.player && card.isParticipating() && !card.hasDash('military')
            },
            message: '{0} uses {1} to challenge {2} to a duel',
            handler: context => this.game.initiateDuel(context.source, context.target, 'military', (winner, loser) => {
                if(winner === context.source) {
                    this.game.addMessage('{0} wins the duel, and sends all characters except {0} and {1} home', winner, loser);
                    this.game.applyGameAction(context, { sendHome: this.game.allCards.filter(card => card !== loser && card !== winner && card.allowGameAction('sendHome', context)) });
                } else if(loser === context.source) {
                    this.game.addMessage('{0} loses the duel, and is sent home', loser);
                    this.game.applyGameAction(context, { sendHome: loser });
                }
            })
        });
    }
}

KakitaKaezin.id = 'kakita-kaezin';

module.exports = KakitaKaezin;
