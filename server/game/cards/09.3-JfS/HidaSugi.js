const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Locations, Players } = require('../../Constants');

class HidaSugi extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Move a discarded dynasty card',
            when: {
                afterConflict: (event, context) => event.conflict.winner === context.player && context.source.isParticipating()
            },
            target: {
                location: Locations.DynastyDiscardPile,
                player: Players.Any,
                gameAction: AbilityDsl.actions.moveCard({ destination: Locations.DynastyDeck, bottom: true})
            },
            effect: 'move {0} to bottom of {1}\'s dynasty deck',
            effectArgs: context => [context.target.controller]
        });
    }
}

HidaSugi.id = 'hida-sugi';

module.exports = HidaSugi;

