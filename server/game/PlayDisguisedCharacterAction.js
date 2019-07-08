const BaseAction = require('./BaseAction.js');
const ReduceableFateCost = require('./costs/ReduceableFateCost');

const Costs = require('./costs');
const { CardTypes, EventNames, Phases, Players, PlayTypes, EffectNames } = require ('./Constants');

const ChooseDisguisedCharacterCost = function(intoConflictOnly) {
    return {
        canPay: context => context.source.disguisedKeywordTraits.some(trait =>
            context.player.cardsInPlay.some(card =>
                card.hasTrait(trait) &&
                card.allowGameAction('discardFromPlay', context) &&
                !card.isUnique() &&
                (!intoConflictOnly || card.isParticipating())
            )),
        resolve: context => context.game.promptForSelect(context.player, {
            activePromptTitle: 'Choose a character to replace',
            cardType: CardTypes.Character,
            controller: Players.Self,
            cardCondition: card =>
                context.source.disguisedKeywordTraits.some(trait => card.hasTrait(trait)) &&
                card.allowGameAction('discardFromPlay', context) &&
                !card.isUnique() &&
                (!intoConflictOnly || card.isParticipating()),
            context: context,
            onSelect: (player, card) => {
                context.costs.chooseDisguisedCharacter = card;
                return true;
            }
        }),
        pay: () => true
    };
};

class DisguisedReduceableFateCost extends ReduceableFateCost {
    constructor(playingType, intoConflictOnly) {
        super(playingType);
        this.intoConflictOnly = intoConflictOnly;
    }

    canPay(context) {
        const maxCharacterCost = Math.max(...context.player.cardsInPlay.map(card =>
            context.source.disguisedKeywordTraits.some(trait => card.hasTrait(trait)) &&
            (!this.intoConflictOnly || card.isParticipating()) && !card.isUnique() ? card.getCost() : 0
        ));
        const minCost = Math.max(context.player.getMinimumCost(this.playingType, context) - maxCharacterCost, 0);
        return context.player.fate >= minCost &&
            (minCost === 0 || context.player.checkRestrictions('spendFate', context));
    }

    getReducedCost(context) {
        if(!context.costs.chooseDisguisedCharacter) {
            return;
        }
        return Math.max(super.getReducedCost(context) - context.costs.chooseDisguisedCharacter.getCost(), 0);
    }
}

class PlayDisguisedCharacterAction extends BaseAction {
    constructor(card, playType = card.isDynasty ? PlayTypes.PlayFromProvince : PlayTypes.PlayFromHand, intoConflictOnly = false) {
        super(card, [
            ChooseDisguisedCharacterCost(intoConflictOnly),
            new DisguisedReduceableFateCost(playType, intoConflictOnly),
            Costs.playLimited()
        ]);
        this.playType = playType;
        this.intoConflictOnly = intoConflictOnly;
        this.title = 'Play this character with Disguise';
    }

    meetsRequirements(context = this.createContext(), ignoredRequirements = []) {
        if(!ignoredRequirements.includes('phase') && context.game.currentPhase !== Phases.Conflict) {
            return 'phase';
        } else if(!ignoredRequirements.includes('location') && !context.player.isCardInPlayableLocation(context.source, this.playType)) {
            return 'location';
        } else if(!ignoredRequirements.includes('cannotTrigger') && !context.source.canPlay(context, this.playType)) {
            return 'cannotTrigger';
        } else if(context.source.anotherUniqueInPlay(context.player)) {
            return 'unique';
        }
        return super.meetsRequirements(context);
    }

    executeHandler(context) {
        const extraFate = context.source.sumEffects(EffectNames.GainExtraFateWhenPlayed);
        const events = [context.game.getEvent(EventNames.OnCardPlayed, {
            player: context.player,
            card: context.source,
            context: context,
            originalLocation: context.source.location,
            playType: this.playType
        })];
        const replacedCharacter = context.costs.chooseDisguisedCharacter;
        if(!replacedCharacter) {
            return;
        }
        let intoConflict = this.intoConflictOnly;
        if(replacedCharacter.inConflict && !this.intoConflictOnly) {
            context.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Where do you wish to play this character?',
                source: context.source,
                choices: ['Conflict', 'Home'],
                handlers: [
                    () => intoConflict = true,
                    () => true
                ]
            });
        }
        context.game.queueSimpleStep(() => {
            context.game.addMessage('{0} plays {1}{2} using Disguised, choosing to replace {3}', context.player, context.source, intoConflict ? ' into the conflict' : '', replacedCharacter);
            const gameAction = intoConflict ? context.game.actions.putIntoConflict({ target: context.source, fate: extraFate }) : context.game.actions.putIntoPlay({ target: context.source, fate: extraFate });
            gameAction.addEventsToArray(events, context);
            events.push(context.game.getEvent(EventNames.Unnamed, {}, () => {
                const moveEvents = [];
                context.game.actions.placeFate({ target: context.source, origin: replacedCharacter, amount: replacedCharacter.fate }).addEventsToArray(moveEvents, context);
                for(const attachment of replacedCharacter.attachments.toArray()) {
                    context.game.actions.attach({ target: context.source, attachment: attachment }).addEventsToArray(moveEvents, context);
                }
                context.game.actions.moveStatusToken({ target: replacedCharacter.personalHonor, recipient: context.source }).addEventsToArray(moveEvents, context);
                moveEvents.push(context.game.getEvent(EventNames.Unnamed, {}, () =>
                    context.game.openThenEventWindow(context.game.actions.discardFromPlay({ cannotBeCancelled: true }).getEvent(replacedCharacter, context))));
                context.game.openThenEventWindow(moveEvents);
            }));
            context.game.openThenEventWindow(events);
        });
    }

    isCardPlayed() {
        return true;
    }

    isCardAbility() {
        return true;
    }
}

module.exports = PlayDisguisedCharacterAction;
