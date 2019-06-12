const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl');
const PlayCharacterAction = require('../../playcharacteraction');
const { CardTypes, Locations } = require('../../Constants');

class GatewayToMeidoPlayAction extends PlayCharacterAction {
    meetsRequirements(context, ignoredRequirements = []) {
        let newIgnoredRequirements = ignoredRequirements.includes('location') ? ignoredRequirements : ignoredRequirements.concat('location');
        return super.meetsRequirements(context, newIgnoredRequirements);
    }

    playIntoConflictOnly() {
        return true;
    }
}

class GatewayToMeido extends ProvinceCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isConflictProvince(),
            targetLocation: Locations.DynastyDiscardPile,
            match: card => card.type === CardTypes.Character,
            effect: AbilityDsl.effects.gainPlayAction(GatewayToMeidoPlayAction)
        });
    }

    cannotBeStrongholdProvince() {
        return true;
    }
}

GatewayToMeido.id = 'gateway-to-meido';

module.exports = GatewayToMeido;
