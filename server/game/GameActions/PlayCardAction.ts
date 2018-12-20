import AbilityContext = require('../AbilityContext');
import AbilityResolver = require('../gamesteps/abilityresolver');
import DrawCard = require('../drawcard');
import Event = require('../Events/Event');
import { CardGameAction, CardActionProperties } from './CardGameAction';
import { Locations, EventNames }  from '../Constants';

class PlayCardResolver extends AbilityResolver {
    playGameAction: PlayCardAction;
    gameActionContext: AbilityContext;
    cancelPressed: boolean;
    constructor(game, context, playGameAction, gameActionContext) {
        super(game, context);
        this.playGameAction = playGameAction;
        this.gameActionContext = gameActionContext;
        this.cancelPressed = false;
    }

    payCosts() {
        if(this.cancelled || this.canPayResults.cancelled) {
            let properties = this.playGameAction.getProperties(this.gameActionContext);
            if(properties.resetOnCancel) {
                this.playGameAction.cancelAction(this.gameActionContext);
                this.cancelPressed = true;
            }
        }
        super.payCosts();
    }

    initiateAbility() {
        super.initiateAbility();
        if(!this.cancelPressed) {
            let properties = this.playGameAction.getProperties(this.gameActionContext);
            this.game.queueSimpleStep(() => properties.postHandler(this.context.source));
        }
    }
}

export interface PlayCardProperties extends CardActionProperties {
    resetOnCancel?: boolean;
    postHandler?: (card: DrawCard) => void;
    location?: Locations;
}

export class PlayCardAction extends CardGameAction {
    name = 'playCard';
    effect = 'play {0} as if it were in their hand';
    defaultProperties: PlayCardProperties = {
        resetOnCancel: false,
        postHandler: () => true,
        location: Locations.Hand
    };
    constructor(properties: ((context: AbilityContext) => PlayCardProperties) | PlayCardProperties) {
        super(properties);
    }

    getProperties(context: AbilityContext): PlayCardProperties {
        return super.getProperties(context) as PlayCardProperties;
    }

    canAffect(card: DrawCard, context: AbilityContext): boolean {
        let properties = this.getProperties(context);
        if(!super.canAffect(card, context)) {
            return false;
        }
        let actions = card.getActions(context.player, properties.location);
        return this.getLegalActions(actions, context).length > 0;
    }

    getLegalActions(actions, context) {
        // filter actions to exclude actions which involve this game action, or which are not legal
        return actions.filter(action => {
            let gameActions = action.targets.reduce((array, target) => array.concat(target.properties.gameAction), action.gameAction);
            let newContext = action.createContext(context.player);
            return !gameActions.includes(this) && !action.meetsRequirements(newContext, ['location', 'player']);
        });
    }

    cancelAction(context) {
        context.ability.executeHandler(context);
    }

    addEventsToArray(events: any[], context: AbilityContext): void {
        let properties = this.getProperties(context);
        if((properties.target as DrawCard[]).length === 0) {
            return;
        }
        let card = properties.target[0];
        let actions = this.getLegalActions(card.getActions(context.player, properties.location), context);
        if(actions.length === 1) {
            events.push(this.getPlayCardEvent(card, context, actions[0].createContext(context.player)));
            return;
        }
        context.game.promptWithHandlerMenu(context.player, {
            source: card,
            choices: actions.map(action => action.title).concat(properties.resetOnCancel ? 'Cancel' : []),
            handlers: actions.map(action => () => events.push(this.getPlayCardEvent(card, context, action.createContext(context.player)))).concat(() => this.cancelAction(context))
        });
    }

    getPlayCardEvent(card: DrawCard, context: AbilityContext, actionContext: AbilityContext): Event {
        return super.createEvent(EventNames.Unnamed, { card: card, context: context }, () => {
            context.game.queueStep(new PlayCardResolver(context.game, actionContext, this, context));
        });        
    }
}
