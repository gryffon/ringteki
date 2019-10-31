const restrictedList = {
    version: '9',
    cards: [
        'guest-of-honor',
        'young-rumormonger',
        'rebuild',
        'steward-of-law',
        'mirumoto-s-fury',
        'for-greater-glory',
        'forged-edict',
        'spyglass',
        'charge',
        'embrace-the-void',
        'pathfinder-s-blade',
        'policy-debate',
        'a-fate-worse-than-death',
        'isawa-tadaka',
        'secluded-shrine',
        'void-fist',
        'consumed-by-five-fires',
        'cunning-magistrate',
        'daidoji-uji',
        'miya-satoshi',
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
