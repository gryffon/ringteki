const DrawCard = require('../../drawcard.js');
const { Locations } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class FeralNingyo extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Put into play',
            condition: () => this.game.isDuringConflict('water'),
            location: [Locations.Hand, Locations.PlayArea],
            effect: '{1}return {0} to the deck at the end of the conflict',
            effectArgs: context => [context.source.location !== Locations.PlayArea ? ['put {0} into play into the conflict and ', context.source] : ''],
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.putIntoConflict(context => ({
                    target: context.source
                })),
                AbilityDsl.actions.delayedEffect(context => ({
                    target: context.source,
                    location: [Locations.Hand, Locations.PlayArea],
                    when: {
                        onConflictFinished: () => true
                    },
                    message: '{0} returns to the deck and shuffles due to its delayed effect',
                    gameAction: AbilityDsl.actions.returnToDeck({ shuffle: true })
                }))
            ])
        });
    }
}

FeralNingyo.id = 'feral-ningyo';

module.exports = FeralNingyo;
