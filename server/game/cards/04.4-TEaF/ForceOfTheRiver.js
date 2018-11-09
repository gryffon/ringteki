const DrawCard = require('../../drawcard.js');
const { Locations, CardTypes } = require('../../Constants');

class ForceOfTheRiver extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Create spirits from facedown dynasty cards',
            condition: () => this.game.isDuringConflict(),
            effect: 'summon {1}!',
            effectArgs: {
                id: 'spirit-of-the-river',
                label: 'Sprits of the River',
                name: 'Sprits of the River',
                facedown: false,
                type: CardTypes.Character
            },
            gameAction: ability.actions.createToken(context => ({
                target: [Locations.ProvinceOne, Locations.ProvinceTwo, Locations.ProvinceThree, Locations.ProvinceFour].map(
                    location => context.player.getDynastyCardInProvince(location)
                ).filter(card => card.facedown)
            }))
        });
    }

    canAttach(card, context) {
        if(!card.hasTrait('shugenja') || card.controller !== context.player) {
            return false;
        }
        return super.canAttach(card, context);
    }
}

ForceOfTheRiver.id = 'force-of-the-river';

module.exports = ForceOfTheRiver;
