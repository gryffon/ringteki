const ExactlyXCardSelector = require('./CardSelectors/ExactlyXCardSelector');
const MaxStatCardSelector = require('./CardSelectors/MaxStatCardSelector');
const SingleCardSelector = require('./CardSelectors/SingleCardSelector');
const UnlimitedCardSelector = require('./CardSelectors/UnlimitedCardSelector');
const UpToXCardSelector = require('./CardSelectors/UpToXCardSelector');

const defaultProperties = {
    numCards: 1,
    cardCondition: () => true,
    cardType: ['attachment', 'character', 'event', 'holding', 'stronghold', 'role', 'province'],
    gameAction: 'target',
    multiSelect: false
};

const ModeToSelector = {
    exactly: p => new ExactlyXCardSelector(p.numCards, p),
    maxStat: p => new MaxStatCardSelector(p),
    single: p => new SingleCardSelector(p),
    unlimited: p => new UnlimitedCardSelector(p),
    upTo: p => new UpToXCardSelector(p.numCards, p)
};

class CardSelector {
    static for(properties) {
        properties = CardSelector.getDefaultedProperties(properties);

        let factory = ModeToSelector[properties.mode];

        if(!factory) {
            throw new Error(`Unknown card selector mode of ${properties.mode}`);
        }

        return factory(properties);
    }

    static getDefaultedProperties(properties) {
        properties = Object.assign({}, defaultProperties, properties);
        properties.mode = CardSelector.getMode(properties);
        return properties;
    }

    static getMode(properties) {
        if(properties.mode) {
            return properties.mode;
        } else if(properties.maxStat) {
            return 'maxStat';
        } else if(properties.numCards === 1 && !properties.multiSelect) {
            return 'single';
        } else if(properties.numCards === 0) {
            return 'unlimited';
        }

        return 'upTo';
    }
}

module.exports = CardSelector;
