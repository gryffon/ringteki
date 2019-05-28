const DrawCard = require('../../drawcard.js');
const PlayAttachmentAction = require('../../playattachmentaction.js');
const { CardTypes } = require('../../Constants');

class PlayTogashiKazueAsAttachment extends PlayAttachmentAction {
    constructor(card) {
        super(card);
        this.title = 'Play Togashi Kazue as an attachment';
    }

    canResolveTargets(context) {
        context.source.type = CardTypes.Attachment;
        let result = super.canResolveTargets(context);
        context.source.type = CardTypes.Character;
        return result;
    }

    resolveTargets(context) {
        context.source.type = CardTypes.Attachment;
        const targetResults = super.resolveTargets(context);
        context.game.queueSimpleStep(() => {
            if(targetResults.cancelled) {
                context.source.type = CardTypes.Character;
            }
        });
        return targetResults;
    }
}

class TogashiKazue extends DrawCard {
    setupCardAbilities(ability) {
        this.abilities.playActions.push(new PlayTogashiKazueAsAttachment(this));
        this.action({
            title: 'Steal a fate',
            condition: context => context.source.type === CardTypes.Attachment && context.source.parent.isParticipating(),
            printedAbility: false,
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card, context) => card.isParticipating() && card !== context.source.parent,
                gameAction: ability.actions.removeFate(context => ({ recipient: context.source.parent }))
            },
            effect: 'steal a fate from {0} and place it on {1}',
            effectArgs: context => context.source.parent
        });
    }

    leavesPlay() {
        this.type = CardTypes.Character;
        super.leavesPlay();
    }
}

TogashiKazue.id = 'togashi-kazue';

module.exports = TogashiKazue;
