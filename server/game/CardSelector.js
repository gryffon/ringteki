const ExactlyXCardSelector = require('./CardSelectors/ExactlyXCardSelector');
const MaxStatCardSelector = require('./CardSelectors/MaxStatCardSelector');
const SingleCardSelector = require('./CardSelectors/SingleCardSelector');
const UnlimitedCardSelector = require('./CardSelectors/UnlimitedCardSelector');
const UpToXCardSelector = require('./CardSelectors/UpToXCardSelector');

const { TargetModes, CardTypes } = require('./Constants');

const defaultProperties = {
    numCards: 1,
    cardCondition: () => true,
    cardType: [CardTypes.Attachment, CardTypes.Character, CardTypes.Event, CardTypes.Holding, CardTypes.Stronghold, CardTypes.Role, CardTypes.Province],
    multiSelect: false
};

const ModeToSelector = {
    ability: p => new SingleCardSelector(p),
    autoSingle: p => new SingleCardSelector(p),
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
        if(properties.mode) {
            return properties;
        }

        if(properties.maxStat) {
            properties.mode = TargetModes.MaxStat;
        } else if(properties.numCards === 1 && !properties.multiSelect) {
            properties.mode = TargetModes.Single;
        } else if(properties.numCards === 0) {
            properties.mode = TargetModes.Unlimited;
        } else {
            properties.mode = TargetModes.UpTo;
        }

        return properties;
    }
}

module.exports = CardSelector;
