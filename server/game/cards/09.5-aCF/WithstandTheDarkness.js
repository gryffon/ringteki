const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Players, Locations, CardTypes } = require('../../Constants');

class WithstandTheDarkness extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardPlayed: (event, context) => (
                    // event.player === context.player.opponent &&
                    event.card.type === CardTypes.Event //&& 
                    // event.cardTargets &&
                    // event.cardTargets.some(card => (
                    //     card.type === CardTypes.Character &&
                    //     card.isFaction('crab') && 
                    //     card.controller === context.player && 
                    //     card.location === Locations.PlayArea))
                )},
            title: 'Place a fate on a character',
            target: {
                activePromptTitle: 'Choose a character to receive a fate.',
                cardType: CardTypes.Character,
                location: Locations.PlayArea,
                controller: Players.Self,
                // cardCondition: (card, event, context) => (
                //     card.isFaction('crab') && 
                //     card.controller === context.player && 
                //     card.location === Locations.PlayArea &&
                //     event.cardTargets.includes(card)),
                gameAction: AbilityDsl.actions.placeFate()
            },
        });
    }
}

WithstandTheDarkness.id = 'withstand-the-darkness';

module.exports = WithstandTheDarkness;
