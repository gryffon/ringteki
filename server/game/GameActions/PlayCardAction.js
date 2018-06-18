const CardGameAction = require('./CardGameAction');
const AbilityResolver = require('../gamesteps/abilityresolver');

class PlayCardResolver extends AbilityResolver {
    constructor(game, context, playGameAction, gameActionContext) {
        super(game, context);
        this.playGameAction = playGameAction;
        this.gameActionContext = gameActionContext;
        this.cancelPressed = false;
    }

    payCosts() {
        if((this.cancelled || this.canPayResults.cancelled) && this.playGameAction.resetOnCancel) {
            this.playGameAction.preEventHandler(this.gameActionContext);
            this.game.queueSimpleStep(() => {
                this.game.openThenEventWindow(this.playGameAction.getEventArray(this.gameActionContext));
            });
            this.cancelPressed = true;
        }
        super.resolveCosts();
    }

    initiateAbility() {
        super.initiateAbility();
        if(!this.cancelPressed) {
            this.game.queueSimpleStep(() => this.playGameAction.postHandler(this.context.source));
        }
    }
}

class PlayCardAction extends CardGameAction {
    setDefaultProperties() {
        this.resetOnCancel = false;
        this.postHandler = () => true;
        this.location = 'hand';
    }

    setup() {
        this.name = 'play';
        this.targetType = ['character', 'attachment', 'event'];
        this.effectMsg = 'play {0} as if it were in their hand';
    }

    defaultTargets() {
        return [];
    }

    canAffect(card, context) {
        let actions = card.getActions(context.player, this.location);
        if(actions.length === 0) {
            return false;
        }
        let reason = actions[0].meetsRequirements();
        if(reason && reason !== 'location') {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        let playContext = card.getActions(context.player, this.location)[0].createContext(context.player);
        return super.createEvent('unnamedEvent', { card: card, context: context }, () => {
            context.game.queueStep(new PlayCardResolver(context.game, playContext, this, context));
        });
    }
}

module.exports = PlayCardAction;
