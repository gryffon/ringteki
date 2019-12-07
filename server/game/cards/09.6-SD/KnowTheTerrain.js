const DrawCard = require('../../drawcard.js');
const { CardTypes, Players, Locations } = require('../../Constants');

class KnowTheTerrain extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            title: 'Switch the attacked province with a facedown province',
            when: {
                onConflictDeclaredBeforeReveal: (event, context) => event.conflict.conflictProvince.facedown && 
                    context.player.isDefendingPlayer() &&
                    event.conflict.conflictProvince.location !== Locations.StrongholdProvince
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
                let chosenProvince = context.target;
                context.player.switchProvinces(attackedprovince, chosenProvince);

                chosenProvince.inConflict = true;
                this.game.currentConflict.conflictProvince.inConflict = false;
                this.game.currentConflict.conflictProvince = chosenProvince;
            },
            effect: 'switch the attacked province card'
        });
    }
}

KnowTheTerrain.id = 'know-the-terrain';

module.exports = KnowTheTerrain;
