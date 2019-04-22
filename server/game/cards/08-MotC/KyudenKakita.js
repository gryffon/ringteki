const StrongholdCard = require('../../strongholdcard.js');
const AbilityDsl = require('../../abilitydsl.js');
const { CardTypes } = require('../../Constants');

class KyudenKakita extends StrongholdCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Honor a Character',
            when: { afterDuel: () => true },
            cost: [AbilityDsl.costs.bowSelf()],
            target: {
                cardType: CardTypes.Character,
                gameAction: AbilityDsl.actions.honor()
            }
        });
    }
}

KyudenKakita.id = 'kyuden-kakita';
module.exports = KyudenKakita;

