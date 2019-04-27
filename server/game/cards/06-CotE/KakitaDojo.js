const DrawCard = require('../../drawcard.js');
const { DuelTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class KakitaDojo extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Initiate a military duel',
            initiateDuel: {
                type: DuelTypes.Military,
                message: '{0} {1}cannot trigger its abilities until the end of the conflict',
                messageArgs: duel => [duel.loser, duel.winner && duel.winner.hasTrait('duelist') ? 'is bowed and ' : ''],
                gameAction: duel => AbilityDsl.actions.multiple([
                    AbilityDsl.actions.cardLastingEffect({ effect: AbilityDsl.effects.cardCannot('triggerAbilities') }),
                    AbilityDsl.actions.bow({ target: duel.winner && duel.winner.hasTrait('duelist') && duel.loser })
                ])
            }
        });
    }
}

KakitaDojo.id = 'kakita-dojo';

module.exports = KakitaDojo;
