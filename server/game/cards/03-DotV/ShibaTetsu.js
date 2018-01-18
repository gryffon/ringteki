const DrawCard = require('../../drawcard.js');

class ShibaTetsu extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Gain +1/+1',
            limit: ability.limit.unlimitedPerConflict(),
            when: {
                onCardPlayed: event => (
                    event.player === this.controller && event.card.hasTrait('spell') && this.game.currentConflict
                )
            },
            handler: () => {
                this.untilEndOfConflict(ability => ({
                    match: this,
                    effect: [
                        ability.effects.modifyMilitarySkill(1),
                        ability.effects.modifyMilitarySkill(1)
                    ]
                }));
            }
        });
    }
}

ShibaTetsu.id = 'shiba-tetsu';

module.exports = ShibaTetsu;
