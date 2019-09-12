const BaseAction = require('./BaseAction');
const Costs = require('./costs.js');
const GameActions = require('./GameActions/GameActions');
const { EffectNames, Phases, PlayTypes, EventNames } = require('./Constants');

class PlayCharacterAction extends BaseAction {
    constructor(card, intoConflictOnly = false) {
        super(card, [
            Costs.chooseFate(PlayTypes.PlayFromHand),
            Costs.payReduceableFateCost(PlayTypes.PlayFromHand),
            Costs.playLimited()
        ]);
        this.intoConflictOnly = intoConflictOnly;
        this.title = 'Play this character';
    }

    meetsRequirements(context = this.createContext(), ignoredRequirements = []) {
        if(!ignoredRequirements.includes('phase') && context.game.currentPhase === Phases.Dynasty) {
            return 'phase';
        }
        if(!ignoredRequirements.includes('location') && !context.player.isCardInPlayableLocation(context.source, PlayTypes.PlayFromHand)) {
            return 'location';
        }
        if(!ignoredRequirements.includes('cannotTrigger') && !context.source.canPlay(context, PlayTypes.PlayFromHand)) {
            return 'cannotTrigger';
        }
        if(context.source.anotherUniqueInPlay(context.player)) {
            return 'unique';
        }
        if(!context.player.checkRestrictions('playCharacter', context)) {
            return 'restriction';
        }
        return super.meetsRequirements(context);
    }

    executeHandler(context) {
        const extraFate = context.source.sumEffects(EffectNames.GainExtraFateWhenPlayed);
        let cardPlayedEvent = context.game.getEvent(EventNames.OnCardPlayed, {
            player: context.player,
            card: context.source,
            context: context,
            originalLocation: context.source.location,
            playType: PlayTypes.PlayFromHand
        });
        let putIntoPlayHandler = () => {
            context.game.addMessage('{0} plays {1} at home with {2} additional fate', context.player, context.source, context.chooseFate);
            context.game.openEventWindow([GameActions.putIntoPlay({ fate: context.chooseFate + extraFate }).getEvent(context.source, context), cardPlayedEvent]);
        };
        let putIntoConflictHandler = () => {
            context.game.addMessage('{0} plays {1} into the conflict with {2} additional fate', context.player, context.source, context.chooseFate);
            context.game.openEventWindow([GameActions.putIntoConflict({ fate: context.chooseFate }).getEvent(context.source, context), cardPlayedEvent]);
        };
        if(context.source.allowGameAction('putIntoConflict', context)) {
            if(this.intoConflictOnly) {
                putIntoConflictHandler();
            } else {
                context.game.promptWithHandlerMenu(context.player, {
                    activePromptTitle: 'Where do you wish to play this character?',
                    source: context.source,
                    choices: ['Conflict', 'Home'],
                    handlers: [
                        putIntoConflictHandler,
                        putIntoPlayHandler
                    ]
                });
            }
        } else {
            putIntoPlayHandler();
        }
    }

    isCardPlayed() {
        return true;
    }
}

module.exports = PlayCharacterAction;

