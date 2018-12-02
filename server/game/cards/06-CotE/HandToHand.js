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
            then: context => ({
                target: {
                    player: Players.Opponent,
                    mode: TargetModes.Select,
                    activePromptTitle: 'Resolve Hand to Hand\'s ability again?',
                    choices: {
                        'Yes': ability.actions.resolveAbility({ ability: context.ability, player: context.player.opponent }),
                        'No': () => true
                    }
                },
                message: '{0} chooses to resolve {1}\'s ability again'
            })
        });
    }
}

HandToHand.id = 'hand-to-hand';

module.exports = HandToHand;
