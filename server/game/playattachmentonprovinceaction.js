const BaseAction = require('./BaseAction');
const Costs = require('./costs.js');
const GameActions = require('./GameActions/GameActions');
const { Phases, PlayTypes, EventNames, TargetModes } = require('./Constants');

class PlayAttachmentToProvinceAction extends BaseAction {
    constructor(card) {
        super(card, [Costs.payTargetDependentFateCost('target', PlayTypes.PlayFromHand)], {
            gameAction: GameActions.attachToProvince(context => ({ attachment: context.source })),
            provinceCondition: (province, context) => context.source.canPlayOn(province),
            mode: TargetModes.Single
        });
        this.title = 'Play this attachment';
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
        return super.meetsRequirements(context);
    }

    canResolveTargets() {
        return true;
    }

    displayMessage(context) {
        context.game.addMessage('{0} plays {1}, attaching it to {2}', context.player, context.source, context.ring);
    }

    executeHandler(context) {
        let cardPlayedEvent = context.game.getEvent(EventNames.OnCardPlayed, {
            player: context.player,
            card: context.source,
            context: context,
            originalLocation: context.source.location,
            playType: PlayTypes.PlayFromHand
        });
        context.game.openEventWindow([context.game.actions.attachToProvince({attachment: context.source}).getEvent(context.ring, context), cardPlayedEvent]);
    }

    isCardPlayed() {
        return true;
    }
}

module.exports = PlayAttachmentToProvinceAction;

