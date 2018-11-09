const DrawCard = require('../../drawcard.js');
const { Locations, Players, CardTypes } = require('../../Constants');

class TimeForWar extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Put a weapon into play',
            when: {
                afterConflict: event => event.conflict.loser === this.controller && event.conflict.conflictType === 'political'
            },
            targets: {
                weapon: {
                    cardType: CardTypes.Attachment,
                    location: [Locations.ConflictDiscardPile, Locations.Hand],
                    controller: Players.Self,
                    cardCondition: card => card.costLessThan(4) && card.hasTrait('weapon')
                },
                bushi: {
                    dependsOn: 'weapon',
                    cardType: CardTypes.Character,
                    controller: Players.Self,
                    cardCondition: card => card.hasTrait('bushi'),
                    gameAction: ability.actions.attach(context => ({ attachment: context.targets.weapon }))
                }
            }
        });
    }
}

TimeForWar.id = 'time-for-war';

module.exports = TimeForWar;
