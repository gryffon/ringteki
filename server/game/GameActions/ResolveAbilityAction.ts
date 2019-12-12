import TriggeredAbilityContext = require('../TriggeredAbilityContext');
import TriggeredAbility = require('../triggeredability');
import AbilityResolver = require('../gamesteps/abilityresolver');
import CardAbility = require('../CardAbility');
import Event = require('../Events/Event');
import DrawCard = require('../drawcard');
import Player = require('../player');
import SimpleStep = require('../gamesteps/simplestep');
import InitiateCardAbilityEvent = require('../Events/InitiateCardAbilityEvent');
import { CardGameAction, CardActionProperties } from './CardGameAction';
import { EventNames } from '../Constants';

class ResolveAbilityActionResolver extends AbilityResolver {
    ignoreCosts: boolean;

    constructor(game, context, ignoreCosts) {
        super(game, context);
        this.ignoreCosts = ignoreCosts;
    }

    initialise() {
        this.pipeline.initialise([
            new SimpleStep(this.game, () => this.createSnapshot()),
            new SimpleStep(this.game, () => this.openInitiateAbilityEventWindow()),
            new SimpleStep(this.game, () => this.refillProvinces())
        ]);
    }

    getCostResults() {
        const results = super.getCostResults();
        results.canCancel = false;
        results.playCosts = false;
        results.triggerCosts = false;
        return results;
    }

    openInitiateAbilityEventWindow() {
        const params = { card: this.context.source, ability: this.context.ability, context: this.context };
        const events = [this.game.getEvent(EventNames.OnCardAbilityInitiated, params, () => this.queueInitiateAbilitySteps())];
        if(this.context.ability.isTriggeredAbility() && !this.context.subResolution) {
            events.push(this.game.getEvent(EventNames.OnCardAbilityTriggered, {
                player: this.context.player,
                card: this.context.source,
                context: this.context
            }));
        }
        this.game.openEventWindow(events);
    }

    initiateAbilityEffects() {
        if(this.cancelled) {
            for(const event of this.events) {
                event.cancel();
            }
            return;
        } else if(this.context.ability.max && !this.context.subResolution) {
            this.context.player.incrementAbilityMax(this.context.ability.maxIdentifier);
        }
        this.context.ability.displayMessage(this.context, 'resolves');
        this.game.openEventWindow(new InitiateCardAbilityEvent({ card: this.context.source, context: this.context }, () => this.initiateAbility = true));
    }

    resolveCosts() {
        if(!this.ignoreCosts) {
            super.resolveCosts();
        }
    }

    payCosts() {
        if(!this.ignoreCosts) {
            super.payCosts();
        }
    }
}

export interface ResolveAbilityProperties extends CardActionProperties {
    ability: CardAbility;
    subResolution?: boolean;
    ignoredRequirements?: string[];
    player?: Player;
    event?: Event;
}

export class ResolveAbilityAction extends CardGameAction {
    name = 'resolveAbility';
    defaultProperties: ResolveAbilityProperties = {
        ability: null,
        ignoredRequirements: [],
        subResolution: false
    };
    constructor(properties: ((context: TriggeredAbilityContext) => ResolveAbilityProperties) | ResolveAbilityProperties) {
        super(properties);
    }

    getEffectMessage(context: TriggeredAbilityContext): [string, any[]] {
        let properties = this.getProperties(context) as ResolveAbilityProperties;
        return ['resolve {0}\'s {1} ability', [properties.target, properties.ability.title]];
    }

    canAffect(card: DrawCard, context: TriggeredAbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties) as ResolveAbilityProperties;
        let ability = properties.ability as TriggeredAbility;
        let player = properties.player || context.player;
        let newContextEvent = properties.event;
        if(!super.canAffect(card, context) || !ability || !properties.subResolution && player.isAbilityAtMax(ability.maxIdentifier)) {
            return false;
        }
        let newContext = ability.createContext(player, newContextEvent);
        let ignoredRequirements = properties.ignoredRequirements.concat('player', 'location', 'limit');
        return !ability.meetsRequirements(newContext, ignoredRequirements);
    }

    eventHandler(event, additionalProperties): void {
        let properties = this.getProperties(event.context, additionalProperties) as ResolveAbilityProperties;
        let player = properties.player || event.context.player;
        let newContextEvent = properties.event;
        let newContext = (properties.ability as TriggeredAbility).createContext(player, newContextEvent);
        newContext.subResolution = !!properties.subResolution;
        event.context.game.queueStep(new ResolveAbilityActionResolver(event.context.game, newContext, properties.ignoredRequirements.includes('cost')));
    }

    hasTargetsChosenByInitiatingPlayer(context) {
        let properties = this.getProperties(context) as ResolveAbilityProperties;
        return properties.ability.hasTargetsChosenByInitiatingPlayer(context);
    }
}
