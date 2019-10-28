const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl');
const PlayCharacterAction = require('../../playcharacteraction');
const PlayDisguisedCharacterAction = require('../../PlayDisguisedCharacterAction.js');
const { CardTypes, Locations, PlayTypes } = require('../../Constants');

class GatewayToMeidoPlayAction extends PlayCharacterAction {
    constructor(card) {
        super(card, true);
    }

    createContext(player = this.card.controller) {
        const context = super.createContext(player);
        context.playType = PlayTypes.PlayFromHand;
        return context;
    }

    meetsRequirements(context, ignoredRequirements = []) {
        let newIgnoredRequirements = ignoredRequirements.includes('location') ? ignoredRequirements : ignoredRequirements.concat('location');
        return super.meetsRequirements(context, newIgnoredRequirements);
    }
}
class GatewayToMeidoPlayDisguisedAction extends PlayDisguisedCharacterAction {
    constructor(card) {
        super(card, true);
    }

    createContext(player = this.card.controller) {
        const context = super.createContext(player);
        context.playType = PlayTypes.PlayFromHand;
        return context;
    }

    meetsRequirements(context, ignoredRequirements = []) {
        let newIgnoredRequirements = ignoredRequirements.includes('location') ? ignoredRequirements : ignoredRequirements.concat('location');
        return super.meetsRequirements(context, newIgnoredRequirements);
    }
}


class GatewayToMeido extends ProvinceCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isConflictProvince(),
            targetLocation: Locations.DynastyDiscardPile,
            match: card => card.type === CardTypes.Character,
            effect: [
                AbilityDsl.effects.gainPlayAction(GatewayToMeidoPlayAction),
                AbilityDsl.effects.gainPlayAction(GatewayToMeidoPlayDisguisedAction)
            ]
        });
    }

    cannotBeStrongholdProvince() {
        return true;
    }
}

GatewayToMeido.id = 'gateway-to-meido';

module.exports = GatewayToMeido;
