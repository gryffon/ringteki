import AbilityContext = require('../AbilityContext');
import AbilityResolver = require('../gamesteps/abilityresolver');
import DrawCard = require('../drawcard');
import Event = require('../Events/Event');
import { CardGameAction, CardActionProperties } from './CardGameAction';
import { Locations, PlayTypes }  from '../Constants';

class PlayCardResolver extends AbilityResolver {
    playGameAction: PlayCardAction;
    gameActionContext: AbilityContext;
    gameActionProperties: any;
    cancelPressed: boolean;
    constructor(game, context, playGameAction, gameActionContext, gameActionProperties) {
        super(game, context);
        this.playGameAction = playGameAction;
        this.gameActionContext = gameActionContext;
        this.gameActionProperties = gameActionProperties;
        this.cancelPressed = false;
    }

    checkForCancel() {
        super.checkForCancel();
        if(this.cancelled && this.gameActionProperties.resetOnCancel) {
            this.playGameAction.cancelAction(this.gameActionContext, this.gameActionProperties);
            this.cancelPressed = true;
        }
    }
    
    resolveCosts() {
        if(this.gameActionProperties.payCosts) {
            super.resolveCosts();
        }
    }

    payCosts() {
        if(this.gameActionProperties.payCosts) {
            super.payCosts();
        }
        if(this.cancelled && this.gameActionProperties.resetOnCancel) {
            this.playGameAction.cancelAction(this.gameActionContext, this.gameActionProperties);
            this.cancelPressed = true;
        }
    }

    moveEventCardToDiscard() {
        if(this.context.source.location === Locations.BeingPlayed) {
            const location = this.initiateAbility && this.gameActionProperties.destination || Locations.ConflictDiscardPile;
            if(location === Locations.RemovedFromGame) {
                this.game.addMessage('{0} is removed from the game by {1}\'s effect', this.context.source, this.gameActionContext.source);
            }
            if(location === Locations.ConflictDeck && this.gameActionProperties.destinationOptions.bottom) {
                this.game.addMessage('{0} is placed on the bottom of {1}\'s deck by {2}\'s effect', this.context.source, this.context.player, this.gameActionContext.source);
            }
            this.context.player.moveCard(this.context.source, location, this.gameActionProperties.destinationOptions);
        }
    }

    refillProvinces() {
        super.refillProvinces();
        if(!this.cancelPressed) {
            this.game.queueSimpleStep(() => this.gameActionProperties.postHandler(this.context));
        }
    }
}

export interface PlayCardProperties extends CardActionProperties {
    resetOnCancel?: boolean;
    postHandler?: (context: AbilityContext) => void;
    playType?: PlayTypes;
    destination?: Locations;
    destinationOptions?: object;
    payCosts?: boolean;
}

export class PlayCardAction extends CardGameAction {
    name = 'playCard';
    effect = 'play {0} as if it were in their hand';
    defaultProperties: PlayCardProperties = {
        resetOnCancel: false,
        postHandler: () => true,
        destinationOptions: {},
        payCosts: true
    };
    constructor(properties: ((context: AbilityContext) => PlayCardProperties) | PlayCardProperties) {
        super(properties);
    }

    getProperties(context: AbilityContext, additionalProperties = {}): PlayCardProperties {
        return super.getProperties(context, additionalProperties) as PlayCardProperties;
    }

    canAffect(card: DrawCard, context: AbilityContext, additionalProperties = {}): boolean {
        if(!super.canAffect(card, context)) {
            return false;
        }
        const properties = this.getProperties(context, additionalProperties);
        const actions = card.getPlayActions();
        return this.getLegalActions(actions, context, properties).length > 0;
    }

    getLegalActions(actions: any[], context: AbilityContext, properties: PlayCardProperties) {
        // filter actions to exclude actions which involve this game action, or which are not legal
        return actions.filter(action => {
            const ignoredRequirements = ['location', 'player'];
            if(!properties.payCosts) {
                ignoredRequirements.push('cost');
            }
            let newContext = action.createContext(context.player);
            newContext.gameActionsResolutionChain = context.gameActionsResolutionChain.concat(this);
            if(properties.playType) {
                newContext.playType = properties.playType;
            }
            return !action.meetsRequirements(newContext, ignoredRequirements);
        });
    }


    cancelAction(context: AbilityContext, properties: PlayCardProperties): number {
        if(properties.parentAction) {
            properties.parentAction.resolve(null, context);
        }
        return 0;
    }

    addEventsToArray(events: any[], context: AbilityContext, additionalProperties = {}): void {
        let properties = this.getProperties(context, additionalProperties);
        if((properties.target as DrawCard[]).length === 0) {
            return;
        }
        let card = properties.target[0];
        let actions = this.getLegalActions(card.getPlayActions(), context, properties);
        if(actions.length === 1) {
            events.push(this.getPlayCardEvent(card, context, actions[0].createContext(context.player), additionalProperties));
            return;
        }
        context.game.promptWithHandlerMenu(context.player, {
            source: card,
            choices: actions.map(action => action.title).concat(properties.resetOnCancel ? 'Cancel' : []),
            handlers: actions.map(action => () => events.push(this.getPlayCardEvent(card, context, action.createContext(context.player), additionalProperties))).concat(() => this.cancelAction(context, properties))
        });
    }

    getPlayCardEvent(card: DrawCard, context: AbilityContext, actionContext: AbilityContext, additionalProperties): Event {
        let properties = this.getProperties(context, additionalProperties);
        let event = this.createEvent(card, context, additionalProperties);
        this.updateEvent(event, card, context, additionalProperties);
        if(properties.playType) {
            actionContext.playType = properties.playType;
        }
        event.replaceHandler(() => context.game.queueStep(new PlayCardResolver(context.game, actionContext, this, context, properties)));
        return event;    
    }

    checkEventCondition(): boolean {
        return true;
    }
}
