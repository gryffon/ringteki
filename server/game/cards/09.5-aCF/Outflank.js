const DrawCard = require('../../drawcard.js');
const EventRegistrar = require('../../eventregistrar.js');
const { EventNames, Durations, CardTypes, Players } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class Outflank extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Prevent a character from declaring as a defender',
            when: {
                onCardRevealed: (event, context) => event.onDeclaration && event.card.isProvince && event.card.controller === context.source.controller.opponent && this.game.isDuringConflict()
            },
            target: {
                controller: Players.Opponent,
                cardType: CardTypes.Character,
                cardCondition: card => !card.isUnique(),
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    duration: Durations.UntilEndOfConflict,
                    effect: AbilityDsl.effects.cardCannot('declareAsDefender')
                })
            },
            effect: 'prevent {0} from defending this conflict'
        });
    }
}

Outflank.id = 'outflank';

module.exports = Outflank;
