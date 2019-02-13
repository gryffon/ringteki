import { CardGameAction, CardActionProperties} from './CardGameAction';
import { CardTypes, Locations, DuelTypes, EventNames } from '../Constants';
import AbilityContext = require('../AbilityContext');
import DrawCard = require('../drawcard');
import Duel = require('../Duel');
import DuelFlow = require('../gamesteps/DuelFlow');
import BaseCard = require('../basecard');

export interface DuelProperties extends CardActionProperties {
    type: DuelTypes;
    challenger?: DrawCard;
    resolutionHandler: (winner: DrawCard | DrawCard[], loser: DrawCard | DrawCard[]) => void,
    costHandler?: (context: AbilityContext, prompt: any) => void,
    statistic?: (card: DrawCard) => any
}

export class DuelAction extends CardGameAction {
    name = 'duel';
    eventName = EventNames.OnDuelInitiated;
    targetType = [CardTypes.Character];

    defaultProperties: DuelProperties = {
        type: undefined,
        resolutionHandler: () => true
    };

    constructor(properties: DuelProperties | ((context: AbilityContext) => DuelProperties)) {
        super(properties);
    }

    getProperties(context: AbilityContext, additionalProperties = {}): DuelProperties {
        let properties = super.getProperties(context, additionalProperties) as DuelProperties;
        if(!properties.challenger) {
            properties.challenger = context.source;
        }
        return properties;
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties = this.getProperties(context);
        if(properties.target instanceof Array) {
            let targets = properties.target as BaseCard[];
            let indices = [...Array(targets.length + 1).keys()].map(x => '{' + x++ + '}').slice(1);
            return ['initiate a ' + properties.type.toString() + ' duel : {0} vs. ' + indices.join(' and '), [properties.challenger, ...(properties.target as BaseCard[])]];
        }
        return ['initiate a ' + properties.type.toString() + ' duel : {0} vs. {1}', [properties.challenger, properties.target]];
    }

    canAffect(card: DrawCard, context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        if(!super.canAffect(card, context)) {
            return false;
        }
        return properties.challenger && !properties.challenger.hasDash(properties.type) && card.location === Locations.PlayArea && !card.hasDash(properties.type);
    }

    resolveDuel(winner: DrawCard | DrawCard[], loser: DrawCard | DrawCard[], context: AbilityContext, additionalProperties = {}): void {
        let properties = this.getProperties(context, additionalProperties);
        properties.resolutionHandler(winner, loser);
    }

    honorCosts(prompt, context: AbilityContext, additionalProperties = {}): void {
        let properties = this.getProperties(context, additionalProperties);
        properties.costHandler(context, prompt);
    }

    addEventsToArray(events: any[], context: AbilityContext, additionalProperties = {}): void {
        let { target } = this.getProperties(context, additionalProperties);
        let cards = (target as DrawCard[]).filter(card => this.canAffect(card, context));
        if(cards.length === 0) {
            return
        }
        let event = this.createEvent(null, context, additionalProperties);
        this.updateEvent(event, cards, context, additionalProperties);
        events.push(event);
    }

    addPropertiesToEvent(event, cards, context: AbilityContext, additionalProperties): void {
        if(!cards) {
            cards = this.getProperties(context, additionalProperties).target;
        }
        if(!Array.isArray(cards)) {
            cards = [cards];
        }
        event.cards = cards;
        event.context = context;
    }

    eventHandler(event, additionalProperties): void {
        let context = event.context;
        let cards = event.cards;
        let properties = this.getProperties(context, additionalProperties);
        if(properties.challenger.location !== Locations.PlayArea || cards.every(card => card.location !== Locations.PlayArea)) {
            context.game.addMessage('The duel cannot proceed as at least one participant for each side has to be in play');
            return;
        }
        context.game.currentDuel = new Duel(context.game, properties.challenger, cards, properties.type, properties.statistic);
        context.game.queueStep(new DuelFlow(
            context.game, 
            context.game.currentDuel, 
            properties.costHandler ? prompt => this.honorCosts(prompt, event.context, additionalProperties) : null, 
            (winner, loser) => this.resolveDuel(winner, loser, event.context, additionalProperties)
        ));
    }

    checkEventCondition(event, additionalProperties) {
        return event.cards.some(card => this.canAffect(card, event.context, additionalProperties));
    }
}
