const _ = require('underscore');

const EventWindow = require('./EventWindow.js');
const SimpleStep = require('../gamesteps/simplestep.js');

class ThenEventWindow extends EventWindow {
    initialise() {
        this.pipeline.initialise([
            new SimpleStep(this.game, () => this.setCurrentEventWindow()),
            new SimpleStep(this.game, () => this.checkEventCondition()),
            new SimpleStep(this.game, () => this.filterUnsuccessfulEvents()),
            new SimpleStep(this.game, () => this.openWindow('cancelinterrupt')),
            new SimpleStep(this.game, () => this.createContigentEvents()),
            new SimpleStep(this.game, () => this.openWindow('forcedinterrupt')),
            new SimpleStep(this.game, () => this.openWindow('interrupt')),
            new SimpleStep(this.game, () => this.checkForOtherEffects()),
            new SimpleStep(this.game, () => this.preResolutionEffects()),
            new SimpleStep(this.game, () => this.executeHandler()),
            new SimpleStep(this.game, () => this.checkGameState()),
            new SimpleStep(this.game, () => this.resetCurrentEventWindow())
        ]);
    }

    filterUnsuccessfulEvents() {
        this.events = _.reject(this.events, event => event.cancelled || (event.parentEvent && event.parentEvent.cancelled));
    }

    resetCurrentEventWindow() {
        _.each(this.events, event => {
            this.previousEventWindow.addEvent(event);
        });
        this.game.currentEventWindow = this.previousEventWindow;
    }
}

module.exports = ThenEventWindow;
