const AbilityContext = require('./AbilityContext.js');
const BaseAbility = require('./baseability.js');

class ThenAbility extends BaseAbility {
    constructor(game, card, properties) {
        super(properties);

        this.game = game;
        this.card = card;
        this.properties = properties;
        this.handler = properties.handler || this.executeGameActions;
        this.cannotTargetFirst = true;
    }

    createContext(player = this.card.controller) {
        return new AbilityContext({
            ability: this,
            game: this.game,
            player: player,
            source: this.card
        });
    }

    displayMessage(context) {
        if(this.properties.message) {
            let messageArgs = [context.player, context.source, context.target];
            if(this.properties.messageArgs) {
                messageArgs = messageArgs.concat(this.properties.messageArgs);
            }
            this.game.addMessage(this.properties.message, messageArgs);
        }
    }

    getGameActions(context) {
        // if there are any targets, look for gameActions attached to them
        let actions = this.targets.reduce((array, target) => array.concat(target.getGameAction(context)), []);
        // look for a gameAction on the ability itself, on an attachment execute that action on its parent, otherwise on the card itself
        return actions.concat(this.properties.gameAction.filter(action => action.hasLegalTarget(context)));
    }

    executeHandler(context) {
        for(const effectType of ['untilEndOfConflict', 'untilEndOfPhase', 'untilEndOfTurn', 'delayedEffect', 'lastingEffect']) {
            if(this.properties[effectType]) {
                let properties = this.properties[effectType];
                if(typeof properties === 'function') {
                    properties = properties(context);
                }
                /// TODO This doesn't work, maybe it works now?
                context.source[effectType](() => properties);
            }
        }

        this.handler(context);
    }

    executeGameActions(context) {
        // Get any gameActions for this ability
        let actions = this.getGameActions();
        for(const action of actions) {
            action.preEventHandler(context);
        }
        // Get their events, and execute simultaneously
        let events = actions.reduce((array, action) => array.concat(action.getEventArray()), []);
        let then = this.properties.then;
        if(then && typeof then === 'function') {
            then = then(context);
        }
        if(events.length > 0) {
            let window = this.game.openEventWindow(events);
            if(then) {
                window.addThenAbility(events, new ThenAbility(this.game, this.card, then));
            }
        } else if(then) {
            this.game.resolveAbility(new ThenAbility(this.game, this.card, then).createContext(context.player));
        }
    }
}

module.exports = ThenAbility;
