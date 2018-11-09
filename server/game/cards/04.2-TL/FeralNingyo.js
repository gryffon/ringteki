const DrawCard = require('../../drawcard.js');
const { Locations } = require('../../Constants');

class FeralNingyo extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Put into play',
            condition: () => this.game.isDuringConflict('water'),
            location: Locations.Hand,
            gameAction: ability.actions.putIntoConflict(),
            then: () => ({
                gameAction: ability.actions.delayedEffect({
                    when: {
                        onConflictFinished: () => true
                    },
                    message: '{0} returns to the deck and shuffles due to it\'s effect',
                    gameAction: ability.actions.returnToDeck({ shuffle: true })
                })
            })
        });
    }
}

FeralNingyo.id = 'feral-ningyo';

module.exports = FeralNingyo;
