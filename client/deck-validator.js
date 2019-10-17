const $ = require('jquery'); // eslint-disable-line no-unused-vars
const _ = require('underscore');
const moment = require('moment');

const RestrictedList = require('./RestrictedList');

const officialRoles = {
    crab: ['keeper-of-air', 'seeker-of-void'],
    crane: ['keeper-of-air', 'seeker-of-void'],
    dragon: ['seeker-of-air', 'keeper-of-water'],
    lion: ['seeker-of-earth', 'seeker-of-air'],
    phoenix: ['seeker-of-earth', 'seeker-of-void'],
    scorpion: ['keeper-of-earth', 'keeper-of-air'],
    unicorn: ['keeper-of-earth', 'keeper-of-water']
};

const openRoles = [
    'support-of-the-crane',
    'support-of-the-phoenix',
    'support-of-the-scorpion',
    'support-of-the-unicorn'
];

function getDeckCount(deck) {
    let count = 0;

    _.each(deck, function(card) {
        count += card.count;
    });

    return count;
}

function isCardInReleasedPack(packs, card) {
    let packsWithCard = _.compact(_.map(card.pack_cards, pack => _.find(packs, p => p.id === pack.pack.id)));

    if(packsWithCard.length === 0) {
        return false;
    }

    let releaseDates = _.compact(_.map(packsWithCard, pack => pack.available || pack.released_at));

    if(releaseDates.length === 0) {
        return false;
    }

    let now = moment();

    return _.any(releaseDates, date => moment(date, 'YYYY-MM-DD') <= now);
}

function rulesForKeeperRole(element) {
    return {
        influence: 3,
        roleRestrictions: ['keeper', element]
    };
}

function rulesForSeekerRole(element) {
    return {
        maxProvince: {[element]: 1},
        roleRestrictions: ['seeker', element]
    };
}

function rulesForSupportRole(faction) {
    return {
        influence: 8,
        roleRestrictions: ['support'],
        rules: [
            {
                message: 'Support roles can only be used with the match alliance clan',
                condition: deck => deck.alliance.value === faction
            }
        ]
    };
}

/**
 * Validation rule structure is as follows. All fields are optional.
 *
 * requiredDraw  - the minimum amount of cards required for the draw deck.
 * requiredPlots - the exact number of cards required for the plot deck.
 * maxDoubledPlots - the maximum amount of plot cards that can be contained twice in the plot deck.
 * mayInclude    - function that takes a card and returns true if it is allowed in the overall deck.
 * cannotInclude - function that takes a card and return true if it is not allowed in the overall deck.
 * rules         - an array of objects containing a `condition` function that takes a deck and return true if the deck is valid for that rule, and a `message` used for errors when invalid.
 */
const roleRules = {
    'keeper-of-air': rulesForKeeperRole('air'),
    'keeper-of-earth': rulesForKeeperRole('earth'),
    'keeper-of-fire': rulesForKeeperRole('fire'),
    'keeper-of-void': rulesForKeeperRole('void'),
    'keeper-of-water': rulesForKeeperRole('water'),
    'seeker-of-air': rulesForSeekerRole('air'),
    'seeker-of-earth': rulesForSeekerRole('earth'),
    'seeker-of-fire': rulesForSeekerRole('fire'),
    'seeker-of-void': rulesForSeekerRole('void'),
    'seeker-of-water': rulesForSeekerRole('water'),
    'support-of-the-crane': rulesForSupportRole('crane'),
    'support-of-the-phoenix': rulesForSupportRole('phoenix'),
    'support-of-the-scorpion': rulesForSupportRole('scorpion'),
    'support-of-the-unicorn': rulesForSupportRole('unicorn')
};

class DeckValidator {
    constructor(packs) {
        this.packs = packs;
        this.restrictedList = new RestrictedList();
    }

    validateDeck(deck) {
        let errors = [];
        let unreleasedCards = [];
        let rules = this.getRules(deck);
        let stronghold = deck.stronghold.length > 0 ? deck.stronghold[0].card : null;
        let role = deck.role.length > 0 ? deck.role[0].card : null;
        let provinceCount = getDeckCount(deck.provinceCards);
        let dynastyCount = getDeckCount(deck.dynastyCards);
        let conflictCount = getDeckCount(deck.conflictCards);

        if(deck.stronghold.length > 1) {
            errors.push('Too many strongholds');
        }

        if(deck.role.length > 1) {
            errors.push('Too many roles');
        }

        if(provinceCount < rules.requiredProvinces) {
            errors.push('Too few province cards');
        } else if(provinceCount > rules.requiredProvinces) {
            errors.push('Too many province cards');
        }

        if(dynastyCount < rules.minimumDynasty) {
            errors.push('Too few dynasty cards');
        } else if(dynastyCount > rules.maximumDynasty) {
            errors.push('Too many dynasty cards');
        }

        if(conflictCount < rules.minimumConflict) {
            errors.push('Too few conflict cards');
        } else if(conflictCount > rules.maximumConflict) {
            errors.push('Too many conflict cards');
        }

        _.each(rules.rules, rule => {
            if(!rule.condition(deck)) {
                errors.push(rule.message);
            }
        });

        let allCards = deck.provinceCards.concat(deck.dynastyCards).concat(deck.conflictCards);
        let cardCountByName = {};

        _.each(allCards, cardQuantity => {
            cardCountByName[cardQuantity.card.name] = cardCountByName[cardQuantity.card.name] || { name: cardQuantity.card.name, faction: cardQuantity.card.clan, influence: cardQuantity.card.influence_cost, limit: cardQuantity.card.deck_limit, count: 0, allowed_clans: cardQuantity.card.allowed_clans };
            cardCountByName[cardQuantity.card.name].count += cardQuantity.count;

            if(!rules.mayInclude(cardQuantity.card) || rules.cannotInclude(cardQuantity.card) || (cardQuantity.card.role_restriction && !rules.roleRestrictions.includes(cardQuantity.card.role_restriction))) {
                errors.push(cardQuantity.card.name + ' is not allowed by clan, alliance or role');
            }

            if(!isCardInReleasedPack(this.packs, cardQuantity.card)) {
                unreleasedCards.push(cardQuantity.card.name + ' is not yet released');
            }
        });

        if(!stronghold) {
            errors.push('No stronghold');
        } else if(!isCardInReleasedPack(this.packs, stronghold)) {
            unreleasedCards.push(stronghold.name + ' is not yet released');
        }

        if(role && !isCardInReleasedPack(this.packs, role)) {
            unreleasedCards.push(role.name + ' is not yet released');
        }

        _.each(rules.maxProvince, (amount, element) => {
            let provinces = _.filter(deck.provinceCards, card => card.card.element === element);
            if(provinces.length > amount) {
                errors.push('Too many provinces with ' + element + ' element');
            }
        });

        _.each(cardCountByName, card => {
            if(card.count > card.limit) {
                errors.push(card.name + ' has limit ' + card.limit);
            }
        });

        let totalConflictChars = _.reduce(deck.conflictCards, (total, card) => {
            if(card.card.type === 'character') {
                return total + card.count;
            }
            return total;
        }, 0);

        if(totalConflictChars > rules.maxConflictCharacters) {
            errors.push('Too many conflict characters');
        }

        let totalInfluence = _.reduce(cardCountByName, (total, card) => {
            if(card.influence && card.faction !== deck.faction.value) {
                return total + card.influence * card.count;
            }
            return total;
        }, 0);

        if(totalInfluence > rules.influence) {
            errors.push('Total influence (' + totalInfluence.toString() + ') is higher than max allowed influence (' + rules.influence.toString() + ')');
        }

        let restrictedResult = this.restrictedList.validate(allCards.map(cardQuantity => cardQuantity.card));

        return {
            basicRules: errors.length === 0,
            noUnreleasedCards: unreleasedCards.length === 0,
            officialRole: !role || officialRoles[deck.faction.value].includes(role.id) || openRoles.includes(role.id),
            faqRestrictedList: restrictedResult.valid,
            faqVersion: restrictedResult.version,
            provinceCount: provinceCount,
            dynastyCount: dynastyCount,
            conflictCount: conflictCount,
            extendedStatus: errors.concat(unreleasedCards).concat(restrictedResult.errors)
        };
    }

    getRules(deck) {
        const standardRules = {
            minimumDynasty: 40,
            maximumDynasty: 45,
            minimumConflict: 40,
            maximumConflict: 45,
            requiredProvinces: 5,
            maxConflictCharacters: 10,
            maxProvince: {
                air: 1,
                earth: 1,
                fire: 1,
                void: 1,
                water: 1
            }
        };
        let factionRules = this.getFactionRules(deck.faction.value.toLowerCase());
        let allianceRules = this.getAllianceRules(deck.alliance.value.toLowerCase(), deck.faction.value.toLowerCase());
        let roleRules = this.getRoleRules(deck.role.length > 0 ? deck.role[0].card : null);
        let strongholdRules = this.getStrongholdRules(deck.stronghold.length > 0 ? deck.stronghold[0].card : null);
        return this.combineValidationRules([standardRules, factionRules, allianceRules, roleRules, strongholdRules]);
    }

    getFactionRules(faction) {
        return {
            mayInclude: card => card.clan === faction || card.clan === 'neutral'
        };
    }

    getAllianceRules(clan, faction) {
        return {
            mayInclude: card => card.side === 'conflict' && card.clan === clan && card.allowed_clans.includes(faction)
        };
    }

    getStrongholdRules(stronghold) {
        if(!stronghold) {
            return {};
        }
        return {
            influence: stronghold.influence_pool,
            rules: [
                {
                    message: 'Your stronghold must match your clan',
                    condition: deck => stronghold.clan === deck.faction.value
                }
            ]

        };
    }

    getRoleRules(role) {
        if(!role || !roleRules[role.id]) {
            return {};
        }
        return roleRules[role.id];
    }

    combineValidationRules(validators) {
        let mayIncludeFuncs = _.compact(_.pluck(validators, 'mayInclude'));
        let cannotIncludeFuncs = _.compact(_.pluck(validators, 'cannotInclude'));
        let combinedRules = _.reduce(validators, (rules, validator) => rules.concat(validator.rules || []), []);
        let combinedRoles = _.reduce(validators, (roles, validator) => roles.concat(validator.roleRestrictions || []), []);
        let totalInfluence = _.reduce(validators, (total, validator) => total + validator.influence || 0, 0);
        let maxProvince = _.reduce(validators, (result, validator) => {
            if(validator.maxProvince) {
                _.each(result, (amount, element) => result[element] = amount + (validator.maxProvince[element] || 0));
            }
            return result;
        }, { air: 0, earth: 0, fire: 0, void: 0, water: 0 });
        let combined = {
            mayInclude: card => _.any(mayIncludeFuncs, func => func(card)),
            cannotInclude: card => _.any(cannotIncludeFuncs, func => func(card)),
            rules: combinedRules,
            roleRestrictions: combinedRoles,
            influence: totalInfluence,
            maxProvince: maxProvince
        };
        return _.extend({}, ...validators, combined);
    }
}

module.exports = function validateDeck(deck, options) {
    options = Object.assign({ includeExtendedStatus: true }, options);

    let validator = new DeckValidator(options.packs);
    let result = validator.validateDeck(deck);

    if(!options.includeExtendedStatus) {
        return _.omit(result, 'extendedStatus');
    }

    return result;
};
/*
module.exports = function validateDeck(deck, packs) { // eslint-disable-line no-unused-vars
    var provinceCount = getDeckCount(deck.provinceCards);
    var conflictCount = getDeckCount(deck.conflictCards);
    var dynastyCount = getDeckCount(deck.dynastyCards);
    var status = 'Valid';
    var requiredProvinces = 5;
    var stronghold = getStronghold(deck.stronghold);
    var influenceTotal = 0;
    var extendedStatus = [];
    var minDraw = 40;
    var maxDraw = 45;
    var airCount = 0;
    var earthCount = 0;
    var fireCount = 0;
    var voidCount = 0;
    var waterCount = 0;
    let provinceMax = {
        air: 1,
        earth: 1,
        fire: 1,
        void: 1,
        water: 1
    };
    let roleType = undefined;
    let roleElement = undefined;
    var isValid = true;

    if(_.any(deck.stronghold, card => {
        return !card.card.clan;
    })) {
        status = 'Invalid';
        extendedStatus.push('Deck contains invalid cards');

        return { status: status, provinceCount: provinceCount, conflictCount: conflictCount, dynastyCount: dynastyCount, extendedStatus: extendedStatus };
    }
    var combined = _.union(deck.provinceCards, deck.stronghold, deck.conflictCards, deck.dynastyCards);

    var combinedClan = _.union(deck.provinceCards, deck.stronghold, deck.dynastyCards);

    if(conflictCount < minDraw) {
        status = 'Invalid';
        isValid = false;
        extendedStatus.push('Too few conflict cards');
    }

    if(dynastyCount < minDraw) {
        status = 'Invalid';
        isValid = false;
        extendedStatus.push('Too few dynasty cards');
    }

    if(conflictCount > maxDraw) {
        status = 'Invalid';
        isValid = false;
        extendedStatus.push('Too many conflict cards');
    }

    if(dynastyCount > maxDraw) {
        status = 'Invalid';
        isValid = false;
        extendedStatus.push('Too many dynasty cards');
    }

    if(provinceCount < requiredProvinces) {
        status = 'Invalid';
        isValid = false;
        extendedStatus.push('Too few province cards');
    }

    if(provinceCount > requiredProvinces) {
        extendedStatus.push('Too many provinces');
        status = 'Invalid';
        isValid = false;
    }

    //Ensure one province of each element
    _.each(deck.provinceCards, card => {
        if(card.card.element === 'air') {
            airCount++;
        } else if(card.card.element === 'earth') {
            earthCount++;
        } else if(card.card.element === 'fire') {
            fireCount++;
        } else if(card.card.element === 'water') {
            waterCount++;
        } else if(card.card.element === 'void') {
            voidCount++;
        }
    });

    if(deck.role && deck.role['0'] && deck.role['0'].card) {
        let roleIdArray = deck.role['0'].card.id.split('-');
        roleType = roleIdArray[0];
        roleElement = roleIdArray[2];

        if(roleType === 'seeker') {
            provinceMax[roleElement] = 2;
        }
    }

    if(airCount > provinceMax['air']) {
        extendedStatus.push('Too many air provinces');
        status = 'Invalid';
        isValid = false;
    }

    if(earthCount > provinceMax['earth']) {
        extendedStatus.push('Too many earth provinces');
        status = 'Invalid';
        isValid = false;
    }

    if(fireCount > provinceMax['fire']) {
        extendedStatus.push('Too many fire provinces');
        status = 'Invalid';
        isValid = false;
    }

    if(voidCount > provinceMax['void']) {
        extendedStatus.push('Too many void provinces');
        status = 'Invalid';
        isValid = false;
    }

    if(waterCount > provinceMax['water']) {
        extendedStatus.push('Too many water provinces');
        status = 'Invalid';
        isValid = false;
    }

    if(_.any(combined, card => {
        if(card.count > card.card.deck_limit) {
            extendedStatus.push(card.card.name + ' has limit ' + card.card.deck_limit);

            return true;
        }

        return false;
    })) {
        status = 'Invalid';
        isValid = false;
    }

    //Check for out of faction cards in stronghold, provinces, dynasty
    if(_.any(combinedClan, card => {
        if(!(_.contains([deck.faction.value,'neutral'],card.card.clan))) {
            extendedStatus.push(card.card.name + ' is not in faction ' + deck.faction.value);
            //console.log(card.card.label + ' has clan ' + card.card.clan);
            return true;
        }

        return false;
    })) {
        status = 'Invalid';
        isValid = false;
    }

    //Check for out of faction cards in conflict
    if(_.any(deck.conflictCards, card => {
        if(!(_.contains([deck.faction.value, deck.alliance.value, 'neutral'],card.card.clan))) {
            extendedStatus.push(card.card.name + ' is not in faction ' + deck.faction.value);
            return true;
        }

        return false;
    })) {
        status = 'Invalid';
        isValid = false;
    }

    if(stronghold) {
        let influenceMax = stronghold.card.influence_pool;

        if(roleType === 'keeper') {
            influenceMax = influenceMax + 3;
        }
        //Total up influence count
        _.each(deck.conflictCards, card => {
            if(card.card.clan === deck.alliance.value) {
                influenceTotal = influenceTotal + (card.card.influence_cost * card.count);
            }
        });

        if(influenceTotal > influenceMax) {
            extendedStatus.push('Not enough influence');
            status = 'Invalid';
            isValid = false;
        }
    } else {
        extendedStatus.push('No stronghold chosen');
        status = 'Invalid';
        isValid = false;
    }

    if(isValid) {
        let unreleasedCards = _.reject(combined, card => {
            return isCardInReleasedPack(packs, card.card);
        });

        if(_.size(unreleasedCards) !== 0) {
            status = 'Unreleased Cards';

            _.each(unreleasedCards, card => {
                extendedStatus.push(card.card.name + ' is not yet released');
            });
        }

    }

    return { status: status, provinceCount: provinceCount, conflictCount: conflictCount, dynastyCount: dynastyCount, extendedStatus: extendedStatus, isValid: isValid };
};


/*
module.exports = function validateDeckNew(deck, packs) { // eslint-disable-line no-unused-vars
    let provinceCount = getDeckCount(deck.provinceCards);
    let conflictCount = getDeckCount(deck.conflictCards);
    let dynastyCount = getDeckCount(deck.dynastyCards);
    let status = 'Valid';
    let extendedStatus = [];
    let isValid = true;

    let deckList = {};

    let apiUrl = 'https://api.fiveringsdb.com/';
    let path = 'deck-validation';
    let format = 'standard';

    let combined = _.union(deck.stronghold, deck.role, deck.provinceCards, deck.conflictCards, deck.dynastyCards);

    _.each(combined, card => {
        deckList[card.card.id] = card.count;
    });

    let JSONDeckList = JSON.stringify(deckList);

    let response = {};


    $.ajax({
        type: 'POST',
        url: apiUrl + path + '/' + format,
        data: JSONDeckList,
        dataType: 'json',
        async: false,
        success: function(data) {
            response = data;
        }
    });

    if(response.success) {
        let responseStatus = parseInt(response.status);
        switch(responseStatus) {
            case 0:
                extendedStatus.push('Deck is valid');
                break;
            case 1:
                status = 'Invalid';
                isValid = false;
                extendedStatus.push('Deck has too many copies of one or more cards');
                break;
            case 2:
                status = 'Invalid';
                isValid = false;
                extendedStatus.push('Deck has too few Strongholds');
                break;
            case 3:
                status = 'Invalid';
                isValid = false;
                extendedStatus.push('Deck has too many Strongholds');
                break;
            case 4:
                status = 'Invalid';
                isValid = false;
                extendedStatus.push('Deck has too many Roles');
                break;
            case 5:
                status = 'Invalid';
                isValid = false;
                extendedStatus.push('Deck has too few Dynasty cards');
                break;
            case 6:
                status = 'Invalid';
                isValid = false;
                extendedStatus.push('Deck has too many Dynasty cards');
                break;
            case 7:
                status = 'Invalid';
                isValid = false;
                extendedStatus.push('Deck has off-clan Dynasty cards');
                break;
            case 8:
                status = 'Invalid';
                isValid = false;
                extendedStatus.push('Deck has too few Conflict cards');
                break;
            case 9:
                status = 'Invalid';
                isValid = false;
                extendedStatus.push('Deck has too many Conflict cards');
                break;
            case 10:
                status = 'Invalid';
                isValid = false;
                extendedStatus.push('Deck does not have enough influence for its off-clan Conflict cards');
                break;
            case 11:
                status = 'Invalid';
                isValid = false;
                extendedStatus.push('Deck has more than one off-clan in its Conflict deck');
                break;
            case 12:
                status = 'Invalid';
                isValid = false;
                extendedStatus.push('Deck has too many Character cards in its Conflict deck');
                break;
            case 13:
                status = 'Invalid';
                isValid = false;
                extendedStatus.push('Deck has too few Provinces');
                break;
            case 14:
                status = 'Invalid';
                isValid = false;
                extendedStatus.push('Deck has too many Provinces');
                break;
            case 15:
                status = 'Invalid';
                isValid = false;
                extendedStatus.push('Deck has too many Provinces of one Element');
                break;
            case 16:
                status = 'Invalid';
                isValid = false;
                extendedStatus.push('Deck has an off-clan Province');
                break;
            case 17:
                status = 'Invalid';
                isValid = false;
                extendedStatus.push('Deck has an off-clan Conflict card with no influence cost');
                break;
        }
    }

    return { status: status, provinceCount: provinceCount, conflictCount: conflictCount, dynastyCount: dynastyCount, extendedStatus: extendedStatus, isValid: isValid };
};
*/
