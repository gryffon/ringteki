const DrawCard = require('../../drawcard.js');
const EventRegistrar = require('../../eventregistrar.js');
const { EventNames, ConflictTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class IvoryKingdomsUnicorn extends DrawCard {
    setupCardAbilities() {
        this.attackingAtConflictResolution = false;
        this.provinceBroken = false;
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register([EventNames.AfterConflict, EventNames.OnBreakProvince, EventNames.OnConflictDeclared]);
        this.reaction({
            title: 'Immediately declare a military conflict',
            when: {
                onConflictFinished: () => this.provinceBroken && this.attackingAtConflictResolution
            },
            gameAction: AbilityDsl.actions.initiateConflict({ canPass: false, forcedDeclaredType: ConflictTypes.Military })
        });
    }

    afterConflict() {
        this.attackingAtConflictResolution = this.isAttacking();
    }

    onBreakProvince() {
        this.provinceBroken = true;
    }

    onConflictDeclared() {
        this.attackingAtConflictResolution = false;
        this.provinceBroken = false;
    }
}

IvoryKingdomsUnicorn.id = 'ivory-kingdoms-unicorn';

module.exports = IvoryKingdomsUnicorn;
