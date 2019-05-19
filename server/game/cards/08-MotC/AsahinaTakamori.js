const DrawCard = require('../../drawcard.js');
const { CardTypes, Durations, Players } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class AsahinaTakamori extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Pacify a character',
            when: {
                onCardPlayed: (event, context) => event.player === context.player && event.card.type === CardTypes.Character && event.card.isFaction('crane')
            },
            target: {
                controller: Players.Opponent,
                cardType: CardTypes.Character,
                cardCondition: (card, context) => card.costLessThan(context.event.card.getCost() + 1),
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    duration: Durations.UntilEndOfRound,
                    effect: [
                        AbilityDsl.effects.cardCannot('declareAsAttacker'),
                        AbilityDsl.effects.cardCannot('declareAsDefender')
                    ]
                })
            },
            effect: 'prevent {0} from being declared as an attacker or defender this round'
        });
    }
}

AsahinaTakamori.id = 'asahina-takamori';

module.exports = AsahinaTakamori;
