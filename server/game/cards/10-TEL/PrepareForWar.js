import { CardTypes, Players, TargetModes } from '../../Constants.js';
const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');


class PrepareForWar extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Remove honor token and any attachment',
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.selectCard(context => ({
                        mode: TargetModes.Unlimited,
                        cardType: CardTypes.Attachment,
                        controller: Players.Self,
                        cardCondition: card => card.parent === context.target,
                        activePromptTitle: 'Choose any amount of attachments',
                        optional: true,
                        gameAction: AbilityDsl.actions.discardCard(),
                        message: '{0} chooses to discard {1} from {2}',
                        messageArgs: cards => [context.player, cards.length === 0 ? 'no attachments' : cards, context.target]
                    })),
                    AbilityDsl.actions.menuPrompt(context => ({
                        activePromptTitle: 'Do you wish to discard the status token?',
                        choices: ['Yes', 'No'],
                        optional: true,
                        choiceHandler: (choice, displayMessage) => {
                            if(displayMessage && choice === 'Yes') {
                                this.game.addMessage('{0} chooses to discard the status token from {1}', context.player, context.target);
                            }

                            return { target: (choice === 'Yes' ? context.target.personalHonor : []) };
                        },
                        player: Players.Self,
                        gameAction: AbilityDsl.actions.discardStatusToken()
                    })),
                    AbilityDsl.actions.honor(context => ({
                        target: context.target.hasTrait('commander') ? context.target : []
                    }))
                ])
            }
        });
    }
}

PrepareForWar.id = 'prepare-for-war';

module.exports = PrepareForWar;
