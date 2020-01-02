describe('Monastery Protector', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['monastery-protector', 'doji-challenger', 'ancient-master'],
                    hand: ['hawk-tattoo']
                },
                player2: {
                    fate: 0,
                    inPlay: ['yogo-hiroue', 'awakened-tsukumogami'],
                    hand: ['way-of-the-scorpion', 'hurricane-punch', 'duelist-training', 'unfulfilled-duty', 'jade-tetsubo'],
                    dynastyDiscard: ['city-of-lies'],
                    provinces: ['manicured-garden', 'blood-of-onnotangu']
                }
            });

            this.protector = this.player1.findCardByName('monastery-protector');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.ancientMaster = this.player1.findCardByName('ancient-master');
            this.tattoo = this.player1.findCardByName('hawk-tattoo');

            this.hiroue = this.player2.findCardByName('yogo-hiroue');
            this.scorpion = this.player2.findCardByName('way-of-the-scorpion');
            this.hurricanePunch = this.player2.findCardByName('hurricane-punch');
            this.duty = this.player2.findCardByName('unfulfilled-duty');
            this.tetsubo = this.player2.findCardByName('jade-tetsubo');
            this.duelistTraining = this.player2.findCardByName('duelist-training');
            this.lies = this.player2.placeCardInProvince('city-of-lies', 'province 1');
            this.manicured = this.player2.findCardByName('manicured-garden');
            this.blood = this.player2.findCardByName('blood-of-onnotangu');
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

        it('should allow for using alternate fate pools', function() {
            this.game.rings.air.fate = 1;
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.protector, this.challenger, this.ancientMaster],
                defenders: [this.hiroue],
                type: 'military',
                ring: 'water'
            });

            this.player2.clickCard(this.hurricanePunch);
            expect(this.player2).toBeAbleToSelect(this.protector);
            expect(this.player2).toBeAbleToSelect(this.ancientMaster);
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

            expect(this.getChatLogs(1)).toContain('player2 plays Unfulfilled Duty to ready Monastery Protector');

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

            expect(this.getChatLogs(1)).toContain('player2 plays Unfulfilled Duty to ready Monastery Protector and Ancient Master');

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

            expect(this.getChatLogs(3)).toContain('player2 plays Way of the Scorpion to dishonor Monastery Protector');

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

            expect(this.getChatLogs(3)).toContain('player2 uses Yogo Hiroue to move Monastery Protector into the conflict');
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
    });
});