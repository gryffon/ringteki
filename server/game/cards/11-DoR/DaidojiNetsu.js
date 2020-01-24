const DrawCard = require('../../drawcard.js');
const { Players, CardTypes, Phases } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class DaidojiNetsu extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: () => this.game.currentPhase === Phases.Conflict,
            targetController: Players.Any,
            match: (card, context) => card.getType() === CardTypes.Character && card !== context.source,
            effect: [
                AbilityDsl.effects.cardCannot({
                    cannot: 'leavePlay',
                    restricts: 'nonKeywordAbilities'})
            ]
        });
    }
}

DaidojiNetsu.id = 'daidoji-netsu';

module.exports = DaidojiNetsu;

