const _ = require('underscore');

const CardAbility = require('./CardAbility.js');
const TriggeredAbilityContext = require('./TriggeredAbilityContext.js');

class TriggeredAbility extends CardAbility {
    constructor(game, card, abilityType, properties) {
        super(game, card, properties);
        this.when = properties.when;
        this.abilityType = abilityType;
    }

    eventHandler(event, window) {
        let context = this.createContext(event);
        if(this.isTriggeredByEvent(event, context) && this.meetsRequirements(context) === '') {
            if(this.isInValidLocation(context)) {
                window.addChoice(context);
            }
        }
    }

    createContext(event) {
        let context = new TriggeredAbilityContext({ 
            event: event, 
            game: this.game, 
            source: this.card, 
            player: this.card.controller, 
            ability: this 
        });
        this.initialiseGameActions(context);
        return context;
    }

    isTriggeredByEvent(event, context) {
        let listener = this.when[event.name];

        return listener && listener(event, context);
    }

    registerEvents() {
        if(this.events) {
            return;
        }

        var eventNames = _.keys(this.when);

        this.events = [];
        _.each(eventNames, eventName => {
            var event = {
                name: eventName + ':' + this.abilityType,
                handler: (event, window) => this.eventHandler(event, window)
            };
            this.game.on(event.name, event.handler);
            this.events.push(event);
        });
    }

    unregisterEvents() {
        if(this.events) {
            _.each(this.events, event => {
                this.game.removeListener(event.name, event.handler);
            });
            this.events = null;
        }
    }
}

module.exports = TriggeredAbility;
