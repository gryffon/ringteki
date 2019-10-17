const ProvinceCard = require('../../provincecard.js');
const { Players } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class ConflictBetweenKin extends ProvinceCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isConflictProvince(),
            targetController: Players.Opponent,
            match: card => card.isParticipating(),
            effect: [
                AbilityDsl.effects.cardCannot({
                    cannot: 'target',
                    restricts: 'eventsWithSameClan'
                }),
                AbilityDsl.effects.cardCannot({
                    cannot: 'target',
                    restricts: 'attachmentsWithSameClan'
                })
            ]
        });
    }
}

ConflictBetweenKin.id = 'conflict-between-kin';

module.exports = ConflictBetweenKin;
