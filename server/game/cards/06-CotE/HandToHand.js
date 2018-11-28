const DrawCard = require('../../drawcard.js');
const { CardTypes, Players, TargetModes } = require('../../Constants');

class HandToHand extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard an attachment',
            condition: () => this.game.isDuringConflict('military'),
            target: {
                cardType: CardTypes.Attachment,
                cardCondition: card => card.parent && card.parent.isParticipating(),
                gameAction: ability.actions.discardFromPlay()
            },
            effect: 'discard {0} from play',
            then: context => {
                let eligibleTargets = this.game.findAnyCardsInPlay(card => {
                    return card.getType() === CardTypes.Attachment &&
                        card.parent && card.parent.isParticipating() &&
                        card !== context.target;
                });
                if(eligibleTargets.length > 0) {
                    return {
                        target: {
                            player: Players.Opponent,
                            mode: TargetModes.Select,
                            activePromptTitle: 'Resolve Hand to Hand\'s ability again?',
                            choices: {
                                'Yes': ability.actions.resolveAbility({ ability: context.ability, player: context.player.opponent }),
                                'No': () => {
                                    this.game.addMessage(
                                        '{0} chooses to not resolve {1}\'s ability again',
                                        context.player.opponent,
                                        context.source
                                    );
                                    return true;
                                }
                            }
                        },
                        message: '{0} chooses to resolve {1}\'s ability again'
                    };
                }
                this.game.addMessage(
                    '{0} cannot resolve {1}\'s ability again as there are no eligible targets',
                    context.player.opponent,
                    context.source
                );
            }
        });
    }
}

HandToHand.id = 'hand-to-hand';

module.exports = HandToHand;
