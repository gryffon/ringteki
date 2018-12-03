const DrawCard = require('../../drawcard.js');
const PlayAttachmentAction = require('../../playattachmentaction.js');
const { CardTypes } = require('../../Constants');

class PlayAncientMasterAsAttachment extends PlayAttachmentAction {
    constructor(card) {
        super(card);
        this.title = 'Play Ancient Master as an attachment';
    }

    canResolveTargets(context) {
        context.source.type = CardTypes.Attachment;
        let result = super.canResolveTargets(context);
        context.source.type = CardTypes.Character;
        return result;
    }

    resolveTargets(context) {
        context.source.type = CardTypes.Attachment;
        return super.resolveTargets(context);
    }
}

class AncientMaster extends DrawCard {
    setupCardAbilities(ability) {
        this.abilities.playActions.push(new PlayAncientMasterAsAttachment(this));
        this.reaction({
            title: 'Search top 5 card for kiho or tattoo',
            when: {
                onConflictDeclared: (event, context) => context.source.type === CardTypes.Attachment && event.attackers.includes(context.source.parent),
                onDefendersDeclared: (event, context) => context.source.type === CardTypes.Attachment && event.defenders.includes(context.source.parent)
            },
            printedAbility: false,
            effect: 'look at the top five cards of their deck',
            gameAction: ability.actions.deckSearch({
                amount: 5,
                cardCondition: card => card.hasTrait('kiho') || card.hasTrait('tattoo')
            })
        });
    }

    leavesPlay() {
        this.type = CardTypes.Character;
        super.leavesPlay();
    }
}

AncientMaster.id = 'ancient-master';

module.exports = AncientMaster;
