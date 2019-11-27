const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const EventRegistrar = require('../../eventregistrar.js');
const { Players, Locations, CardTypes, EventNames, AbilityTypes } = require('../../Constants');

class WithstandTheDarkness extends DrawCard {
    setupCardAbilities() {
        let currentTargets = [];

        this.reaction({
            when: {
                onCardPlayed: (event, context) => {
                    currentTargets = event.cardTargets;
                    if (!Array.isArray(currentTargets))
                        currentTargets = [currentTargets];
                    return (event.card.controller === context.player.opponent &&
                    event.card.type === CardTypes.Event &&
                    currentTargets.some(card => (
                        card.type === CardTypes.Character &&
                        card.isFaction('crab') &&
                        card.controller === context.player &&
                        card.location === Locations.PlayArea))
                    );
                }},
            title: 'Place a fate on a character',
            target: {
                activePromptTitle: 'Choose a character to receive a fate',
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: card => card.isFaction('crab') && currentTargets.includes(card),
                gameAction: AbilityDsl.actions.placeFate()
            },
            max: AbilityDsl.limit.perPhase(1),
        });
    }
}

WithstandTheDarkness.id = 'withstand-the-darkness';

module.exports = WithstandTheDarkness;
