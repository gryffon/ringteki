const _ = require('underscore');

const BaseStepWithPipeline = require('./basestepwithpipeline.js');
const SimpleStep = require('./simplestep.js');

class AbilityResolver extends BaseStepWithPipeline {
    constructor(game, context) {
        super(game);

        this.context = context;
        this.pipeline.initialise([
            new SimpleStep(game, () => this.createSnapshot()),
            new SimpleStep(game, () => this.resolveEarlyTargets()),
            new SimpleStep(game, () => this.waitForTargetResolution()),
            new SimpleStep(game, () => this.resolveCosts()),
            new SimpleStep(game, () => this.waitForCostResolution()),
            new SimpleStep(game, () => this.payCosts()),
            new SimpleStep(game, () => this.checkCostsWerePaid()),
            new SimpleStep(game, () => this.resolveTargets()),
            new SimpleStep(game, () => this.waitForTargetResolution()),
            new SimpleStep(game, () => this.initiateAbility())
        ]);
    }

    createSnapshot() {
        if(['character', 'holding', 'attachment'].includes(this.context.source.getType())) {
            this.context.cardStateWhenInitiated = this.context.source.createSnapshot();
        }
    }

    resolveCosts() {
        if(this.cancelled) {
            return;
        }
        this.context.stage = 'costs';
        this.canPayResults = this.context.ability.resolveCosts(this.context);
    }

    waitForCostResolution() {
        if(this.cancelled) {
            return;
        }
        this.cancelled = _.any(this.canPayResults, result => result.resolved && !result.value);

        if(!_.all(this.canPayResults, result => result.resolved)) {
            return false;
        }
    }

    payCosts() {
        if(this.cancelled) {
            return;
        }
        this.costEvents = this.context.ability.payCosts(this.context);
        if(this.costEvents.length > 0) {
            this.game.openEventWindow(this.costEvents);
        }
    }

    checkCostsWerePaid() {
        if(this.cancelled) {
            return;
        }
        this.cancelled = _.any(this.costEvents, event => {
            let result = event.getResult();
            return !result.resolved || result.cancelled;
        });

        if(this.cancelled) {
            this.game.addMessage('{0} attempted to use {1}, but did not successfully pay the required costs', this.context.player, this.context.source);
        }
    }

    resolveEarlyTargets() {
        if(this.cancelled) {
            return;
        }
        this.context.stage = 'pretarget';
        if(this.context.ability.cannotTargetFirst) {
            this.targetResults = _.map(this.context.ability.targets, (props, name) => {
                return { resolved: false, name: name, value: null, costsFirst: true, mode: props.mode };
            });
        } else {
            this.targetResults = this.context.ability.resolveTargets(this.context);
        }
    }

    resolveTargets() {
        if(this.cancelled) {
            return;
        }
        this.context.stage = 'target';
        this.targetResults = this.context.ability.resolveTargets(this.context, this.targetResults);
    }

    waitForTargetResolution() {
        if(this.cancelled) {
            return;
        }

        this.cancelled = _.any(this.targetResults, result => result.resolved && !result.value);
        if(this.cancelled && this.context.stage !== 'pretarget') {
            this.game.addMessage('{0} attempted to use {1}, but targets were not successfully chosen', this.context.player, this.context.source);
            return;
        }

        if(!_.all(this.targetResults, result => result.resolved || (this.context.stage === 'pretarget' && result.costsFirst))) {
            return false;
        }

        _.each(this.targetResults, result => {
            if(result.name === 'target') {
                if(result.mode === 'ring') {
                    this.context.ring = this.context.rings.target;
                } else if(result.mode === 'select' && this.context.selects.target) {
                    this.context.select = this.context.selects.target.choice;
                } else {
                    this.context.target = this.context.targets.target;
                }
            }
        });
    }

    initiateAbility() {
        if(this.cancelled) {
            return;
        }

        // Increment limits (limits aren't used up on cards in hand)
        if(this.context.ability.limit && this.context.source.location !== 'hand' &&
           (!this.context.cardStateWhenInitiated || this.context.cardStateWhenInitiated.location === this.context.source.location)) {
            this.context.ability.limit.increment(this.context.player);
        }
        if(this.context.ability.max) {
            this.context.player.incrementAbilityMax(this.context.ability.maxIdentifier);
        }

        this.context.ability.displayMessage(this.context);

        // If this is a card ability, raise an initiateAbilityEvent
        if(this.context.ability.isCardAbility()) {
            // If this is an event, move it to 'being played', and queue a step to send it to the discard pile after it resolves
            if(this.context.source.type === 'event') {
                this.context.player.moveCard(this.context.source, 'being played');
                this.game.raiseInitiateAbilityEvent({ card: this.context.source, context: this.context }, () => this.executeCardAbilityHandler());
                this.game.queueSimpleStep(() => this.context.player.moveCard(this.context.source, 'conflict discard pile'));
            } else {
                this.game.raiseInitiateAbilityEvent({ card: this.context.source, context: this.context }, () => this.executeCardAbilityHandler());
            }
        } else {
            this.executeHandler();
        }
    }

    executeCardAbilityHandler() {
        // create an event window for the handler to add events to
        this.game.raiseEvent('onAbilityResolved', { card: this.context.source, context: this.context }, () => {
            this.context.stage = 'effect';
            this.context.ability.executeHandler(this.context);
        });

    }

    executeHandler() {
        this.context.stage = 'effect';
        this.context.ability.executeHandler(this.context);
    }
}

module.exports = AbilityResolver;
