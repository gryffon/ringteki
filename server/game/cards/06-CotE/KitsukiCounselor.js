const DrawCard = require('../../drawcard.js');
class KitsukiCounselor extends DrawCard {
    setupCardAbilities(ability) {
        this.composure({
            effect: ability.effects.modifyBothSkills(1)
        });
    }
}
KitsukiCounselor.id = 'kitsuki-counselor';
module.exports = KitsukiCounselor;
