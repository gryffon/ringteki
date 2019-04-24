const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const PlayCharacterAction = require('../../playcharacteraction');
const { Locations, PlayTypes } = require('../../Constants');

class DaidojiUjiPlayAction extends PlayCharacterAction {
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

        this.persistentEffect({
            condition: context => context.source.isHonored,
            effect: AbilityDsl.effects.reduceCost({
                match: card => Locations.Provinces.includes(card.location),
                playingTypes: PlayTypes.PlayFromHand
            })
        });
    }
}

DaidojiUji.id = 'daidoji-uji';

module.exports = DaidojiUji;
