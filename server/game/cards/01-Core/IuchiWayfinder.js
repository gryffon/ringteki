const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Locations, Players, CardTypes } = require('../../Constants');

class IuchiWayfinder extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Look at a province',
            when: {
                onCharacterEntersPlay: (event, context) => event.card === context.source
            },
            effect: 'look at a province',
            gameAction: AbilityDsl.actions.selectCard({
                activePromptTitle: 'Choose a province to look at',
                cardType: CardTypes.Province,
                location: Locations.Provinces,
                controller: Players.Opponent,
                gameAction: AbilityDsl.actions.lookAt(context => ({
                    message: '{0} sees {1} in {2}',
                    messageArgs: (cards) => [context.source, cards[0], cards[0].location]
                }))
            })
        });
    }
}

IuchiWayfinder.id = 'iuchi-wayfinder';

module.exports = IuchiWayfinder;
