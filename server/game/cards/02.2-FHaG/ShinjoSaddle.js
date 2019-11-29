const DrawCard = require('../../drawcard.js');
const { Players, CardTypes } = require('../../Constants');

class ShinjoSaddle extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentConditions({
            myControl: true,
            trait: 'cavalry'
        });

        this.action({
            title: 'Move to another character',
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                gameAction: ability.actions.attach(context => ({ attachment: context.source }))
            }
        });
    }
}

ShinjoSaddle.id = 'shinjo-saddle';

module.exports = ShinjoSaddle;
