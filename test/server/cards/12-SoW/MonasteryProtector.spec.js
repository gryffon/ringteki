describe('Monastery Protector', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['monastery-protector', 'doji-challenger', 'ancient-master', 'court-musician', 'utaku-tetsuko'],
                    hand: ['hawk-tattoo', 'way-of-the-scorpion']
                },
                player2: {
                    fate: 0,
                    inPlay: ['yogo-hiroue', 'awakened-tsukumogami'],
                    hand: ['way-of-the-scorpion', 'hurricane-punch', 'duelist-training', 'unfulfilled-duty', 'jade-tetsubo', 'court-games', 'civil-discourse', 'policy-debate'],
                    dynastyDiscard: ['city-of-lies'],
                    conflictDiscard: ['kirei-ko'],
                    provinces: ['manicured-garden', 'blood-of-onnotangu']
                }
            });

            this.protector = this.player1.findCardByName('monastery-protector');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.ancientMaster = this.player1.findCardByName('ancient-master');
            this.tattoo = this.player1.findCardByName('hawk-tattoo');
            this.musician = this.player1.findCardByName('court-musician');
            this.tetsuko = this.player1.findCardByName('utaku-tetsuko');
            this.scorpionP1 = this.player1.findCardByName('way-of-the-scorpion');

            this.hiroue = this.player2.findCardByName('yogo-hiroue');
            this.scorpion = this.player2.findCardByName('way-of-the-scorpion');
            this.hurricanePunch = this.player2.findCardByName('hurricane-punch');
            this.duty = this.player2.findCardByName('unfulfilled-duty');
            this.tetsubo = this.player2.findCardByName('jade-tetsubo');
            this.duelistTraining = this.player2.findCardByName('duelist-training');
            this.lies = this.player2.placeCardInProvince('city-of-lies', 'province 1');
            this.manicured = this.player2.findCardByName('manicured-garden');
            this.blood = this.player2.findCardByName('blood-of-onnotangu');
            this.courtGames = this.player2.findCardByName('court-games');
            this.civil = this.player2.findCardByName('civil-discourse');
            this.debate = this.player2.findCardByName('policy-debate');
            this.kireiKo = this.player2.findCardByName('kirei-ko');
        });

        it('should not impact own targeting', function() {
            this.player1.fate = 1;
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.protector, this.challenger, this.ancientMaster],
                defenders: [this.hiroue],
                type: 'military'
            });

            this.player2.pass();
            this.player1.clickCard(this.scorpionP1);
            expect(this.player1).toBeAbleToSelect(this.protector);
            expect(this.player1).toBeAbleToSelect(this.challenger);
            expect(this.player1).toBeAbleToSelect(this.ancientMaster);
            this.player1.clickCard(this.protector);
            expect(this.player1.fate).toBe(1);
            expect(this.getChatLogs(3)).toContain('player1 plays Way of the Scorpion to dishonor Monastery Protector');
        });

        it('should not allow targeting if you cannot pay a fate', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.protector, this.challenger, this.ancientMaster],
                defenders: [this.hiroue],
                type: 'military'
            });

            this.player2.clickCard(this.scorpion);
            expect(this.player2).not.toBeAbleToSelect(this.protector);
            expect(this.player2).toBeAbleToSelect(this.challenger);
            expect(this.player2).not.toBeAbleToSelect(this.ancientMaster);
        });

        it('should not allow playing a card if it would have no legal targets', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.protector, this.challenger, this.ancientMaster],
                defenders: [this.hiroue],
                type: 'military'
            });

            expect(this.player2).toHavePrompt('Conflict Action Window');
            this.player2.clickCard(this.hurricanePunch);
            expect(this.player2).toHavePrompt('Conflict Action Window');
        });

        it('should not allow targeting even if your event costs negative fate', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.protector, this.challenger, this.ancientMaster, this.musician],
                defenders: [this.hiroue],
                type: 'military'
            });

            this.player2.pass();
            this.player1.clickCard(this.musician);
            this.player2.clickCard(this.scorpion);
            expect(this.player2).not.toBeAbleToSelect(this.protector);
            expect(this.player2).toBeAbleToSelect(this.challenger);
            expect(this.player2).not.toBeAbleToSelect(this.ancientMaster);
        });

        it('should only allow targeting tattooed characters equal to the amount of fate that you have', function() {
            this.player2.fate = 3;
            this.protector.bowed = true;
            this.ancientMaster.bowed = true;

            this.player1.pass();
            this.player2.clickCard(this.duty);

            expect(this.player2).toBeAbleToSelect(this.protector);
            expect(this.player2).toBeAbleToSelect(this.ancientMaster);

            this.player2.clickCard(this.protector);
            expect(this.player2).toBeAbleToSelect(this.protector);
            expect(this.player2).not.toBeAbleToSelect(this.ancientMaster);

            this.player2.clickCard(this.protector);
            expect(this.player2).toBeAbleToSelect(this.protector);
            expect(this.player2).toBeAbleToSelect(this.ancientMaster);
        });

        it('should account for reduced cost', function() {
            this.player2.fate = 3;
            this.protector.bowed = true;
            this.ancientMaster.bowed = true;

            this.player1.pass();
            this.player2.clickCard(this.lies);
            this.player1.pass();
            this.player2.clickCard(this.duty);

            expect(this.player2).toBeAbleToSelect(this.protector);
            expect(this.player2).toBeAbleToSelect(this.ancientMaster);

            this.player2.clickCard(this.protector);
            expect(this.player2).toBeAbleToSelect(this.protector);
            expect(this.player2).toBeAbleToSelect(this.ancientMaster);
        });

        it('should not allow for using alternate fate pools', function() {
            this.game.rings.air.fate = 1;
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.protector, this.challenger, this.ancientMaster],
                defenders: [this.hiroue],
                type: 'military',
                ring: 'water'
            });

            this.player2.clickCard(this.hurricanePunch);
            expect(this.player2).toHavePrompt('Conflict Action Window');
        });

        it('should not allow spending fate to target if it is restricted', function() {
            this.player2.fate = 3;
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.protector, this.challenger, this.ancientMaster],
                defenders: [this.hiroue],
                type: 'military',
                ring: 'water',
                province: this.blood
            });

            this.player2.clickCard(this.scorpion);
            expect(this.player2).not.toBeAbleToSelect(this.protector);
            expect(this.player2).toBeAbleToSelect(this.challenger);
            expect(this.player2).not.toBeAbleToSelect(this.ancientMaster);
        });

        it('should spend the extra fate (multi-target, single selection)', function() {
            this.player2.fate = 3;
            this.protector.bowed = true;
            this.ancientMaster.bowed = true;

            this.player1.pass();
            this.player2.clickCard(this.duty);

            expect(this.player2).toBeAbleToSelect(this.protector);
            expect(this.player2).toBeAbleToSelect(this.ancientMaster);

            this.player2.clickCard(this.protector);
            this.player2.clickPrompt('Done');

            expect(this.getChatLogs(2)).toContain('player2 plays Unfulfilled Duty to ready Monastery Protector');
            expect(this.getChatLogs(1)).toContain('player2 pays 1 fate in order to target Monastery Protector');

            expect(this.player2.fate).toBe(0);
            expect(this.protector.bowed).toBe(false);
        });

        it('should spend the extra fate (multi-target, multi selection)', function() {
            this.player2.fate = 5;
            this.protector.bowed = true;
            this.ancientMaster.bowed = true;

            this.player1.pass();
            this.player2.clickCard(this.duty);

            expect(this.player2).toBeAbleToSelect(this.protector);
            expect(this.player2).toBeAbleToSelect(this.ancientMaster);

            this.player2.clickCard(this.protector);
            this.player2.clickCard(this.ancientMaster);
            this.player2.clickPrompt('Done');

            expect(this.getChatLogs(3)).toContain('player2 plays Unfulfilled Duty to ready Monastery Protector and Ancient Master');
            expect(this.getChatLogs(2)).toContain('player2 pays 1 fate in order to target Monastery Protector');
            expect(this.getChatLogs(1)).toContain('player2 pays 1 fate in order to target Ancient Master');

            expect(this.player2.fate).toBe(1);
            expect(this.protector.bowed).toBe(false);
            expect(this.ancientMaster.bowed).toBe(false);
        });

        it('should spend the extra fate (single target)', function() {
            this.player2.fate = 3;
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.protector, this.challenger, this.ancientMaster],
                defenders: [this.hiroue],
                type: 'military'
            });

            this.player2.clickCard(this.scorpion);
            expect(this.player2).toBeAbleToSelect(this.protector);
            expect(this.player2).toBeAbleToSelect(this.challenger);
            expect(this.player2).toBeAbleToSelect(this.ancientMaster);
            this.player2.clickCard(this.protector);

            expect(this.getChatLogs(4)).toContain('player2 plays Way of the Scorpion to dishonor Monastery Protector');
            expect(this.getChatLogs(3)).toContain('player2 pays 1 fate in order to target Monastery Protector');

            expect(this.player2.fate).toBe(2);
            expect(this.protector.isDishonored).toBe(true);
        });

        it('should not cost a fate to target with a character ability', function() {
            this.player2.fate = 0;
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.hiroue],
                type: 'military'
            });

            this.player2.clickCard(this.hiroue);
            expect(this.player2).toBeAbleToSelect(this.protector);
            expect(this.player2).toBeAbleToSelect(this.ancientMaster);
            this.player2.clickCard(this.protector);
            expect(this.game.currentConflict.attackers).toContain(this.protector);
        });

        it('should not cost a fate to target with an attachment ability', function() {
            this.player2.fate = 2;
            this.ancientMaster.fate = 3;
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.protector, this.challenger, this.ancientMaster],
                defenders: [this.hiroue],
                type: 'military'
            });

            this.player2.playAttachment(this.tetsubo, this.hiroue);
            this.player1.pass();

            expect(this.player2.fate).toBe(0);

            this.player2.clickCard(this.tetsubo);
            expect(this.player2).toBeAbleToSelect(this.ancientMaster);
            this.player2.clickCard(this.ancientMaster);
            expect(this.ancientMaster.fate).toBe(0);

            expect(this.getChatLogs(3)).toContain('player2 uses Jade Tetsubō, bowing Jade Tetsubō to return all fate from Ancient Master to its owner');
        });

        it('should not cost a fate to target with a gained ability', function() {
            this.player2.fate = 1;
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.protector, this.challenger, this.ancientMaster],
                defenders: [this.hiroue],
                type: 'military'
            });

            this.player2.playAttachment(this.duelistTraining, this.hiroue);
            this.player1.pass();

            expect(this.player2.fate).toBe(0);

            this.player2.clickCard(this.hiroue);
            this.player2.clickPrompt('Initiate a duel to bow');
            expect(this.player2).toBeAbleToSelect(this.protector);
            expect(this.player2).toBeAbleToSelect(this.challenger);
            expect(this.player2).toBeAbleToSelect(this.ancientMaster);
            this.player2.clickCard(this.ancientMaster);
            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');
            expect(this.getChatLogs(3)).toContain('Duel Effect: bow Yogo Hiroue');
        });

        it('should not allow targeting if you cannot pay a fate (opponent chooses targets, target chosen after costs)', function() {
            this.player1.fate = 10;
            this.player2.fate = 0;
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.protector, this.challenger, this.ancientMaster],
                defenders: [this.hiroue],
                type: 'political'
            });

            this.player2.clickCard(this.courtGames);
            this.player2.clickPrompt('Dishonor an opposing character');
            expect(this.player1).not.toBeAbleToSelect(this.protector);
            expect(this.player1).toBeAbleToSelect(this.challenger);
            expect(this.player1).not.toBeAbleToSelect(this.ancientMaster);
        });

        it('should spend a fate even if opponent chooses targets (target chosen after costs)', function() {
            this.player1.fate = 10;
            this.player2.fate = 1;
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.protector, this.challenger, this.ancientMaster],
                defenders: [this.hiroue],
                type: 'political'
            });

            this.player2.clickCard(this.courtGames);
            this.player2.clickPrompt('Dishonor an opposing character');
            expect(this.player1).toBeAbleToSelect(this.protector);
            expect(this.player1).toBeAbleToSelect(this.challenger);
            expect(this.player1).toBeAbleToSelect(this.ancientMaster);

            this.player1.clickCard(this.protector);
            expect(this.protector.isDishonored).toBe(true);
            expect(this.player2.fate).toBe(0);
        });

        it('should spend a fate even if opponent chooses targets (target chosen after costs)', function() {
            this.player1.fate = 10;
            this.player2.fate = 1;
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.protector, this.challenger, this.ancientMaster],
                defenders: [this.hiroue],
                type: 'political'
            });

            this.player2.clickCard(this.courtGames);
            this.player2.clickPrompt('Dishonor an opposing character');
            expect(this.player1).toBeAbleToSelect(this.protector);
            expect(this.player1).toBeAbleToSelect(this.challenger);
            expect(this.player1).toBeAbleToSelect(this.ancientMaster);

            this.player1.clickCard(this.protector);
            expect(this.protector.isDishonored).toBe(true);
            expect(this.player2.fate).toBe(0);
        });

        it('should not let opponent chooses targets if there is no fate to spend (target chosen after costs)', function() {
            this.player1.fate = 10;
            this.player2.fate = 0;
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.protector, this.challenger, this.ancientMaster],
                defenders: [this.hiroue],
                type: 'political'
            });

            this.player2.clickCard(this.courtGames);
            this.player2.clickPrompt('Dishonor an opposing character');
            expect(this.player1).not.toBeAbleToSelect(this.protector);
            expect(this.player1).toBeAbleToSelect(this.challenger);
            expect(this.player1).not.toBeAbleToSelect(this.ancientMaster);

            this.player1.clickCard(this.protector);
            expect(this.protector.isDishonored).toBe(false);
            expect(this.player2.fate).toBe(0);
        });

        it('should work if you choose to pay costs first', function() {
            this.player2.fate = 3;
            this.protector.bowed = true;
            this.ancientMaster.bowed = true;

            this.player1.pass();
            this.player2.clickCard(this.duty);
            this.player2.clickPrompt('Pay costs first');

            expect(this.player2).toBeAbleToSelect(this.protector);
            expect(this.player2).toBeAbleToSelect(this.ancientMaster);

            this.player2.clickCard(this.protector);
            expect(this.player2).toBeAbleToSelect(this.protector);
            expect(this.player2).not.toBeAbleToSelect(this.ancientMaster);

            this.player2.clickCard(this.protector);
            expect(this.player2).toBeAbleToSelect(this.protector);
            expect(this.player2).toBeAbleToSelect(this.ancientMaster);
        });

        it('should spend a fate even if you choose to pay costs first', function() {
            this.player2.fate = 3;
            this.protector.bowed = true;
            this.ancientMaster.bowed = true;

            this.player1.pass();
            this.player2.clickCard(this.duty);
            this.player2.clickPrompt('Pay costs first');

            expect(this.player2).toBeAbleToSelect(this.protector);
            expect(this.player2).toBeAbleToSelect(this.ancientMaster);

            this.player2.clickCard(this.protector);
            expect(this.player2).toBeAbleToSelect(this.protector);
            expect(this.player2).not.toBeAbleToSelect(this.ancientMaster);

            this.player2.clickPrompt('Done');
            expect(this.player2.fate).toBe(0);
        });

        it('should not allow targeting if you cannot pay a fate (duel - you choose target)', function() {
            this.player1.fate = 10;
            this.player2.fate = 0;
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.protector, this.challenger, this.ancientMaster],
                defenders: [this.hiroue],
                type: 'political'
            });

            this.player2.clickCard(this.debate);
            this.player2.clickCard(this.hiroue);
            expect(this.player2).not.toBeAbleToSelect(this.protector);
            expect(this.player2).toBeAbleToSelect(this.challenger);
            expect(this.player2).not.toBeAbleToSelect(this.ancientMaster);
        });

        it('should not allow targeting if you cannot pay a fate (duel - opponent chooses target)', function() {
            this.player1.fate = 10;
            this.player2.fate = 1;
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.protector, this.challenger, this.ancientMaster],
                defenders: [this.hiroue],
                type: 'political'
            });

            this.player2.clickCard(this.civil);
            this.player2.clickCard(this.hiroue);
            expect(this.player1).toHavePrompt('Choose a character');
            expect(this.player1).not.toBeAbleToSelect(this.protector);
            expect(this.player1).toBeAbleToSelect(this.challenger);
            expect(this.player1).not.toBeAbleToSelect(this.ancientMaster);
        });

        it('should not impact events that don\'t target', function() {
            this.player2.fate = 0;
            this.player2.moveCard(this.kireiKo, 'hand');

            this.player1.playAttachment(this.tattoo, this.challenger);
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.protector, this.challenger, this.ancientMaster],
                defenders: [],
                type: 'military'
            });

            this.player2.clickCard(this.scorpion); //no legal cards
            expect(this.player2).toHavePrompt('Conflict Action Window');
            this.player2.fate = 1;
            this.player2.clickCard(this.lies);

            this.player1.clickCard(this.challenger);
            expect(this.player1).toBeAbleToSelect(this.hiroue);
            this.player1.clickCard(this.hiroue);
            expect(this.player2).toHavePrompt('Triggered Abilities');
            this.player2.clickCard(this.kireiKo);
            expect(this.challenger.bowed).toBe(true);
            expect(this.player2.fate).toBe(1);
        });

        it('should allow for using alternate fate pools to pay for the event, and if not chosen then the event should not resolve (paying costs first)', function() {
            this.game.rings.air.fate = 1;
            this.player2.fate = 1;
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.protector, this.challenger, this.ancientMaster, this.tetsuko],
                defenders: [this.hiroue],
                type: 'military',
                ring: 'water'
            });

            this.player2.clickCard(this.hurricanePunch);
            this.player2.clickPrompt('Pay costs first');
            expect(this.player2).toHavePrompt('Choose amount of fate to spend from the Air Ring');
            expect(this.player2.currentButtons).toContain('0');
            expect(this.player2.currentButtons).toContain('1');
            expect(this.player2.currentButtons).toContain('Cancel');
            this.player2.clickPrompt('0');
            expect(this.getChatLogs(3)).toContain('player2 attempted to use Hurricane Punch, but there are insufficient legal targets');
            expect(this.hurricanePunch.location).toBe('hand');
            expect(this.player2.fate).toBe(0);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });

        it('should allow for using alternate fate pools to pay for the event, and if not chosen then the event should not resolve (choosing targets first)', function() {
            this.game.rings.air.fate = 1;
            this.player2.fate = 1;
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.protector, this.challenger, this.ancientMaster, this.tetsuko],
                defenders: [this.hiroue],
                type: 'military',
                ring: 'water'
            });

            this.player2.clickCard(this.hurricanePunch);
            expect(this.player2).toBeAbleToSelect(this.protector);
            this.player2.clickCard(this.protector);
            expect(this.player2).toHavePrompt('Choose amount of fate to spend from the Air Ring');
            expect(this.player2.currentButtons).toContain('0');
            expect(this.player2.currentButtons).toContain('1');
            expect(this.player2.currentButtons).toContain('Cancel');
            this.player2.clickPrompt('0');
            expect(this.getChatLogs(3)).toContain('player2 attempted to use Hurricane Punch, but there are insufficient legal targets');
            expect(this.hurricanePunch.location).toBe('hand');
            expect(this.player2.fate).toBe(0);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });

        it('should allow for using alternate fate pools to pay for the event', function() {
            this.game.rings.air.fate = 1;
            this.player2.fate = 1;
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.protector, this.challenger, this.ancientMaster, this.tetsuko],
                defenders: [this.hiroue],
                type: 'military',
                ring: 'water'
            });

            this.player2.clickCard(this.hurricanePunch);
            expect(this.player2).toBeAbleToSelect(this.protector);
            this.player2.clickCard(this.protector);
            expect(this.player2).toHavePrompt('Choose amount of fate to spend from the Air Ring');
            expect(this.player2.currentButtons).toContain('0');
            expect(this.player2.currentButtons).toContain('1');
            expect(this.player2.currentButtons).toContain('Cancel');
            this.player2.clickPrompt('1');
            expect(this.getChatLogs(4)).toContain('player2 plays Hurricane Punch to grant 2 military skill to Monastery Protector and draw a card');
            expect(this.getChatLogs(3)).toContain('player2 pays 1 fate in order to target Monastery Protector');
            expect(this.hurricanePunch.location).toBe('conflict discard pile');
            expect(this.player2.fate).toBe(0);
            expect(this.game.rings.air.fate).toBe(0);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });
    });
});
