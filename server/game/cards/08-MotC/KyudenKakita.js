const StrongholdCard = require('../../strongholdcard.js');
const AbilityDsl = require('../../abilitydsl.js');
const { CardTypes, Players } = require('../../Constants');

class KyudenKakita extends StrongholdCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Honor a Character',
            when: { afterDuel: () => true },
            cost: [AbilityDsl.costs.bowSelf()],
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                gameAction: AbilityDsl.actions.honor()
            }
        });
    }
}

KyudenKakita.id = 'kyuden-kakita';
module.exports = KyudenKakita;

