const CardGameAction = require('./CardGameAction');
const DiscardFromPlayAction = require('./DiscardFromHandAction');

class AttachAction extends CardGameAction {
    constructor(attachment, discardOnFailure = false) {
        super('attach');
        this.attachment = attachment;
        this.discardOnFailure = discardOnFailure;
        this.targetType = ['character'];
        this.effect = 'attach {1} to {0}';
        this.effectArgs = () => {
            return this.attachment;
        };
    }

    canAffect(card, context, eventCheck = false) {
        if(!eventCheck && this.discardOnFailure) {
            // this should return true for discardOnFailure effects
            return true;
        }
        if(!context || !context.player || !this.attachment || !card || card.location !== 'play area') {
            return false;
        }
        if(this.attachment.anotherUniqueInPlay(context.player) || !this.attachment.canAttach(card, context)) {
            return false;
        }
        return card.allowAttachment(this.attachment) && super.canAffect(card, context);
    }

    checkEventCondition(event) {
        return this.canAffect(event.parent, event.context);
    }

    getEvent(card, context) {
        if(this.canAffect(card, context, true)) {
            return super.createEvent('onCardAttached', { card: this.attachment, parent: card, context: context }, event => {
                if(event.card.location === 'play area') {
                    event.card.parent.removeAttachment(event.card);
                } else {
                    event.card.controller.removeCardFromPile(event.card);
                    event.card.new = true;
                    event.card.moveTo('play area');
                }
                event.parent.attachments.push(event.card);
                event.card.parent = event.parent;
                event.card.controller = context.player;
            });
        } else if(this.discardOnFailure && this.attachment.allowGameAction('discardFromPlay')) {
            context.game.addMessage('{0} cannot be attached to {1} so it is discarded', this.attachment, card);
            this.attachment.controller = context.player;
            return new DiscardFromPlayAction().getEvent(this.attachment, context);
        }
    }
}

module.exports = AttachAction;
