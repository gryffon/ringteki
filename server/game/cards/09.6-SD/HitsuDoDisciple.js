const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class HitsuDoDisciple extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Dishonor a character',
            condition: context => context.source.game.isDuringConflict('military') &&
                context.source.isParticipating() &&
                this.game.currentConflict.getNumberOfCardsPlayed(context.player) >= 3,
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card, context) => card.isParticipating() && card !== context.source,
                gameAction: AbilityDsl.actions.dishonor()
            }
        });
    }
}

HitsuDoDisciple.id = 'hitsu-do-disciple';

module.exports = HitsuDoDisciple;
