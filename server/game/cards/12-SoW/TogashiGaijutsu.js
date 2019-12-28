const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class TogashiGaijutsu extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Ready a character',
            when: {
                onCardPlayed: (event, context) => (
                    event.card.parent &&
                    event.card.type === CardTypes.Attachment &&
                    event.card.hasTrait('tattoo') &&
                    event.card.controller === context.player
                )
            },
            gameAction: AbilityDsl.actions.ready(context => ({ target: context.event.card.parent }))
        });
    }
}

TogashiGaijutsu.id = 'togashi-gaijutsu';

module.exports = TogashiGaijutsu;
