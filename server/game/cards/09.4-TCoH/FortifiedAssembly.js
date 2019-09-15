import { TokenTypes } from '../../Constants.js';
const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl');

class FortifiedAssembly extends ProvinceCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Place an honor token on this province',
            when: {
                onConflictDeclared: (event, context) => event.conflict.conflictProvince === context.source
            },
            gameAction: AbilityDsl.actions.addToken(),
            effect: 'put an honor token on {0}',
            effectArgs: context => context.source
        });
        this.persistentEffect({
            effect: AbilityDsl.effects.modifyProvinceStrength(() => this.getTokenCount(TokenTypes.Honor) * 2)
        });
    }

    cannotBeStrongholdProvince() {
        return true;
    }
}

FortifiedAssembly.id = 'fortified-assembly';

module.exports = FortifiedAssembly;
