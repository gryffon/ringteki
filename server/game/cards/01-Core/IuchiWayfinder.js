const DrawCard = require('../../drawcard.js');
const { Locations } = require('../../Constants');

class IuchiWayfinder extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Look at a province',
            when: {
                onCharacterEntersPlay: (event, context) => event.card === context.source
            },
            effect: 'look at a province',
            gameAction: ability.actions.lookAt({
                chatMessage: true,
                promptForSelect: {
                    activePromptTitle: 'Choose a province to look at',
                    cardType: 'province',
                    location: Locations.Provinces,
                    controller: 'opponent'
                }
            })
        });
    }
}

IuchiWayfinder.id = 'iuchi-wayfinder';

module.exports = IuchiWayfinder;
