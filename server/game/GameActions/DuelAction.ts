import { CardGameAction, CardActionProperties} from './CardGameAction';
import { CardTypes, Locations, DuelTypes } from '../Constants';
import AbilityContext = require('../AbilityContext');
import DrawCard = require('../drawcard');
import Duel = require('../Duel');
import DuelFlow = require('../gamesteps/DuelFlow');

export interface DuelProperties extends CardActionProperties {
    type: DuelTypes;
    challenger?: DrawCard;
    resolutionHandler: (winner: DrawCard, loser: DrawCard) => void,
    costHandler?: (context: AbilityContext, prompt: any) => void
}

export class DuelAction extends CardGameAction {
    name = 'duel';
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
        return ['initiate a ' + this.getTypeFriendlyName(properties.type) + ' duel between {1} and {0}', [properties.target, properties.challenger]];
    }

    getTypeFriendlyName(type: DuelTypes): string {
        if(type === DuelTypes.BaseMilitary) {
            return 'base skill military'
        }
        if(type === DuelTypes.BasePolitical) {
            return 'base skill political'
        }
        return type.toString();
    }

    canAffect(card: DrawCard, context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        if(!super.canAffect(card, context)) {
            return false;
        }
        return properties.challenger && !properties.challenger.hasDash(properties.type) && card.location === Locations.PlayArea && !card.hasDash(properties.type);
    }

    resolveDuel(winner: DrawCard, loser: DrawCard, context: AbilityContext, additionalProperties = {}): void {
        let properties = this.getProperties(context, additionalProperties);
        properties.resolutionHandler(winner, loser);
    }

    honorCosts(prompt, context: AbilityContext, additionalProperties = {}): void {
        let properties = this.getProperties(context, additionalProperties);
        properties.costHandler(context, prompt);
    }

    eventHandler(event, additionalProperties): void {
        let context = event.context;
        let card = event.card;
        let properties = this.getProperties(context, additionalProperties);
        if(properties.challenger.location !== Locations.PlayArea || card.location !== Locations.PlayArea) {
            context.game.addMessage('The duel cannot proceed as one participant is no longer in play');
            return;
        }
        context.game.currentDuel = new Duel(context.game, properties.challenger, card, properties.type);
        context.game.queueStep(new DuelFlow(
            context.game, 
            context.game.currentDuel, 
            properties.costHandler ? prompt => this.honorCosts(prompt, event.context, additionalProperties) : null, 
            (winner, loser) => this.resolveDuel(winner, loser, event.context, additionalProperties)
        ));
    }
}
