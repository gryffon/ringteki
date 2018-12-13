const EventWindow = require('./EventWindow.js');
const { AbilityTypes } = require('../Constants');

class ThenEventWindow extends EventWindow {
    openWindow(abilityType) {
        if(abilityType !== AbilityTypes.ForcedReaction && abilityType !== AbilityTypes.Reaction) {
            super.openWindow(abilityType);
        }
    }

    resetCurrentEventWindow() {
        for(let event of this.events) {
            this.previousEventWindow.addEvent(event);
        }
        super.resetCurrentEventWindow();
    }
}

module.exports = ThenEventWindow;
