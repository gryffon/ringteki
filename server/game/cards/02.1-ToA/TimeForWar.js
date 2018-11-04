const DrawCard = require('../../drawcard.js');
const { Locations } = require('../../Constants');

class TimeForWar extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Put a weapon into play',
            when: {
                afterConflict: event => event.conflict.loser === this.controller && event.conflict.conflictType === 'political'
            },
            targets: {
                weapon: {
                    cardType: 'attachment',
                    location: [Locations.ConflictDiscardPile, Locations.Hand],
                    controller: 'self',
                    cardCondition: card => card.costLessThan(4) && card.hasTrait('weapon')
                },
                bushi: {
                    dependsOn: 'weapon',
                    cardType: 'character',
                    controller: 'self',
                    cardCondition: card => card.hasTrait('bushi'),
                    gameAction: ability.actions.attach(context => ({ attachment: context.targets.weapon }))
                }
            }
        });
    }
}

TimeForWar.id = 'time-for-war';

module.exports = TimeForWar;
