const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');
const { CardTypes, Durations, Locations, Players } = require('../../Constants');

class AkodoZentaro extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Take control of holding',
            condition: context => context.source.isParticipating(),
            target: {
                cardType: CardTypes.Holding,
                controller: Players.Opponent,
                cardCondition: card => card.location === this.game.currentConflict.conflictProvince.location && !card.isUnique(),
                gameAction: AbilityDsl.actions.ifAble(context => ({
                    ifAbleAction: AbilityDsl.actions.joint([
                        AbilityDsl.actions.takeControl({ target: context.target }),
                        AbilityDsl.actions.selectCard({
                            cardType: CardTypes.Province,
                            controller: Players.Self,
                            cardCondition: card => card.location !== Locations.StrongholdProvince && !card.isBroken,
                            subActionProperties: card => ({ destination: card.location, target: context.player.getDynastyCardInProvince(card.location) }),
                            gameAction: AbilityDsl.actions.multiple([
                                AbilityDsl.actions.moveCard({
                                    target: context.target,
                                    changePlayer: true
                                }),
                                AbilityDsl.actions.discardCard()
                            ])
                        })
                    ]),
                    otherwiseAction: AbilityDsl.actions.discardCard({ target: context.target })
                }))
            },
            effect: 'take control of {0} and move it one of their provinces'
        });
    }
}

AkodoZentaro.id = 'akodo-zentaro';

module.exports = AkodoZentaro;
