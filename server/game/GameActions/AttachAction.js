const CardGameAction = require('./CardGameAction');
const DiscardFromPlayAction = require('./DiscardFromHandAction');

class AttachAction extends CardGameAction {
    constructor(attachment, discardOnFailure = false) {
        super('attach');
        this.attachment = attachment;
        this.discardOnFailure = discardOnFailure;
        this.effect = 'attach {1} to {0}';
        this.effectArgs = () => {
            return this.attachment;
        };
    }

    canAffect(card, context = this.context) {
        if(!context || !context.player || !this.attachment || !card || card.location !== 'play area') {
            return false;
        }
        if(this.attachment.anotherUniqueInPlay(context.player) || !this.attachment.canAttach(card, context)) {
            return false;
        }
        return card.allowAttachment(this.attachment) && super.canAffect(card, context);
    }

    getEvent(card, context = this.context) {
        if(this.canAffect(card, context)) {
            return super.createEvent('onCardAttached', { card: this.attachment, parent: card, context: context }, event => {
                if(event.card.location === 'play area') {
                    event.parent.removeAttachment(event.card);
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
