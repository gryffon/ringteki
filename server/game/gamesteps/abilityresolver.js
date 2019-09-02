const _ = require('underscore');

const BaseStepWithPipeline = require('./basestepwithpipeline.js');
const SimpleStep = require('./simplestep.js');
const InitiateCardAbilityEvent = require('../Events/InitiateCardAbilityEvent');
const InitiateAbilityEventWindow = require('../Events/InitiateAbilityEventWindow');
const { Locations, Stages, CardTypes, EventNames, PlayTypes } = require('../Constants');

class AbilityResolver extends BaseStepWithPipeline {
    constructor(game, context) {
        super(game);

        this.context = context;
        this.canCancel = true;
        this.initiateAbility = false;
        this.events = [];
        this.provincesToRefill = [];
        this.targetResults = {};
        this.initialise();
    }

    initialise() {
        this.pipeline.initialise([
            new SimpleStep(this.game, () => this.createSnapshot()),
            new SimpleStep(this.game, () => this.resolveEarlyTargets()),
            new SimpleStep(this.game, () => this.checkForCancel()),
            new SimpleStep(this.game, () => this.openInitiateAbilityEventWindow()),
            new SimpleStep(this.game, () => this.refillProvinces())
        ]);
    }

    createSnapshot() {
        if([CardTypes.Character, CardTypes.Holding, CardTypes.Attachment].includes(this.context.source.getType())) {
            this.context.cardStateWhenInitiated = this.context.source.createSnapshot();
        }
    }

    openInitiateAbilityEventWindow() {
        if(this.cancelled) {
            return;
        }
        let eventName = EventNames.Unnamed;
        let eventProps = {};
        if(this.context.ability.isCardAbility()) {
            eventName = EventNames.OnCardAbilityInitiated;
            eventProps = {
                card: this.context.source,
                ability: this.context.ability,
                context: this.context
            };
            if(this.context.ability.isCardPlayed()) {
                this.events.push(this.game.getEvent(EventNames.OnCardPlayed, {
                    player: this.context.player,
                    card: this.context.source,
                    context: this.context,
                    originalLocation: this.context.source.location,
                    playType: PlayTypes.PlayFromHand,
                    resolver: this
                }));
            }
            if(this.context.ability.isTriggeredAbility()) {
                this.events.push(this.game.getEvent(EventNames.OnCardAbilityTriggered, {
                    player: this.context.player,
                    card: this.context.source,
                    context: this.context
                }));
            }
        }
        this.events.push(this.game.getEvent(eventName, eventProps, () => this.queueInitiateAbilitySteps()));
        this.game.queueStep(new InitiateAbilityEventWindow(this.game, this.events));
    }

    queueInitiateAbilitySteps() {
        this.queueStep(new SimpleStep(this.game, () => this.resolveCosts()));
        this.queueStep(new SimpleStep(this.game, () => this.payCosts()));
        this.queueStep(new SimpleStep(this.game, () => this.checkCostsWerePaid()));
        this.queueStep(new SimpleStep(this.game, () => this.resolveTargets()));
        this.queueStep(new SimpleStep(this.game, () => this.checkForCancel()));
        this.queueStep(new SimpleStep(this.game, () => this.initiateAbilityEffects()));
        this.queueStep(new SimpleStep(this.game, () => this.executeHandler()));
        this.queueStep(new SimpleStep(this.game, () => this.moveEventCardToDiscard()));
    }

    resolveEarlyTargets() {
        this.context.stage = Stages.PreTarget;
        if(!this.context.ability.cannotTargetFirst) {
            this.targetResults = this.context.ability.resolveTargets(this.context);
        }
    }

    checkForCancel() {
        if(this.cancelled) {
            return;
        }

        this.cancelled = this.targetResults.cancelled;
    }

    resolveCosts() {
        if(this.cancelled) {
            return;
        }
        this.canPayResults = {
            cancelled: false,
            canCancel: this.canCancel
        };
        this.costEvents = [];
        this.context.stage = Stages.Cost;
        this.context.ability.resolveCosts(this.costEvents, this.context, this.canPayResults);
    }

    payCosts() {
        if(this.cancelled) {
            return;
        } else if(this.canPayResults.cancelled) {
            this.cancelled = true;
            return;
        }
        if(this.costEvents.length > 0) {
            this.game.openEventWindow(this.costEvents);
        }
    }

    checkCostsWerePaid() {
        if(this.cancelled) {
            return;
        }
        this.cancelled = _.any(this.costEvents, event => event.getResolutionEvent().cancelled);
        if(this.cancelled) {
            this.game.addMessage('{0} attempted to use {1}, but did not successfully pay the required costs', this.context.player, this.context.source);
        }
    }

    resolveTargets() {
        if(this.cancelled) {
            return;
        }
        this.context.stage = Stages.Target;

        if(!this.context.ability.hasLegalTargets(this.context)) {
            // Ability cannot resolve, so display a message and cancel it
            this.game.addMessage('{0} attempted to use {1}, but there are insufficient legal targets', this.context.player, this.context.source);
            this.cancelled = true;
        } else if(this.targetResults.delayTargeting) {
            // Targeting was delayed due to an opponent needing to choose targets (which shouldn't happen until costs have been paid), so continue
            this.targetResults = this.context.ability.resolveRemainingTargets(this.context, this.targetResults.delayTargeting);
        } else if(this.targetResults.payCostsFirst || !this.context.ability.checkAllTargets(this.context)) {
            // Targeting was stopped by the player choosing to pay costs first, or one of the chosen targets is no longer legal. Retarget from scratch
            this.targetResults = this.context.ability.resolveTargets(this.context);
        }
    }

    initiateAbilityEffects() {
        if(this.cancelled) {
            for(const event of this.events) {
                event.cancel();
            }
            return;
        }

        // Increment limits (limits aren't used up on cards in hand)
        if(this.context.ability.limit && this.context.source.location !== Locations.Hand &&
           (!this.context.cardStateWhenInitiated || this.context.cardStateWhenInitiated.location === this.context.source.location)) {
            this.context.ability.limit.increment(this.context.player);
        }
        if(this.context.ability.max) {
            this.context.player.incrementAbilityMax(this.context.ability.maxIdentifier);
        }
        this.context.ability.displayMessage(this.context);

        if(this.context.ability.isTriggeredAbility()) {
            // If this is an event, move it to 'being played', and queue a step to send it to the discard pile after it resolves
            if(this.context.ability.isCardPlayed()) {
                this.game.actions.moveCard({ destination: Locations.BeingPlayed }).resolve(this.context.source, this.context);
            }
            this.game.openEventWindow(new InitiateCardAbilityEvent({ card: this.context.source, context: this.context }, () => this.initiateAbility = true));
        } else {
            this.initiateAbility = true;
        }
    }

    executeHandler() {
        if(this.cancelled || !this.initiateAbility) {
            return;
        }
        this.context.stage = Stages.Effect;
        this.context.ability.executeHandler(this.context);
    }

    moveEventCardToDiscard() {
        if(this.context.source.location === Locations.BeingPlayed) {
            this.context.player.moveCard(this.context.source, Locations.ConflictDiscardPile);
        }
    }

    refillProvinces() {
        this.context.refill();
    }
}

module.exports = AbilityResolver;
