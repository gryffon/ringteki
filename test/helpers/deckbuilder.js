const _ = require('underscore');
const monk = require('monk');

const CardService = require('../../server/services/CardService.js');
const {matchCardByNameAndPack} = require('./cardutil.js');

const defaultFaction = 'phoenix';
const defaultStronghold = 'city-of-the-open-hand'
const defaultProvinces = ['shameful-display', 'shameful-display', 'shameful-display', 'shameful-display', 'shameful-display'];
const defaultDynasty = ['adept-of-the-waves','adept-of-the-waves','adept-of-the-waves','adept-of-the-waves','adept-of-the-waves', 'adept-of-the-waves', 'adept-of-the-waves'];
const defaultConflict = ['a-legion-of-one', 'a-legion-of-one', 'a-legion-of-one', 'a-legion-of-one', 'a-legion-of-one', 'a-legion-of-one', 'a-legion-of-one'];

class DeckBuilder {
    constructor() {
        this.cards = {};
        this.loaded = false;
    }

    // Lazily loads the cards from the db
    async loadCards() {
        if(!this.load) {
            let db = monk('mongodb://127.0.0.1:27017/ringteki');
            let cardService = new CardService(db);
            this.load = cardService.getAllCards()
                .then((cards) => {
                    this.cards = {};
                    _.each(cards, card => {
                        this.cards[card.id] = card;
                    });
                    this.loaded = true;
                })
                .then(() => db.close())
                .catch(() => db.close());
        }
        return this.load;
    }

    /*
        options:
        - faction {String} faction for the deck
        - stronghold {String} id or name of the stronghold
        - provinces {String[]} list of ids or names of provinces to include
        - dynasty {String[]} list of ids or names of cards to put in the dynasty deck
        - conflict {String[]} list of ids or names of cards to put in the conflict deck
    */
    async customDeck(options = {}) {
        let faction = defaultFaction;
        let deck = [];
        if(options.faction) {
            faction = options.faction;
        }
        if(options.stronghold) {
            deck.push(options.stronghold);
        } else {
            deck.push(defaultStronghold);
        }
        /* Provinces, dynasty and conflict all need to be padded, so as to not
        break the game */
        if(options.provinces) {
            deck.push(...options.provinces);
            deck.push(...defaultProvinces.slice(options.provinces.length));
        } else {
            deck.push(...defaultProvinces);
        }
        if(options.dynasty) {
            deck.push(...options.dynasty);
            deck.push(...defaultDynasty.slice(options.dynasty.length));
        } else {
            deck.push(...defaultDynasty);
        }
        if(options.conflict) {
            deck.push(...options.conflict);
            deck.push(...defaultConflict.slice(options.conflict.length));
        } else {
            deck.push(...defaultConflict);
        }
        return this.buildDeck(faction, deck);
    }

    async buildDeck(faction, cardLabels) {
        await this.loadCards();
        var cardCounts = {};
        _.each(cardLabels, label => {
            var cardData = this.getCard(label);
            if(cardCounts[cardData.id]) {
                cardCounts[cardData.id].count++;
            } else {
                cardCounts[cardData.id] = {
                    count: 1,
                    card: cardData
                };
            }
        });

        return {
            faction: { value: faction },
            stronghold: _.filter(cardCounts, count => count.card.type === 'stronghold'),
            role: _.filter(cardCounts, count => count.card.type === 'role'),
            conflictCards: _.filter(cardCounts, count => count.card.side === 'conflict'),
            dynastyCards: _.filter(cardCounts, count => count.card.side === 'dynasty'),
            provinceCards: _.filter(cardCounts, count => count.card.type === 'province')
        };
    }

    getCard(idOrLabelOrName) {
        if(!this.loaded) {
            throw new Error('Cards have not finished loading from database');
        }
        if(this.cards[idOrLabelOrName]) {
            return this.cards[idOrLabelOrName];
        }

        var cardsByName = _.filter(this.cards, matchCardByNameAndPack(idOrLabelOrName));

        if(cardsByName.length === 0) {
            throw new Error(`Unable to find any card matching ${idOrLabelOrName}`);
        }

        if(cardsByName.length > 1) {
            var matchingLabels = _.map(cardsByName, card => `${card.name} (${card.pack_code})`).join('\n');
            throw new Error(`Multiple cards match the name ${idOrLabelOrName}. Use one of these instead:\n${matchingLabels}`);
        }

        return cardsByName[0];
    }
}

module.exports = DeckBuilder;
