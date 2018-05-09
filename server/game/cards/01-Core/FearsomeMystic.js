const DrawCard = require('../../drawcard.js');

class FearsomeMystic extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            condition: () => this.game.currentConflict && this.game.currentConflict.hasElement('air'),
            effect: ability.effects.modifyGlory(2)
        });
        this.action({
            title: 'Remove fate from characters',
            condition: context => context.source.isParticipating(),
            gameAction: ability.actions.removeFate().target(context => (
                this.game.currentConflict.getOpponentCards(context.player).filter(card => card.getGlory() < context.source.getGlory())
            ))
        });
    }
}

FearsomeMystic.id = 'fearsome-mystic';

module.exports = FearsomeMystic;
