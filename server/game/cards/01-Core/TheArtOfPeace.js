const ProvinceCard = require('../../provincecard.js');

class TheArtOfPeace extends ProvinceCard {
    setupCardAbilities() {
        this.interrupt({
            title: 'Honor all defenders and dishonor all attackers',
            when: {
                onBreakProvince: (event, context) => event.card === context.source && (
                    event.conflict.attackers.some(card => card.allowGameAction('dishonor', context)) || 
                    event.conflict.defenders.some(card => card.allowGameAction('honor', context))
                )
            },
            effect: 'dishonor all attackers and honor all defenders in this conflict',
            handler: context => this.game.applyGameAction(context, { honor: context.event.conflict.defenders, dishonor: context.event.conflict.attackers })
        });
    }
}

TheArtOfPeace.id = 'the-art-of-peace';

module.exports = TheArtOfPeace;
