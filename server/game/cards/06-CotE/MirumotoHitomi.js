const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes, Players, TargetModes, DuelTypes } = require('../../Constants');

class MirumotoHitomi extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Initiate a military duel',
            condition: context => context.source.isParticipating(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                cardCondition: card => card.isParticipating(),
                mode: TargetModes.UpTo,
                numCards: 2,
                gameAction: AbilityDsl.actions.duel(context => ({
                    type: DuelTypes.Military,
                    challenger: context.source,
                    message: '{0} chooses whether to dishonor or bow {1}',
                    messageArgs: duel => [context.source === duel.winner ? context.player : context.player.opponent, duel.loser],
                    gameAction: duel => duel.loser && AbilityDsl.actions.multiple([].concat(duel.loser).map(card => AbilityDsl.actions.chooseAction({
                        target: card,
                        player: context.player !== card.controller ? Players.Opponent : Players.Self,
                        messages: {
                            'Dishonor this character': '{0} chooses to dishonor {1}',
                            'Bow this character': '{0} chooses to bow {1}'
                        },
                        choices: {
                            'Dishonor this character': AbilityDsl.actions.dishonor(),
                            'Bow this character': AbilityDsl.actions.bow()
                        }
                    })))
                }))
            }
        });
    }
}

MirumotoHitomi.id = 'mirumoto-hitomi';

module.exports = MirumotoHitomi;
