const DrawCard = require('../../drawcard.js');
const { CardTypes, Durations, Players } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class AsahinaTakamori extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Choose a character to pacify',
            when: {
                onCardPlayed: (event) => event.card.type === CardTypes.Character && event.card.isFaction('crane')
            },
            target: {
                controller: Players.Opponent,
                cardType: CardTypes.Character,
                cardCondition: (card, context) => card.getCost() <= context.event.card.getCost(),
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    duration: Durations.UntilEndOfRound,
                    effect: [
                        AbilityDsl.effects.cannotParticipateAsAttacker(),
                        AbilityDsl.effects.cannotParticipateAsDefender()
                    ]
                })
            },
            effect: 'prevent {0} from being declared as an attacker or defender this round'
        });
    }
}

AsahinaTakamori.id = 'asahina-takamori';

module.exports = AsahinaTakamori;
