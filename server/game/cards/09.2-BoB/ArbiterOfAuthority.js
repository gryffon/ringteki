const DrawCard = require('../../drawcard.js');
const { DuelTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class ArbiterOfAuthority extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Initiate a political duel',
            initiateDuel: {
                type: DuelTypes.Political,
                refuseGameAction: AbilityDsl.actions.dishonor(context => ({ target: context.target })),
                gameAction: duel => AbilityDsl.actions.multiple([
                    AbilityDsl.actions.bow({ target: duel.loser }),
                    AbilityDsl.actions.sendHome({ target: duel.loser })
                ])
            }
        });
    }
}

ArbiterOfAuthority.id = 'arbiter-of-authority';

module.exports = ArbiterOfAuthority;
