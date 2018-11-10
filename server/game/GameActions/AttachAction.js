const CardGameAction = require('./CardGameAction');
const { Locations, CardTypes } = require('../Constants');

class AttachAction extends CardGameAction {
    setDefaultProperties() {
        this.attachment = null;
        this.attachmentChosenOnResolution = false;
    }

    setup() {
        this.name = 'attach';
        this.targetType = [CardTypes.Character];
        this.effectMsg = 'attach {1} to {0}';
        this.effectArgs = () => {
            return this.attachment;
        };
    }

    canAffect(card, context) {
        if(!context || !context.player || !card || card.location !== Locations.PlayArea) {
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
            if(event.card.location === Locations.PlayArea) {
                event.card.parent.removeAttachment(event.card);
            } else {
                event.card.controller.removeCardFromPile(event.card);
                event.card.new = true;
                event.card.moveTo(Locations.PlayArea);
            }
            event.parent.attachments.push(event.card);
            event.card.parent = event.parent;
            if(event.card.controller !== context.player) {
                event.card.controller = context.player;
                for(let effect of event.card.abilities.persistentEffects) {
                    if(effect.ref) {
                        for(let e of effect.ref) {
                            e.refreshContext();
                        }
                    }
                }
            }
        });
    }
}

module.exports = AttachAction;
