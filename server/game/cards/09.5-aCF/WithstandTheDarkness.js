const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Players, Locations, CardTypes } = require('../../Constants');

class WithstandTheDarkness extends DrawCard {
    setupCardAbilities() {
        let targets = [];
        
        this.reaction({
            when: {
                onInitiateAbilityEffects: (event, context) => {
                    targets = targets.concat(event.cardTargets);
                    return (event.card.controller === context.player.opponent &&
                    event.card.type === CardTypes.Event && 
                    event.cardTargets.some(card => (
                        card.type === CardTypes.Character &&
                        card.isFaction('crab') && 
                        card.controller === context.player && 
                        card.location === Locations.PlayArea))
                )}},
            title: 'Place a fate on a character',
            target: {
                activePromptTitle: 'Choose a character to receive a fate.',
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: card => card.isFaction('crab') && targets.includes(card),
                gameAction: AbilityDsl.actions.placeFate()
            },
        });
    }
}

WithstandTheDarkness.id = 'withstand-the-darkness';

module.exports = WithstandTheDarkness;
