const DrawCard = require('../../drawcard.js');
const { Players, CardTypes, DuelTypes } = require('../../Constants');

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
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                cardCondition: card => card.isParticipating(),
                gameAction: ability.actions.duel(context => ({
                    type: DuelTypes.Military,
                    challenger: context.source,
                    gameAction: duel => ability.actions.dishonor({ target: duel.loser })
                }))
            }
        });
    }
}

InsolentRival.id = 'insolent-rival';

module.exports = InsolentRival;
