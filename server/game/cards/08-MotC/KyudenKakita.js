const StrongholdCard = require('../../strongholdcard.js');
const AbilityDsl = require('../../abilitydsl.js');
const { CardTypes, Players } = require('../../Constants');

class KyudenKakita extends StrongholdCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Honor a Character',
            when: { onDuelFinished: () => true },
            cost: [AbilityDsl.costs.bowSelf()],
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: (card, context) => context.event.duel.isInvolved(card),
                gameAction: AbilityDsl.actions.honor()
            }
        });
    }
}

KyudenKakita.id = 'kyuden-kakita';
module.exports = KyudenKakita;

