const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Locations, DuelTypes, CardTypes, Players } = require('../../Constants');

class DaimyosGunbai extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Initiate a military duel and attach this to the winner',
            condition: context => context.game.isDuringConflict(),
            location: Locations.Hand,
            targets: {
                challenger: {
                    cardType: CardTypes.Character,
                    controller: Players.Self,
                    cardCondition: card => card.isParticipating()
                },
                duelTarget: {
                    dependsOn: 'challenger',
                    cardType: CardTypes.Character,
                    controller: Players.Opponent,
                    player: Players.Opponent,
                    cardCondition: card => card.isParticipating(),
                    gameAction: AbilityDsl.actions.sequential([
                        AbilityDsl.actions.duel(context => ({
                            type: DuelTypes.Military,
                            challenger: context.targets.challenger,
                            gameAction: duel => AbilityDsl.actions.attach(context => ({
                                target: duel.winner,
                                attachment: context.source
                            }))
                        })),
                        AbilityDsl.actions.discardCard(context => ({
                            target: context.source.location === 'hand' ? context.source : []
                        }))
                    ])
                }
            }
        });
    }
}

DaimyosGunbai.id = 'daimyo-s-gunbai';

module.exports = DaimyosGunbai;
