const AbilityContext = require('./AbilityContext.js');
const AbilityLimit = require('./abilitylimit.js');
const BaseAbility = require('./baseability.js');
const Costs = require('./costs.js');

class CardAbility extends BaseAbility {
    constructor(game, card, properties) {
        super(properties);

        this.game = game;
        this.card = card;
        this.properties = properties;
        this.title = properties.title;
        this.limit = properties.limit || AbilityLimit.perRound(1);
        this.limit.registerEvents(game);
        this.location = this.buildLocation(card, properties.location);
        this.printedAbility = properties.printedAbility === false ? false : true;
        this.cannotBeCopied = properties.cannotBeCopied;
        this.cannotBeCancelled = properties.cannotBeCancelled;
        this.cannotTargetFirst = !!properties.cannotTargetFirst;
        this.doesNotTarget = properties.doesNotTarget;
        this.methods = properties.methods || [];
        this.max = properties.max;
        this.abilityIdentifier = properties.abilityIdentifier;
        if(!this.abilityIdentifier) {
            this.abilityIdentifier = this.printedAbility ? this.card.id + '1' : '';
        }
        this.maxIdentifier = this.card.name + this.abilityIdentifier;

        if(this.max) {
            this.card.owner.registerAbilityMax(this.maxIdentifier, this.max);
        }

        if(card.getType() === 'event') {
            this.cost = this.cost.concat(Costs.payReduceableFateCost('play'), Costs.canPlayEvent(), Costs.playLimited());
        }

    }

    buildLocation(card, location) {
        const DefaultLocationForType = {
            event: 'hand',
            holding: 'province',
            province: 'province',
            role: 'role',
            stronghold: 'stronghold province'
        };

        let defaultedLocation = location || DefaultLocationForType[card.getType()] || 'play area';

        if(!Array.isArray(defaultedLocation)) {
            defaultedLocation = [defaultedLocation];
        }

        if(defaultedLocation.some(location => location === 'province')) {
            defaultedLocation = defaultedLocation.filter(location => location !== 'province');
            defaultedLocation = defaultedLocation.concat(['province 1', 'province 2', 'province 3', 'province 4', 'stronghold province']);
        }

        return defaultedLocation;
    }

    createContext(player = this.card.controller) {
        return new AbilityContext({
            ability: this,
            game: this.game,
            player: player,
            source: this.card
        });
    }

    meetsRequirements(context) {
        if(this.card.isBlank() && this.printedAbility) {
            return 'blank';
        }

        if(!this.card.canTriggerAbilities()) {
            return 'cannotTrigger';
        }

        if(this.limit.isAtMax(context.player)) {
            return 'limit';
        }

        if(this.max && context.player.isAbilityAtMax(this.maxIdentifier)) {
            return 'max';
        }

        return super.meetsRequirements(context);
    }

    isInValidLocation(context) {
        return this.card.type === 'event' ? context.player.isCardInPlayableLocation(context.source, 'play') : this.location.includes(this.card.location);
    }

    displayMessage(context) {
        let messageArgs = [];
        // Player1 plays Assassination
        messageArgs.push(this.game.gameChat.formatMessage('{0} {1} {2}', context.player, context.source.type === 'event' ? 'plays' : 'uses', context.source));
        let costMessages = this.cost.map(cost => {
            if(cost.action && cost.action.cost) {
                return this.game.gameChat.formatMessage(cost.action.cost, context.cost[cost.action.name]);
            }
        }).filter(obj => obj);
        if(costMessages.length > 0) {
            // , 
            messageArgs.push(', ');
            // paying 3 honor
            messageArgs.push(costMessages);
        } else {
            messageArgs = messageArgs.concat('','');
        }
        let effectMessage = this.properties.effect;
        let effectArgs = [this.getDefaultTargetForGameAction(context)];
        if(!effectMessage) {
            let gameActions = this.getGameActions(context);
            if(gameActions.length > 0) {
                // effects with multiple game messages really need their own effect message
                effectMessage = gameActions[0].effect;
                if(gameActions[0].effectItems) {
                    effectArgs.concat(gameActions[0].effectItems(context));
                }
            }
        } else if(this.properties.effectItems) {
            effectArgs = effectArgs.concat(this.properties.effectItems(context));
        }

        if(effectMessage) {
            // to 
            messageArgs.push(' to ');
            // discard Stoic Gunso
            messageArgs.push(this.game.gameChat.formatMessage(effectMessage, effectArgs));
        }
        this.game.addMessage('{0}{1}{2}{3}{4}', messageArgs);
    }

    getGameActions(context) {
        if(this.targets.length > 0) {
            // if there are any targets, look for gameActions attached to them
            return this.targets.reduce((array, target) => array.concat(target.getGameAction(context)), []);
        } else if(this.properties.gameAction) {
            // look for a gameAction on the ability itself, on an attachment execute that action on its parent, otherwise on the card itself
            let gameAction = this.properties.gameAction;
            if(typeof gameAction === 'function') {
                gameAction = gameAction(context);
            }
            if(gameAction.setTarget(this.getDefaultTargetForGameAction(context))) {
                return [gameAction];
            }
        }
        return [];
    }

    getDefaultTargetForGameAction(context) {
        if(context.target) {
            return context.target;
        } else if(context.ring) {
            return context.ring;
        } else if(context.source.parent) {
            return context.source.parent;
        }
        return context.source;
    }

    executeHandler(context) {
        for(const effectType of ['untilEndOfConflict', 'untilEndOfPhase', 'untilEndOfTurn']) {
            if(this.properties[effectType]) {
                let properties = Object.assign({}, { match: this.getDefaultTargetForGameAction(context) }, this.properties[effectType]);
                context.source[effectType](properties);
            }
        }

        if(this.properties.handler) {
            // if there's a handler, execute that
            this.properties.handler(context);
        } else {
            // Otherwise get any gameActions for this ability, get their events, and execute simultaneously
            this.game.openEventWindow(this.getGameActions().reduce((array, action) => array.concat(action.getEventArray()), []));
        } 
    }

    isCardPlayed() {
        return this.card.getType() === 'event';
    }

    isCardAbility() {
        return true;
    }

    isTriggeredAbility() {
        return true;
    }
}

module.exports = CardAbility;
