const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes } = require('../../Constants');

class ShosuroHyobu extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Dishonor a character',
            when: {
                onCardsDiscardedFromHand: (event, context) =>
                    context.player.opponent === event.context.player && (event.context.ability.isCardAbility() || !event.context.ability.isCardPlayed()) &&
                    [CardTypes.Event, CardTypes.Character, CardTypes.Holding, CardTypes.Attachment, CardTypes.Stronghold, CardTypes.Province, CardTypes.Role].includes(event.context.source.type),
                onCardsDiscarded: (event, context) =>
                    context.player.opponent === event.context.player && (event.context.ability.isCardAbility() || !event.context.ability.isCardPlayed()) &&
                    [CardTypes.Event, CardTypes.Character, CardTypes.Holding, CardTypes.Attachment, CardTypes.Stronghold, CardTypes.Province, CardTypes.Role].includes(event.context.source.type)
            },
            target: {
                cardType: CardTypes.Character,
                gameAction: AbilityDsl.actions.dishonor()
            }
        });
    }
}

ShosuroHyobu.id = 'shosuro-hyobu';

module.exports = ShosuroHyobu;
