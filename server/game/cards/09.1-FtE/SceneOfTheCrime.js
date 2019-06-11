const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl');

class SceneOfTheCrime extends ProvinceCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Look at opponent\'s hand',
            when: {
                onCardRevealed: (event, context) => event.card === context.source && context.player.opponent
            },
            effect: 'look at {1}\'s hand',
            effectArgs: context => context.player.opponent,
            gameAction: AbilityDsl.actions.lookAt(context => ({ target: context.player.opponent.hand.sortBy(card => card.name), chatMessage: true }))
        });
    }
}

SceneOfTheCrime.id = 'scene-of-the-crime';

module.exports = SceneOfTheCrime;
