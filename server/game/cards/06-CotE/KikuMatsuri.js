const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl');

class KikuMatsuri extends ProvinceCard {
    setupCardAbilities() {
        this.action({
            title: 'Honor a character home from each side',
            targets: {
                myCharacter: {
                    cardCondition: (card, context) => card.isParticipating() && card.controller === context.player,
                    gameAction: AbilityDsl.actions.honor()
                },
                oppCharacter: {
                    cardCondition: (card, context) => card.isParticipating() && card.controller === context.player.opponent,
                    gameAction: AbilityDsl.actions.honor()
                }
            },
            effect: 'honor {1} and {2}',
            effectArgs: context => [context.targets.myCharacter, context.targets.oppCharacter]
        });
    }

}

KikuMatsuri.id = 'kiku-matsuri';

module.exports = KikuMatsuri;

