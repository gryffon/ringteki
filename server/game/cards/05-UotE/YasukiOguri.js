const DrawCard = require('../../drawcard.js');

class YasukiOguri extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Gain +1/+1',
            limit: ability.limit.unlimitedPerConflict(),
            when: {
                onCardPlayed: (event, context) => event.player === context.player.opponent && event.card.type === 'event' && context.source.isDefending()
            },
            effect: 'give him +1{1}/+1{2}',
            effectArgs: () => ['military', 'political'],
            gameAction: ability.actions.cardLastingEffect({ effect: ability.effects.modifyBothSkills(1) })
        });
    }
}

YasukiOguri.id = 'yasuki-oguri'; // This is a guess at what the id might be - please check it!!!

module.exports = YasukiOguri;
