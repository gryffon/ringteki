const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl');
const { Players, CardTypes } = require('../../Constants');

class KikuMatsuri extends ProvinceCard {
    setupCardAbilities() {
        this.action({
            title: 'Honor a character home from each side',
            targets: {
                myCharacter: {
                    cardType: CardTypes.Character,
                    controller: Players.Self,
                    cardCondition: card => card.isParticipating(),
                    gameAction: AbilityDsl.actions.honor()
                },
                oppCharacter: {
                    cardType: CardTypes.Character,
                    controller: Players.Opponent,
                    cardCondition: card => card.isParticipating(),
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

