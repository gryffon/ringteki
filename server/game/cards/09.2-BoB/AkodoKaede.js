const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes } = require('../../Constants');

class AkodoKaede extends DrawCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Prevent a character from leaving play',
            when: {
                onCardLeavesPlay: (event, context) => event.card.type === CardTypes.Character && event.card !== context.source
            },
            effect: 'prevent {1} from leaving play',
            effectArgs: context => context.event.card,
            gameAction: AbilityDsl.actions.cancel(context => ({
                target: context.source,
                replacementGameAction: AbilityDsl.actions.removeFate()
            }))
        });
    }
}

AkodoKaede.id = 'akodo-kaede';

module.exports = AkodoKaede;

