const DrawCard = require('../../drawcard');
const AbilityDsl = require('../../abilitydsl');
const {CardTypes, Durations, Locations} = require('../../Constants');

class ChampionsOfYomi extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Put into play',
            location: Locations.DynastyDiscardPile,
            cost: AbilityDsl.costs.bow({
                cardType: CardTypes.Stronghold
            }),
            when: {
                afterConflict: (event, context) => event.conflict.loser === context.player
                    && event.conflict.defendingPlayer !== context.player
                    && event.conflict.attackers && event.conflict.attackers.length !== 0
            },
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.putIntoPlay(context => ({
                    target: context.source
                })),
                AbilityDsl.actions.cardLastingEffect(context => ({
                    target: context.source,
                    duration: Durations.UntilEndOfRound,
                    effect: AbilityDsl.effects.delayedEffect({
                        when: {
                            onPhaseEnded: () => true
                        },
                        message: '{0} is removed from the game due to its delayed effect',
                        messageArgs: context => [context.source],
                        gameAction: AbilityDsl.actions.removeFromGame()
                    })
                }))
            ]),
            effect: 'put {0} into play and remove {0} from the game at the end of the phase'
        });
    }
}

ChampionsOfYomi.id = 'champions-of-yomi';

module.exports = ChampionsOfYomi;
