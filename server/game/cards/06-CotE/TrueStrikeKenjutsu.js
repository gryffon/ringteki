const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { DuelTypes } = require('../../Constants');

class TrueStrikeKenjutsu extends DrawCard {
    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility('action', {
                title: 'Initiate a military duel',
                initiateDuel: context => ({
                    type: DuelTypes.BaseMilitary,
                    resolutionHandler: (winner, loser) => this.resolutionHandler(context, winner, loser)
                }),
                printedAbility: false
            })
        });
    }

    resolutionHandler(context, winner, loser) {
        if(loser) {
            this.game.addMessage('{0} wins the duel, and bows {1}', winner, loser);
            this.game.applyGameAction(context, { bow: loser });
        } else {
            this.game.addMessage('{0} wins the duel but there is no loser', winner);
        }
    }
}

TrueStrikeKenjutsu.id = 'true-strike-kenjutsu';

module.exports = TrueStrikeKenjutsu;
