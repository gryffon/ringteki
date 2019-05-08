const BaseAction = require('./baseaction');
const ReduceableFateCost = require('./costs/ReduceableFateCost');

const Costs = require('./costs');
const { CardTypes, EventNames, Phases, Players, PlayTypes } = require ('./Constants');

const ChooseDisguisedCharacterCost = function() {
    return {
        canPay: context => context.source.disguisedKeywordTraits.some(trait =>
            context.player.cardsInPlay.some(card => card.hasTrait(trait))),
        resolve: context => context.game.promptForSelect(context.player, {
            activePromptTitle: 'Choose a character to replace',
            cardType: CardTypes.Character,
            controller: Players.Self,
            cardCondition: card => context.source.disguisedKeywordTraits.some(trait => card.hasTrait(trait)),
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
    canPay(context) {
        const maxCharacterCost = Math.max(context.player.cardsInPlay.map(card =>
            context.source.disguisedKeywordTraits.some(trait => card.hasTrait(trait) ? card.getCost() : 0)));
        const minCost = Math.max(context.player.getMinimumCost(this.playingType, context) - maxCharacterCost, 0);
        return context.player.fate >= minCost &&
            (minCost === 0 || context.player.checkRestrictions('spendFate', context));
    }
}

class PlayDisguisedCharacterAction extends BaseAction {
    constructor(card) {
        const playType = card.isDynasty ? PlayTypes.PlayFromProvince : PlayTypes.PlayFromHand;
        super(card, [
            ChooseDisguisedCharacterCost(),
            new DisguisedReduceableFateCost(playType),
            Costs.playLimited()
        ]);
        this.playType = playType;
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
        const events = [context.game.getEvent(EventNames.OnCardPlayed, {
            player: context.player,
            card: context.source,
            context: context,
            originalLocation: context.source.location,
            playType: this.playType
        })];
        const replacedCharacter = context.costs.chooseDisguisedCharacter;
        let playIntoConflict = false;
        if(replacedCharacter.inConflict) {
            context.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Where do you wish to play this character?',
                source: context.source,
                choices: ['Conflict', 'Home'],
                handlers: [
                    () => playIntoConflict = true,
                    () => true
                ]
            });
        }
        context.game.queueSimpleStep(() => {
            context.game.addMessage('{0} plays {1}{2} using Disguised, choosing to replace {3}', context.player, context.source, playIntoConflict ? ' into the conflict' : '', replacedCharacter);
            const gameAction = playIntoConflict ? context.game.actions.putintoConflict() : context.game.actions.putIntoPlay();
            events.push(gameAction.getEvent(context.source, context));
            events.push(context.game.getEvent(EventNames.Unnamed, {}, () => {
                const moveEvents = [];
                context.game.actions.placeFate({ target: context.source, origin: replacedCharacter, amount: replacedCharacter.fate }).addEventsToArray(moveEvents, context);
                for(const attachment of replacedCharacter.attachments.toArray()) {
                    context.game.actions.attach({ target: context.source, attachment: attachment }).addEventsToArray(moveEvents, context);
                }
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
