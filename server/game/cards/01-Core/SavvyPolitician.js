const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class SavvyPolitician extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Honor a character',
            when: {
                onCardHonored: (event, context) => event.card === context.source
            },
            target: {
                cardType: CardTypes.Character,
                gameAction: ability.actions.honor()
            }
        });
    }
}

SavvyPolitician.id = 'savvy-politician';

module.exports = SavvyPolitician;
