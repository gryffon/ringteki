const AbilityContext = require('./AbilityContext.js');
const AbilityLimit = require('./abilitylimit.js');
const BaseAbility = require('./baseability.js');
const Costs = require('./costs.js');

class CardAbility extends BaseAbility {
    constructor(game, card, properties) {
        super(properties);

        this.game = game;
        this.card = card;
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
        this.handler = properties.handler;
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

    executeHandler(context) {
        this.handler(context);
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
