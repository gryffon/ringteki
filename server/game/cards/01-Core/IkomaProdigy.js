const DrawCard = require('../../drawcard.js');

class IkomaProdigy extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Gain 1 honor',
            when: {
                onCardEntersPlay: (event, context) => event.card === context.source && context.source.fate > 0,
                onCardMoveFate: (event, context) => event.recipient === context.source && event.fate > 0
            },
            message: '{0} uses {1} to gain 1 honor',
            handler: context => this.game.addHonor(context.player, 1)
        });
    }
}

IkomaProdigy.id = 'ikoma-prodigy';

module.exports = IkomaProdigy;
