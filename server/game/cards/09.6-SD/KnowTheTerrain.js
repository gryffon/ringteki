const DrawCard = require('../../drawcard.js');
const { CardTypes, AbilityTypes, Players, Locations } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class KnowTheTerrain extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            title: 'Switch the attacked province with a facedown province',
            when: {
                onConflictDeclaredBeforeReveal: (event, context) => event.conflict.conflictProvince.facedown && context.player.isDefendingPlayer()
                    // event.conflict.conflictProvince.controller === Players.Self &&
                    // event.conflict.conflictProvince.location !== Locations.StrongholdProvince
            },
            target: {
                activePromptTitle: 'Choose an unbroken province',
                cardType: CardTypes.Province,
                location: Locations.Provinces,
                controller: Players.Self,
                targets: false,
                cardCondition: card => card.location !== Locations.StrongholdProvince && !card.isBroken && card.facedown && card !== this.game.currentConflict.conflictProvince
            },
            handler: context => {
                let attackedprovince = this.game.currentConflict.conflictProvince;
                let attackedProvinceLocation = attackedprovince.location;
                let chosenProvince = context.target;
                let chosenLocation = context.target.location;

                //Switch the provinces
                attackedprovince.location = chosenLocation;
                chosenProvince.location = attackedProvinceLocation;
                chosenProvince.inConflict = true;
                this.game.currentConflict.conflictProvince.inConflict = false;
                this.game.currentConflict.conflictProvince = chosenProvince;
            },
            effect: 'switch the attacked province card'
        })
    }
}

KnowTheTerrain.id = 'know-the-terrain';

module.exports = KnowTheTerrain;
