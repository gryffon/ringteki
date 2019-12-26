const restrictedList = {
    version: '9',
    cards: [
        'kuroi-mori',
        'secret-cache',
        'rebuild',
        'mirumoto-s-fury',
        'forged-edict',
        'spyglass',
        'embrace-the-void',
        'pathfinder-s-blade',
        'policy-debate',
        'the-imperial-palace',
        'consumed-by-five-fires',
        'cunning-magistrate',
        'a-fate-worse-than-death',
        'void-fist',
        'mark-of-shame',
        'magistrate-station',
        'kakita-toshimoko',
        'gateway-to-meido'
    ]
};

class RestrictedList {
    validate(cards) {
        let cardsOnRestrictedList = cards.filter(card => restrictedList.cards.includes(card.id));

        let errors = [];

        if(cardsOnRestrictedList.length > 1) {
            errors.push(`Contains more than 1 card on the FAQ v${restrictedList.version} restricted list: ${cardsOnRestrictedList.map(card => card.name).join(', ')}`);
        }

        return {
            version: restrictedList.version,
            valid: errors.length === 0,
            errors: errors,
            restrictedCards: cardsOnRestrictedList
        };
    }
}

module.exports = RestrictedList;
