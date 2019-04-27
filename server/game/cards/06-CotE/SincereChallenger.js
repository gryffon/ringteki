const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { DuelTypes } = require('../../Constants');

class SincereChallenger extends DrawCard {
    setupCardAbilities() {
        this.composure({
            effect: AbilityDsl.effects.modifyPoliticalSkill(2)
        });
        this.action({
            title: 'Initiate a Political duel',
            initiateDuel: {
                type: DuelTypes.Political,
                message: '{0} is immune to events until the end of the conflict',
                messageArgs: duel => duel.winner,
                gameAction: duel => AbilityDsl.actions.cardLastingEffect({
                    target: duel.winner,
                    effect: AbilityDsl.effects.immunity({ restricts: 'events' })
                })
            }
        });
    }
}

SincereChallenger.id = 'sincere-challenger';

module.exports = SincereChallenger;
