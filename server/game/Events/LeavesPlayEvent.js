const Event = require('./Event.js');
const MoveFateEvent = require('./MoveFateEvent.js');

class LeavesPlayEvent extends Event {
    constructor(params, card, gameAction) {
        super('onCardLeavesPlay', params);
        this.handler = this.leavesPlay;
        this.gameAction = gameAction;
        this.card = card;
        this.options = params.options || {};

        if(!this.destination) {
            this.destination = this.card.isDynasty ? 'dynasty discard pile' : 'conflict discard pile';
        }
    }

    createContingentEvents() {
        let contingentEvents = [];
        // Add an imminent triggering condition for all attachments leaving play
        if(this.card.attachments) {
            this.card.attachments.each(attachment => {
                // we only need to add events for attachments that are in play.
                if(attachment.location === 'play area') {
                    let destination = attachment.isDynasty ? 'dynasty discard pile' : 'conflict discard pile';
                    destination = attachment.isAncestral() ? 'hand' : destination;
                    let event = new LeavesPlayEvent({ destination: destination, isContingent: true }, attachment);
                    event.order = this.order - 1;
                    contingentEvents.push(event);
                }
            });
        }
        // Add an imminent triggering condition for removing fate
        if(this.card.fate > 0) {
            let fateEvent = new MoveFateEvent({}, this.card.fate, this.card);
            fateEvent.order = this.order - 1;
            contingentEvents.push(fateEvent);
        }
        return contingentEvents;
    }
    
    preResolutionEffect() {
        this.cardStateWhenLeftPlay = this.card.createSnapshot();
    }

    leavesPlay() {
        this.card.owner.moveCard(this.card, this.destination, this.options);
    }
}

module.exports = LeavesPlayEvent;
