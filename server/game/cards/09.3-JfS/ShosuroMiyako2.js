const DrawCard = require('../../drawcard.js');
const { CardTypes, Locations, Players } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class ShosuroMiyako2 extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            location: Locations.Any,
            effect: AbilityDsl.effects.playerCannot({
                cannot: 'playCharacter',
                restricts: 'source'
            })
        });

        this.reaction({
            title: 'Dishonor a character',
            when: {
                onCardPlayed: (event, context) => event.card === context.source
            },
            target: {
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                cardCondition: card => !card.isUnique(),
                gameAction: AbilityDsl.actions.dishonor()
            }
        });
    }

    canDisguise(card, context, intoConflictOnly) {
        return !card.isFaction('scorpion') &&
            card.allowGameAction('discardFromPlay', context) &&
            !card.isUnique() &&
            (!intoConflictOnly || card.isParticipating());
    }
}

ShosuroMiyako2.id = 'shosuro-miyako-2';

module.exports = ShosuroMiyako2;
