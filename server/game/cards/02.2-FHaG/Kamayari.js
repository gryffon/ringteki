const DrawCard = require('../../drawcard.js');

class Kamayari extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Bow character who triggered ability',
            when: {
                // TODO: Need to check for immunity and cannot restrictions - requires TriggeredAbility to pass context to this function
                onCardAbilityInitiated: event => event.card.type === 'character' && this.parent.isParticipating() && !event.card.bowed && event.context.ability.isTriggeredAbility()
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to bow {2}', this.controller, this, context.event.card);
                this.game.applyGameAction(context, { bow: context.target });
            }
        });
    }

    canAttach(card) {
        if(card.hasTrait('bushi')) {
            return super.canAttach(card);
        }
        return false;
    }
}

Kamayari.id = 'kamayari';

module.exports = Kamayari;
