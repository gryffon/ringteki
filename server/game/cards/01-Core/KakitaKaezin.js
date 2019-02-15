const DrawCard = require('../../drawcard.js');
const { Players, DuelTypes } = require('../../Constants');

class KakitaKaezin extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Duel an opposing character',
            condition: context => context.source.isParticipating(),
            target: {
                player: Players.Opponent,
                activePromptTitle: 'Choose a character to duel with Kaezin',
                controller: Players.Opponent,
                cardCondition: card => card.isParticipating(),
                gameAction: ability.actions.duel(context => ({
                    type: DuelTypes.Military,
                    challenger: context.source,
                    resolutionHandler: (winner, loser) => this.resolutionHandler(context, winner, loser)
                }))
            }
        });
    }

    resolutionHandler(context, winner, loser) {
        if(winner === context.source) {
            this.game.addMessage('{0} wins the duel, and sends all characters except {0} and {1} home', winner, loser);
            this.game.applyGameAction(context, { sendHome: this.game.currentConflict.getParticipants(card => ![winner, loser].includes(card)) });
        } else if(loser === context.source) {
            this.game.addMessage('{0} loses the duel, and is sent home', loser);
            this.game.applyGameAction(context, { sendHome: loser });
        }
    }
}

KakitaKaezin.id = 'kakita-kaezin';

module.exports = KakitaKaezin;
