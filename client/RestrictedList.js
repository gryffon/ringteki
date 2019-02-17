const restrictedList = {
    version: '1.7',
    cards: [
        'guest-of-honor',
        'niten-master',
        'young-rumormonger',
        'rebuild',
        'mirumoto-s-fury',
        'for-greater-glory',
        'forged-edict',
        'charge',
        'pathfinder-s-blade',
        'feast-or-famine',
        'policy-debate',
        'a-fate-worse-than-death',
        'isawa-tadaka',
        'void-fist'
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
