const _ = require('underscore');

const EventWindow = require('./EventWindow.js');
const SimpleStep = require('../gamesteps/simplestep.js');
const { Locations, PlayTypes, EventNames, AbilityTypes } = require('../Constants');

class InitiateAbilityEventWindow extends EventWindow {
    constructor(game, events) {
        super(game, events);
        _.each(this.events, event => {
            if(event.name === EventNames.OnCardAbilityInitiated) {
                this.initiateEvent = event;
            }
            if(event.context.ability.isCardPlayed() && !event.context.isResolveAbility) {
                this.addEvent(this.game.getEvent(EventNames.OnCardPlayed, {
                    player: event.context.player,
                    card: event.card,
                    originalLocation: Locations.Hand, // TODO: this isn't true with Kyuden Isawa
                    playType: PlayTypes.PlayFromHand
                }));
            }
            if(event.context.ability.isTriggeredAbility()) {
                this.addEvent(this.game.getEvent(EventNames.OnCardAbilityTriggered, { ability: event.context.ability, player: event.context.player, card: event.card }));
            }
        });
    }

    initialise() {
        this.pipeline.initialise([
            new SimpleStep(this.game, () => this.openWindow(AbilityTypes.WouldInterrupt)),
            new SimpleStep(this.game, () => this.checkForOtherEffects()),
            new SimpleStep(this.game, () => this.checkGameState()),
            new SimpleStep(this.game, () => this.openWindow(AbilityTypes.Reaction)), // Reactions to this event need to take place before the ability resolves
            new SimpleStep(this.game, () => this.executeHandler())
        ]);
    }

    executeHandler() {
        let event = this.initiateEvent;
        if(event.context.secondResolution) {
            super.executeHandler();
            return;
        }
        this.game.raiseEvent(EventNames.OnAbilityResolved, { card: event.context.source, context: event.context, initiateEvent: event }, () => {
            super.executeHandler();
        });
    }
}

module.exports = InitiateAbilityEventWindow;
