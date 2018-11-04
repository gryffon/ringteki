const DrawCard = require('../../drawcard.js');

class YasukiBroker extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => context.source.isParticipating(),
            match: card => card.getType() === 'character',
            effect: [
                ability.effects.addKeyword('courtesy'),
                ability.effects.addKeyword('sincerity')
            ]
        });
    }
}

YasukiBroker.id = 'yasuki-broker'; // This is a guess at what the id might be - please check it!!!

module.exports = YasukiBroker;
