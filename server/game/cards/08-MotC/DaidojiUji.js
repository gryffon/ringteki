const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const PlayCharacterAction = require('../../playcharacteraction');
const { Locations, PlayTypes } = require('../../Constants');

class DaidojiUjiPlayAction extends PlayCharacterAction {
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

class DaidojiUji extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isHonored,
            targetLocation: Locations.Provinces,
            match: card => card.isDynasty && !card.facedown,
            effect: AbilityDsl.effects.gainPlayAction(DaidojiUjiPlayAction)
        });
    }
}

DaidojiUji.id = 'daidoji-uji';

module.exports = DaidojiUji;
