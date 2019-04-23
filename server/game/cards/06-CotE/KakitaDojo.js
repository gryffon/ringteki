const DrawCard = require('../../drawcard.js');
const { DuelTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class KakitaDojo extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Initiate a military duel',
            initiateDuel: {
                type: DuelTypes.Military,
                gameAction: duel => AbilityDsl.actions.multiple([
                    AbilityDsl.actions.cardLastingEffect({ effect: AbilityDsl.effects.cardCannot('triggerAbilities') }),
                    AbilityDsl.actions.bow({ target: duel.winner && duel.winner.hasTrait('duelist') && duel.loser })
                ])
            }
        });
    }

    resolutionHandler(context, winner, loser) {
        if(loser) {
            if(winner.hasTrait('duelist')) {
                this.game.addMessage('{0} loses the duel and is bowed and cannot trigger its abilities until the end of the conflict', loser);
                this.game.actions.multiple(
                    [
                        AbilityDsl.actions.bow(),
                        AbilityDsl.actions.cardLastingEffect({
                            effect: AbilityDsl.effects.cardCannot('triggerAbilities')
                        })
                    ]
                ).resolve(loser, context);
            } else {
                this.game.addMessage('{0} loses the duel and cannot trigger its abilities until the end of the conflict', loser);
                this.game.actions.cardLastingEffect({ effect: AbilityDsl.effects.cardCannot('triggerAbilities') }).resolve(loser, context);
            }
        } else {
            this.game.addMessage('{0} wins the duel but there is no loser', winner);
        }
    }
}

KakitaDojo.id = 'kakita-dojo';

module.exports = KakitaDojo;
