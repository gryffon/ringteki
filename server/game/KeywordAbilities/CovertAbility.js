const BaseAbility = require('../baseability.js');

class CovertAbility extends BaseAbility {
    isCardAbility() {
        return true;
    }
}

module.exports = CovertAbility;
