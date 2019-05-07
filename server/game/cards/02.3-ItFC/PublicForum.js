const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl');

class PublicForum extends ProvinceCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Prevent break and add Honor token',
            when: {
                onBreakProvince: (event, context) => event.card === context.source && !event.card.hasToken('honor')
            },
            effect: 'add an honor token to {0} instead of breaking it',
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.cancel(),
                AbilityDsl.actions.addToken(context => ({ target: context.source }))
            ])
        });
    }

    cannotBeStrongholdProvince() {
        return true;
    }
}

PublicForum.id = 'public-forum';

module.exports = PublicForum;
