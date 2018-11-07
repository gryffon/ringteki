const DrawCard = require('../../drawcard.js');
const { Players } = require('../../Constants');

class InsolentRival extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => context.player.opponent && context.player.showBid > context.player.opponent.showBid,
            effect: ability.effects.modifyBothSkills(2)
        });

        this.action({
            title: 'Challenge a participating character to a Military duel: dishonor the loser of the duel',
            condition: () => this.isParticipating(),
            target: {
                cardtype: 'character',
                controller: Players.Opponent,
                cardCondition: card => card.isParticipating(),
                gameAction: ability.actions.duel(context => ({
                    type: 'military',
                    challenger: context.source,
                    resolutionHandler: (winner, loser) => this.resolutionHandler(context, winner, loser)
                }))
            }
        });
    }
    resolutionHandler(context, winner, loser) {
        this.game.addMessage('{0} wins the duel, and dishonors {1}', winner, loser);
        this.game.applyGameAction(context, { dishonor: loser });
    }
}

InsolentRival.id = 'insolent-rival';

module.exports = InsolentRival;
