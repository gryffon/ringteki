const DrawCard = require('../../drawcard.js');

class IkomaEiji extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Put a character into play',
            when: {
                afterConflict: (event, context) => event.conflict.loser === context.player && event.conflict.conflictType === 'political'
            },
            gameAction: ability.actions.putIntoPlay().promptForSelect(context => ({
                cardType: 'character', 
                cardCondition: card => ['stronghold province', 'province 1', 'province 2', 'province 3', 'province 4', 'dynasty discard pile'].includes(card.location) &&
                                       card.hasTrait('bushi') && card.getCost() < 4 && card.controller === context.player,
                message: '{0} puts {2} into play'
            }))
        });
    }
}

IkomaEiji.id = 'ikoma-eiji';

module.exports = IkomaEiji;
