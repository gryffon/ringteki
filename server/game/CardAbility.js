const AbilityLimit = require('./abilitylimit.js');
const ThenAbility = require('./ThenAbility');
const Costs = require('./costs.js');

class CardAbility extends ThenAbility {
    constructor(game, card, properties) {
        super(game, card, properties);

        this.title = properties.title;
        this.limit = properties.limit || AbilityLimit.perRound(1);
        this.limit.registerEvents(game);
        this.location = this.buildLocation(card, properties.location);
        this.printedAbility = properties.printedAbility === false ? false : true;
        this.cannotBeCancelled = properties.cannotBeCancelled;
        this.cannotTargetFirst = !!properties.cannotTargetFirst;
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
            this.cost = this.cost.concat(Costs.payReduceableFateCost('play'), Costs.playLimited());
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

    meetsRequirements(context) {
        // If this ability applies a gameAction to context.source, we need to check that that is legal
        if(this.properties.gameAction && this.getGameActions(context).length === 0) {
            return 'condition';
        }

        if(this.card.isBlank() && this.printedAbility) {
            return 'blank';
        }

        if(!this.card.canTriggerAbilities() || this.card.type === 'event' && !this.card.canPlay(context)) {
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
        // Player1 plays Assassination
        let messageArgs = [context.player, context.source.type === 'event' ? ' plays ' : ' uses ', context.source];
        let costMessages = this.cost.map(cost => {
            if(cost.action && cost.action.cost) {
                console.log(this.game.gameChat.formatMessage(cost.action.cost, [context.costs[cost.action.name]]));
                return { message: this.game.gameChat.formatMessage(cost.action.cost, [context.costs[cost.action.name]]) };
            }
        }).filter(obj => obj);
        if(costMessages.length > 0) {
            // , 
            messageArgs.push(', ');
            // paying 3 honor
            messageArgs.push(costMessages);            
        } else {
            messageArgs = messageArgs.concat(['', '']);
        }
        let effectMessage = this.properties.effect;
        let effectArgs = [];
        if(!effectMessage) {
            let gameActions = this.getGameActions(context);
            if(gameActions.length > 0) {
                // effects with multiple game actions really need their own effect message
                effectMessage = gameActions[0].effect;
                effectArgs.push(gameActions[0].targets);
                if(gameActions[0].effectArgs) {
                    effectArgs.push(gameActions[0].effectArgs(context));
                }
            }
        } else {
            effectArgs.push(context.target || context.ring || context.source);
            if(this.properties.effectArgs) {
                effectArgs = effectArgs.concat(this.properties.effectArgs(context));
            }
        }

        if(effectMessage) {
            // to 
            messageArgs.push(' to ');
            // discard Stoic Gunso
            messageArgs.push({ message: this.game.gameChat.formatMessage(effectMessage, ...effectArgs) });
        }
        this.game.addMessage('{0}{1}{2}{3}{4}{5}{6}', ...messageArgs);
        
    }

    openEventWindow(events) {
        return this.game.openEventWindow(events);
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
