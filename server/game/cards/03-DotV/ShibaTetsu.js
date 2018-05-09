const DrawCard = require('../../drawcard.js');

class ShibaTetsu extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Gain +1/+1',
            limit: ability.limit.unlimitedPerConflict(),
            when: {
                onCardPlayed: (event, context) => event.player === context.player && event.card.hasTrait('spell') && this.game.isDuringConflict()
            },
            effect: 'give him +1{1}/+2{2}',
            effectArgs: () => ['military', 'political'],
            untilEndOfConflict: context => ({
                match: context.source,
                effect: [
                    ability.effects.modifyMilitarySkill(1),
                    ability.effects.modifyPoliticalSkill(1)
                ]
            })
        });
    }
}

ShibaTetsu.id = 'shiba-tetsu';

module.exports = ShibaTetsu;
