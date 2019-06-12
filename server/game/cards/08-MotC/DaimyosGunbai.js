const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Locations, DuelTypes } = require('../../Constants');

class DaimyosGunbai extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Initiate a military duel and attach this to the winner',
            condition: context => context.game.isDuringConflict(),
            location: Locations.Hand,
            initiateDuel: {
                type: DuelTypes.Military,
                opponentChoosesDuelTarget: true,
                gameAction: duel => AbilityDsl.actions.attach(context => ({
                    target: duel.winner,
                    attachment: context.source
                }))
            },
            then: {
                thenCondition: () => true,
                gameAction: AbilityDsl.actions.discardCard(context => ({
                    target: context.source.location === 'hand' ? context.source : []
                }))
            }
        });
    }
}

DaimyosGunbai.id = 'daimyo-s-gunbai';

module.exports = DaimyosGunbai;
