const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Players, CardTypes, DuelTypes } = require('../../Constants');

class HonestChallenger extends DrawCard {
    setupCardAbilities(ability) {
        this.composure({
            effect: ability.effects.modifyMilitarySkill(2)
        });

        this.action({
            title: 'Initiate a military duel',
            initiateDuel: context => ({
                type: DuelTypes.Military,
                message: '{0} chooses a character to move to the conflict',
                messageArgs: duel => duel.winner && duel.winner.controller,
                gameAction: duel => duel.winner && AbilityDsl.actions.selectCard({
                    activePromptTitle: 'Choose a character to move to the conflict',
                    cardType: CardTypes.Character,
                    player: duel.winner.controller === context.player ? Players.Self : Players.Opponent,
                    controller: duel.winner.controller === context.player ? Players.Self : Players.Opponent,
                    message: '{0} moves {1} to the conflict',
                    messageArgs: (card, player) => [player, card],
                    gameAction: AbilityDsl.actions.moveToConflict()
                })
            })
        });
    }
}

HonestChallenger.id = 'honest-challenger';

module.exports = HonestChallenger;
