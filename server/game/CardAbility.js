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
        this.max = properties.max;
        this.location = this.buildLocation(card, properties.location);
        this.printedAbility = properties.printedAbility === false ? false : true;
        this.cannotBeCopied = properties.cannotBeCopied;
        this.cannotBeCancelled = properties.cannotBeCancelled;
        this.cannotTargetFirst = !!properties.cannotTargetFirst;
        this.doesNotTarget = properties.doesNotTarget;
        this.methods = properties.methods || [];
        this.handler = properties.handler;

        if(card.getType() === 'event') {
            this.cost.push(Costs.playEvent());
        }

        this.cost.push(Costs.useLimit());

        this.limit.registerEvents(game);
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
}

module.exports = CardAbility;
