const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class KireiKo extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Bow a character who triggered an ability',
            when: {
                onCardAbilityTriggered: (event, context) => event.card.type === CardTypes.Character && event.card.controller === context.player.opponent
            },
            gameAction: ability.actions.bow(context => ({ target: context.event.card }))
        });
    }
}

KireiKo.id = 'kirei-ko';

module.exports = KireiKo;
