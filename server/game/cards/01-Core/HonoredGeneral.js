const DrawCard = require('../../drawcard.js');

class HonoredGeneral extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => context.source.isParticipating(),
            match: (card, context) => card.isParticipating() && card.isFaction('lion') && card !== context.source,
            effect: ability.effects.modifyMilitarySkill(1)
        });
        
        this.reaction({
            title: 'Honor this character',
            when: {
                onCharacterEntersPlay: (event, context) => event.card === context.source
            },
            gameAction: ability.actions.honor()
        });
    }
}

HonoredGeneral.id = 'honored-general';

module.exports = HonoredGeneral;


