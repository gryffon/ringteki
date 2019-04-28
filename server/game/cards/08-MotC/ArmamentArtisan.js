const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class ArmamentArtisan extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Honor this character',
            when: {
                onCardHonored: (event, context) => event.card.controller === context.player && event.card !== context.source
            },
            gameAction: AbilityDsl.actions.honor()
        });
    }
}

ArmamentArtisan.id = 'armament-artisan';

module.exports = ArmamentArtisan;
