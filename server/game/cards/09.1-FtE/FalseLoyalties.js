const DrawCard = require('../../drawcard.js');
const { Players, CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class FalseLoyalties extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title:'Switch 2 characters your opponent controls',
            when: {
                afterConflict: (event, context) => {
                    return context.player.opponent && event.conflict.winner === context.player.opponent &&
                    context.player.honor < context.player.opponent.honor;
                }
            },
            targets: {
                characterInConflict: {
                    activePromptTitle: 'Choose a participating character to send home',
                    cardType: CardTypes.Character,
                    controller: Players.Opponent,
                    cardCondition: card => card.isParticipating()
                },
                characterAtHome: {
                    dependsOn: 'characterInConflict',
                    activePromptTitle: 'Choose a character to move to the conflict',
                    cardType: CardTypes.Character,
                    controller: Players.Opponent,
                    cardCondition: card => !card.isParticipating(),
                    gameAction: AbilityDsl.actions.joint([
                        AbilityDsl.actions.sendHome(context => ({ target: context.targets.characterInConflict })),
                        AbilityDsl.actions.moveToConflict()
                    ])
                }
            },
            effect: 'switch {1} and {2}',
            effectArgs: context => [context.targets.characterInConflict, context.targets.characterAtHome]
        });
    }
}

FalseLoyalties.id = 'false-loyalties';

module.exports = FalseLoyalties;
