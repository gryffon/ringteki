const AbilityContext = require('./AbilityContext.js');
const BaseAbility = require('./baseability.js');
const { Stages } = require('./Constants.js');

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
            source: this.card,
            stage: Stages.PreTarget
        });
    }

    checkGameActionsForPotential(context) {
        if(super.checkGameActionsForPotential(context)) {
            return true;
        } else if(this.gameAction.every(gameAction => gameAction.isOptional(context)) && this.properties.then) {
            const then = typeof(this.properties.then) === 'function' ? this.properties.then(context) : this.properties.then;
            const thenAbility = new ThenAbility(this.game, this.card, then);
            return thenAbility.meetsRequirements(thenAbility.createContext(context.player)) === '';
        }
        return false;
    }

    displayMessage(context) {
        let message = this.properties.message;
        if(typeof message === 'function') {
            message = message(context);
        }
        if(message) {
            let messageArgs = [context.player, context.source, context.target];
            if(this.properties.messageArgs) {
                let args = this.properties.messageArgs;
                if(typeof args === 'function') {
                    args = args(context);
                }
                messageArgs = messageArgs.concat(args);
            }
            this.game.addMessage(message, ...messageArgs);
        }
    }

    getGameActions(context) {
        // if there are any targets, look for gameActions attached to them
        let actions = this.targets.reduce((array, target) => array.concat(target.getGameAction(context)), []);
        // look for a gameAction on the ability itself, on an attachment execute that action on its parent, otherwise on the card itself
        return actions.concat(this.gameAction);
    }

    executeHandler(context) {
        this.handler(context);
        this.game.queueSimpleStep(() => this.game.checkGameState());
    }

    executeGameActions(context) {
        context.events = [];
        let actions = this.getGameActions(context);
        let then = this.properties.then;
        if(then && typeof then === 'function') {
            then = then(context);
        }
        for(const action of actions) {
            this.game.queueSimpleStep(() => {
                action.addEventsToArray(context.events, context);
            });
        }
        this.game.queueSimpleStep(() => {
            let eventsToResolve = context.events.filter(event => !event.cancelled && !event.resolved);
            if(eventsToResolve.length > 0) {
                let window = this.openEventWindow(eventsToResolve);
                if(then) {
                    window.addThenAbility(new ThenAbility(this.game, this.card, then), context, then.thenCondition);
                }
            } else if(then && then.thenCondition && then.thenCondition(context)) {
                let thenAbility = new ThenAbility(this.game, this.card, then);
                this.game.resolveAbility(thenAbility.createContext(context.player));
            }
        });
    }

    openEventWindow(events) {
        return this.game.openThenEventWindow(events);
    }

    isCardAbility() {
        return true;
    }
}

module.exports = ThenAbility;
