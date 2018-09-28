const CardGameAction = require('./CardGameAction');

class AttachAction extends CardGameAction {
    setDefaultProperties() {
        this.attachment = null;
        this.attachmentChosenOnResolution = false;
    }

    setup() {
        this.name = 'attach';
        this.targetType = ['character'];
        this.effectMsg = 'attach {1} to {0}';
        this.effectArgs = () => {
            return this.attachment;
        };
    }

    canAffect(card, context) {
        if(!context || !context.player || !card || card.location !== 'play area') {
            return false;
        } else if(this.attachmentChosenOnResolution) {
            return super.canAffect(card, context);
        }
        if(!this.attachment || this.attachment.anotherUniqueInPlay(context.player) || !this.attachment.canAttach(card, context)) {
            return false;
        }
        return card.allowAttachment(this.attachment) && super.canAffect(card, context);
    }

    checkEventCondition(event) {
        return this.canAffect(event.parent, event.context);
    }

    fullyResolved(event) {
        return this.target.length === 0 || this.target.includes(event.parent);
    }

    getEventArray(context) {
        this.attachmentChosenOnResolution = false;
        return super.getEventArray(context);
    }

    getEvent(card, context) {
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
    }
}

module.exports = AttachAction;
