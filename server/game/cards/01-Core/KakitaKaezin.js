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
                    gameAction: duel => ability.actions.sendHome({
                        target: duel.winner === context.source ? context.game.currentConflict.getParticipants(card => card !== duel.winner && card !== duel.loser) : duel.loser
                    })
                }))
            }
        });
    }
}

KakitaKaezin.id = 'kakita-kaezin';

module.exports = KakitaKaezin;
