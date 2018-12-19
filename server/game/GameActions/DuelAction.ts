import { CardGameAction, CardActionProperties} from './CardGameAction';
import { CardTypes, Locations, EventNames } from '../Constants';
import AbilityContext = require('../AbilityContext');
import DrawCard = require('../drawcard');
import Event = require('../Events/Event');
import Duel = require('../Duel');
import DuelFlow = require('../gamesteps/DuelFlow');

export interface DuelProperties extends CardActionProperties {
    type: string;
    challenger: DrawCard;
    resolutionHandler: (winner: DrawCard, loser: DrawCard) => void,
    costHandler?: (context: AbilityContext, prompt: any) => void
}

export class DuelAction extends CardGameAction {
    name = 'duel';
    targetType = [CardTypes.Character];

    defaultProperties: DuelProperties = {
        type: '',
        challenger: null,
        resolutionHandler: () => true
    };
    constructor(properties: DuelProperties | ((context: AbilityContext) => DuelProperties)) {
        super(properties);
    }

    getEffectMessage(context): [string, any[]] {
        let properties = this.getProperties(context) as DuelProperties;
        return ['initiate a ' + properties.type + ' duel between {1} and {0}', [properties.challenger]];
    }

    canAffect(card: DrawCard, context: AbilityContext): boolean {
        let properties = this.getProperties(context) as DuelProperties;
        if(!super.canAffect(card, context)) {
            return false;
        }
        return properties.challenger && !properties.challenger.hasDash(properties.type) && card.location === Locations.PlayArea && !card.hasDash(properties.type);
    }

    resolveDuel(winner: DrawCard, loser: DrawCard, context: AbilityContext): void {
        let properties = this.getProperties(context) as DuelProperties;
        properties.resolutionHandler(winner, loser);
    }

    honorCosts(prompt, context: AbilityContext): void {
        let properties = this.getProperties(context) as DuelProperties;
        properties.costHandler(context, prompt);
    }

    getEvent(card: DrawCard, context: AbilityContext): Event {
        let properties = this.getProperties(context) as DuelProperties;
        return super.createEvent(EventNames.Unnamed, { card, context }, event => {
            if(properties.challenger.location !== Locations.PlayArea || card.location !== Locations.PlayArea) {
                context.game.addMessage('The duel cannot proceed as one participant is no longer in play');
                return;
            }
            context.game.currentDuel = new Duel(context.game, properties.challenger, card, properties.type);
            context.game.queueStep(new DuelFlow(
                context.game, 
                context.game.currentDuel, 
                properties.costHandler ? prompt => this.honorCosts(prompt, event.context) : null, 
                (winner, loser) => this.resolveDuel(winner, loser, event.context)
            ));
        });
    }
}

module.exports = DuelAction;
