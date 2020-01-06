const DrawCard = require('../../drawcard.js');
const { Locations } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class ElegantTessen extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Ready attached character',
            when: {
                onCardAttached: (event, context) => (
                    event.card === context.source && context.source.parent.getCost() <= 2 &&
                    event.originalLocation !== Locations.PlayArea
                )
            },
            gameAction: AbilityDsl.actions.ready(context => ({ target: context.source.parent }))
        });
    }
}

ElegantTessen.id = 'elegant-tessen';

module.exports = ElegantTessen;
