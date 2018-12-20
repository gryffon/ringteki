const DrawCard = require('../../drawcard.js');

class ShinjoTrailblazer extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Gain +2/+2',
            when: {
                onCardRevealed: (event, context) => event.card.isProvince && event.card.controller === context.source.controller.opponent && this.game.isDuringConflict()
            },
            gameAction: ability.actions.cardLastingEffect({ effect: ability.effects.modifyBothSkills(2) }),
            effect: 'to give {0} +2{1}, +2{2}',
            effectArgs: () => ['military', 'political']
        });
    }
}

ShinjoTrailblazer.id = 'shinjo-trailblazer';

module.exports = ShinjoTrailblazer;
