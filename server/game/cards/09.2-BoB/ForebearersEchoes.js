const DrawCard = require('../../drawcard.js');
const { CardTypes, Durations, Locations, Players } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class ForebearersEchoes extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Put a character into play',
            condition: context => context.game.isDuringConflict('military'),
            target: {
                activePromptTitle: 'Choose a character from your dynasty discard pile',
                location: Locations.DynastyDiscardPile,
                controller: Players.Self,
                cardType: CardTypes.Character,
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.putIntoConflict(context => ({
                        target: context.target
                    })),
                    AbilityDsl.actions.cardLastingEffect(context => ({
                        target: context.target,
                        duration: Durations.UntilEndOfPhase,
                        location: [Locations.DynastyDiscardPile, Locations.PlayArea],
                        effect: AbilityDsl.effects.delayedEffect({
                            when: {
                                onConflictFinished: () => true
                            },
                            message: '{1} returns to the bottom of the dynasty deck due to the delayed effect of {0}',
                            messageArgs: [context.source, context.target],
                            gameAction: AbilityDsl.actions.returnToDeck({ bottom: true })
                        })
                    }))
                ])
            }
        });
    }
}

ForebearersEchoes.id = 'forebearer-s-echoes';

module.exports = ForebearersEchoes;
