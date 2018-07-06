const fs = require('fs');
const path = require('path');
const _ = require('underscore');

const {matchCardByNameAndPack} = require('./cardutil.js');

const PathToSubModulePacks = path.join(__dirname, '../../fiveringsdb-data/json/Card');

const defaultFaction = 'phoenix';
const defaultRole = 'seeker-of-water';
const defaultStronghold = 'city-of-the-open-hand';
const minProvince = 5;
const provinceFiller = 'shameful-display';
const dynastyFiller = 'adept-of-the-waves';
const conflictFiller = 'supernatural-storm';
const dynastyBuffer = 8; // buffer decks to prevent re-shuffling
const conflictBuffer = 8; // buffer decks to prevent re-shuffling

class DeckBuilder {
    constructor() {
        this.cards = this.loadCards(PathToSubModulePacks);
        this.fillers = {
            faction: defaultFaction,
            role: defaultRole,
            stronghold: defaultStronghold,
            province: provinceFiller,
            dynasty: dynastyFiller,
            conflict: conflictFiller
        };
    }

    loadCards(directory) {
        var cards = {};

        var jsonCards = fs.readdirSync(directory).filter(file => file.endsWith('.json'));

        _.each(jsonCards, file => {
            var cardsInPack = require(path.join(PathToSubModulePacks, file));

            _.each(cardsInPack, card => {
                cards[card.id] = card;
            });
        });

        return cards;
    }

    /*
        options: as player1 and player2 are described in setupTest #1514
    */
    customDeck(player = {}) {
        let faction = defaultFaction;
        let role = defaultRole;
        let stronghold = defaultStronghold;
        let provinceDeck = [];
        let conflictDeck = [];
        let conflictDeckSize = conflictBuffer; 
        let dynastyDeck = [];
        let dynastyDeckSize = dynastyBuffer; 
        let inPlayCards = []; // Considered separately, because may consist of both dynasty and conflict

        if(player.faction) {
            faction = player.faction;
        }
        if(player.role) {
            role = player.role;
        }
        if(player.stronghold) {
            stronghold = player.stronghold;
        }
        //Create the province deck
        if(player.strongholdProvince) {
            provinceDeck.push(player.strongholdProvince);
        }
        if(player.provinces) {
            if(_.isArray(player.provinces)) {
                provinceDeck = provinceDeck.concat(player.provinces);
            } else {
                _.each(player.provinces, province => {
                    if(province.provinceCard) {
                        provinceDeck.push(province.provinceCard);
                    }
                });
            }
        }
        //Fill the deck up to minimum number of provinces
        while(provinceDeck.length < minProvince) {
            provinceDeck.push(provinceFiller);
        }
        /*
         * Create the dynasty deck - dynasty deck consists of cards in decks,
         * provinces and discard
         */
        let initialDynastySize = 0;
        if(player.dynastyDeckSize) {
            dynastyDeckSize = player.dynastyDeckSize;
        }
        if(player.dynastyDeck) {
            dynastyDeck.push(...player.dynastyDeck);
            initialDynastySize = player.dynastyDeck.length;
        }
        if(player.dynastyDiscard) {
            dynastyDeck.push(...player.dynastyDiscard);
        }
        _.each(player.provinces, province => {
            if(province.dynastyCards) {
                dynastyDeck.push(...province.dynastyCards);
            }
        });
        //Add cards to prevent reshuffling due to running out of cards
        for(let i = initialDynastySize; i < dynastyDeckSize; i++) {
            dynastyDeck.push(dynastyFiller);
        }
        /**
         * Create the conflict deck - conflict deck consists of cards in decks,
         * hand and discard
         */
        let initialConflictSize = 0;
        if(player.conflictDeckSize) {
            conflictDeckSize = player.conflictDeckSize;
        }
        if(player.conflictDeck) {
            conflictDeck.push(...player.conflictDeck);
            initialConflictSize = player.conflictDeck.length;
        }
        if(player.conflictDiscard) {
            conflictDeck.push(...player.conflictDiscard);
        }
        if(player.hand) {
            conflictDeck.push(...player.hand);
        }
        //Add cards to prevent reshuffling due to running out of cards
        for(let i = initialConflictSize; i < conflictDeckSize; i++) {
            conflictDeck.push(conflictFiller);
        }

        //Collect the names of cards in play
        _.each(player.inPlay, card => {
            if(_.isString(card)) {
                inPlayCards.push(card);
            } else {
                //Add the card itself
                inPlayCards.push(card.card);
                //Add any attachments
                if(card.attachments) {
                    inPlayCards.push(...card.attachments);
                }
            }
        });

        //Collect all the cards together
        var deck = provinceDeck.concat(conflictDeck)
            .concat(dynastyDeck).concat(inPlayCards)
            .concat(role).concat(stronghold);

        return this.buildDeck(faction, deck);
    }

    buildDeck(faction, cardLabels) {
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
