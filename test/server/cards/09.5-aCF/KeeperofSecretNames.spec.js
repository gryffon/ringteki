describe('Keeper of Secret Names', function() {
    integration(function() {
        describe('Keeper of Secret Names\' ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['keeper-of-secret-names', 'doji-challenger', 'brash-samurai', 'graceful-guardian', 'cautious-scout'],
                        hand: ['fine-katana'],
                        provinces: ['meditations-on-the-tao', 'vassal-fields', 'kuroi-mori', 'rally-to-the-cause']
                    },
                    player2: {
                        inPlay: ['keeper-of-secret-names'],
                        provinces: ['riot-in-the-streets', 'along-the-river-of-gold', 'frostbitten-crossing', 'brother-s-gift-dojo']
                    }
                });
                this.p1Keeper = this.player1.findCardByName('keeper-of-secret-names');
                this.challenger = this.player1.findCardByName('doji-challenger');
                this.brash = this.player1.findCardByName('brash-samurai');
                this.guardian = this.player1.findCardByName('graceful-guardian');
                this.katana = this.player1.findCardByName('fine-katana');
                this.scout = this.player1.findCardByName('cautious-scout');

                this.p2Keeper = this.player2.findCardByName('keeper-of-secret-names');

                this.p1Keeper.fate = 2;
                this.p2Keeper.fate = 2;

                // this.manicuredGarden = this.player1.findCardByName('manicured-garden');
                this.meditationsOnTheTao = this.player1.findCardByName('meditations-on-the-tao');
                this.vassalFields = this.player1.findCardByName('vassal-fields');
                this.kuroiMori = this.player1.findCardByName('kuroi-mori');
                this.rallyToTheCause = this.player1.findCardByName('rally-to-the-cause');

                this.riotInTheStreets = this.player2.findCardByName('riot-in-the-streets');
                // this.shamefulDisplay = this.player2.findCardByName('shameful-display');
                this.alongTheRiverOfGold = this.player2.findCardByName('along-the-river-of-gold');
                this.frostbittenCrossing = this.player2.findCardByName('frostbitten-crossing');
                this.brothersGiftDojo = this.player2.findCardByName('brother-s-gift-dojo');

                this.meditationsOnTheTao.facedown = false;
                this.vassalFields.facedown = false;
                this.kuroiMori.facedown = false;
                this.rallyToTheCause.facedown = false;
                this.riotInTheStreets.facedown = false;
                this.alongTheRiverOfGold.facedown = false;
                this.frostbittenCrossing.facedown = false;
                this.brothersGiftDojo.facedown = false;

                this.player1.playAttachment(this.katana, this.p1Keeper);
                this.noMoreActions();
            });

            it('should allow selecting a province with an action that can be used (participating or not)', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.challenger],
                    defenders: [this.p2Keeper]
                });

                this.player2.clickCard(this.p2Keeper);
                expect(this.player2).not.toBeAbleToSelect(this.meditationsOnTheTao);
                expect(this.player2).toBeAbleToSelect(this.vassalFields);
                expect(this.player2).toBeAbleToSelect(this.kuroiMori);
                expect(this.player2).not.toBeAbleToSelect(this.rallyToTheCause);
                expect(this.player2).not.toBeAbleToSelect(this.riotInTheStreets);
                expect(this.player2).toBeAbleToSelect(this.alongTheRiverOfGold);
                expect(this.player2).not.toBeAbleToSelect(this.frostbittenCrossing);
                expect(this.player2).toBeAbleToSelect(this.brothersGiftDojo);

                this.player2.clickPrompt('Cancel');
                this.player2.pass();

                this.player1.clickCard(this.p1Keeper);
                expect(this.player1).not.toBeAbleToSelect(this.meditationsOnTheTao);
                expect(this.player1).toBeAbleToSelect(this.vassalFields);
                expect(this.player1).toBeAbleToSelect(this.kuroiMori);
                expect(this.player1).not.toBeAbleToSelect(this.rallyToTheCause);
                expect(this.player1).not.toBeAbleToSelect(this.riotInTheStreets);
                expect(this.player1).toBeAbleToSelect(this.alongTheRiverOfGold);
                expect(this.player1).not.toBeAbleToSelect(this.frostbittenCrossing);
                expect(this.player1).toBeAbleToSelect(this.brothersGiftDojo);
            });

            it('Vassal Fields (province references opponent)', function() {
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.p2Keeper],
                    defenders: [this.p1Keeper],
                    province: this.vassalFields
                });

                let p1fate = this.player1.fate;
                let p2fate = this.player2.fate;

                this.player1.clickCard(this.p1Keeper);
                expect(this.player1).toBeAbleToSelect(this.vassalFields);
                this.player1.clickCard(this.vassalFields);
                expect(this.player2.fate).toBe(p2fate - 1);

                this.player2.clickCard(this.p2Keeper);
                expect(this.player2).toBeAbleToSelect(this.vassalFields);
                this.player2.clickCard(this.vassalFields);
                expect(this.player1.fate).toBe(p1fate - 1);
            });

            it('Shouldn\'t use up the ability', function() {
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.p2Keeper],
                    defenders: [this.p1Keeper],
                    province: this.vassalFields
                });

                let p2fate = this.player2.fate;

                this.player1.clickCard(this.p1Keeper);
                expect(this.player1).toBeAbleToSelect(this.vassalFields);
                this.player1.clickCard(this.vassalFields);
                expect(this.player2.fate).toBe(p2fate - 1);

                this.player2.pass();

                this.player1.clickCard(this.vassalFields);
                expect(this.player2.fate).toBe(p2fate - 2);
            });

            it('Should be able to trigger after province has been triggered', function() {
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.p2Keeper],
                    defenders: [this.p1Keeper],
                    province: this.vassalFields
                });

                let p2fate = this.player2.fate;

                this.player1.clickCard(this.vassalFields);
                expect(this.player2.fate).toBe(p2fate - 1);

                this.player2.pass();

                this.player1.clickCard(this.p1Keeper);
                expect(this.player1).toBeAbleToSelect(this.vassalFields);
                this.player1.clickCard(this.vassalFields);
                expect(this.player2.fate).toBe(p2fate - 2);
            });

            it('Riot in the Streets (province has a triggering condition)', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.brash, this.challenger, this.guardian],
                    defenders: [this.p2Keeper]
                });

                this.player2.clickCard(this.p2Keeper);
                expect(this.player2).not.toBeAbleToSelect(this.riotInTheStreets);
                this.player2.clickPrompt('Cancel');
                this.player2.pass();

                expect(this.p2Keeper.bowed).toBe(false);
                this.player1.clickCard(this.p1Keeper);
                expect(this.player1).toBeAbleToSelect(this.riotInTheStreets);
                this.player1.clickCard(this.riotInTheStreets);
                this.player1.clickCard(this.p2Keeper);
                expect(this.p2Keeper.bowed).toBe(true);
            });

            it('Brothers Gift Dojo (province has a cost)', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.p1Keeper],
                    defenders: [this.p2Keeper]
                });

                let honor = this.player2.honor;

                expect(this.game.currentConflict.defenders).toContain(this.p2Keeper);
                this.player2.clickCard(this.p2Keeper);
                expect(this.player2).toBeAbleToSelect(this.brothersGiftDojo);
                this.player2.clickCard(this.brothersGiftDojo);
                this.player2.clickCard(this.p2Keeper);
                expect(this.player2.honor).toBe(honor - 1);
                expect(this.game.currentConflict.defenders).not.toContain(this.p2Keeper);
            });

            it('Meditations (province specifies targeting an attacking character)', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.p1Keeper],
                    defenders: [this.p2Keeper]
                });

                let fate = this.p1Keeper.fate;

                this.player2.clickCard(this.p2Keeper);
                expect(this.player2).toBeAbleToSelect(this.meditationsOnTheTao);
                this.player2.clickCard(this.meditationsOnTheTao);
                expect(this.player2).toBeAbleToSelect(this.p1Keeper);
                expect(this.player2).not.toBeAbleToSelect(this.p2Keeper);
                this.player2.clickCard(this.p1Keeper);
                expect(this.p1Keeper.fate).toBe(fate - 1);

                this.player1.clickCard(this.p1Keeper);
                expect(this.player1).toBeAbleToSelect(this.meditationsOnTheTao);
                this.player1.clickCard(this.meditationsOnTheTao);
                expect(this.player1).toBeAbleToSelect(this.p1Keeper);
                expect(this.player1).not.toBeAbleToSelect(this.p2Keeper);
                this.player1.clickCard(this.p1Keeper);
                expect(this.p1Keeper.fate).toBe(fate - 2);
            });

            it('Frostbitten (conditional province requirement)', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.p1Keeper],
                    defenders: [this.p2Keeper]
                });

                this.player2.clickCard(this.p2Keeper);
                expect(this.player2).toBeAbleToSelect(this.frostbittenCrossing);
                this.player2.clickCard(this.frostbittenCrossing);
                expect(this.player2).toBeAbleToSelect(this.p1Keeper);
                expect(this.player2).not.toBeAbleToSelect(this.p2Keeper);
                this.player2.clickCard(this.p1Keeper);

                this.player1.clickCard(this.p1Keeper);
                expect(this.player1).not.toBeAbleToSelect(this.frostbittenCrossing);
            });

            it('Along the River of Gold (province requires being at a water province)', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.brash],
                    defenders: [this.p2Keeper],
                    province: this.frostbittenCrossing
                });

                let mil = this.brash.getMilitarySkill();
                let pol = this.brash.getPoliticalSkill();

                this.player2.clickCard(this.p2Keeper);
                expect(this.player2).toBeAbleToSelect(this.alongTheRiverOfGold);
                this.player2.clickCard(this.alongTheRiverOfGold);
                expect(this.player2).toBeAbleToSelect(this.brash);
                this.player2.clickCard(this.brash);

                expect(this.brash.getMilitarySkill()).toBe(pol);
                expect(this.brash.getPoliticalSkill()).toBe(mil);
            });

            it('Kuroi Mori (province provides a choice, should not let opponent choose)', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.p1Keeper],
                    defenders: [this.p2Keeper]
                });

                expect(this.game.currentConflict.conflictType).toBe('military');
                this.player2.clickCard(this.p2Keeper);
                expect(this.player2).toBeAbleToSelect(this.kuroiMori);
                this.player2.clickCard(this.kuroiMori);
                expect(this.player2).toHavePromptButton('Switch the conflict type');
                expect(this.player2).toHavePromptButton('Switch the contested ring');

                this.player2.clickPrompt('Switch the conflict type');
                expect(this.game.currentConflict.conflictType).toBe('political');
            });

            it('should not allow selecting a facedown province with an action', function() {
                this.kuroiMori.facedown = true;
                this.vassalFields.facedown = true;

                this.initiateConflict({
                    type: 'military',
                    attackers: [this.challenger],
                    defenders: [this.p2Keeper]
                });

                this.player2.clickCard(this.p2Keeper);
                expect(this.player2).not.toBeAbleToSelect(this.meditationsOnTheTao);
                expect(this.player2).not.toBeAbleToSelect(this.vassalFields);
                expect(this.player2).not.toBeAbleToSelect(this.kuroiMori);
                expect(this.player2).not.toBeAbleToSelect(this.rallyToTheCause);
                expect(this.player2).not.toBeAbleToSelect(this.riotInTheStreets);
                expect(this.player2).toBeAbleToSelect(this.alongTheRiverOfGold);
                expect(this.player2).not.toBeAbleToSelect(this.frostbittenCrossing);
                expect(this.player2).toBeAbleToSelect(this.brothersGiftDojo);

                this.player2.clickPrompt('Cancel');
                this.player2.pass();

                this.player1.clickCard(this.p1Keeper);
                expect(this.player1).not.toBeAbleToSelect(this.meditationsOnTheTao);
                expect(this.player1).not.toBeAbleToSelect(this.vassalFields);
                expect(this.player1).not.toBeAbleToSelect(this.kuroiMori);
                expect(this.player1).not.toBeAbleToSelect(this.rallyToTheCause);
                expect(this.player1).not.toBeAbleToSelect(this.riotInTheStreets);
                expect(this.player1).toBeAbleToSelect(this.alongTheRiverOfGold);
                expect(this.player1).not.toBeAbleToSelect(this.frostbittenCrossing);
                expect(this.player1).toBeAbleToSelect(this.brothersGiftDojo);
            });

            it('should not allow selecting a broken province with an action', function() {
                this.kuroiMori.isBroken = true;
                this.vassalFields.isBroken = true;

                this.initiateConflict({
                    type: 'military',
                    attackers: [this.challenger],
                    defenders: [this.p2Keeper]
                });

                this.player2.clickCard(this.p2Keeper);
                expect(this.player2).not.toBeAbleToSelect(this.meditationsOnTheTao);
                expect(this.player2).not.toBeAbleToSelect(this.vassalFields);
                expect(this.player2).not.toBeAbleToSelect(this.kuroiMori);
                expect(this.player2).not.toBeAbleToSelect(this.rallyToTheCause);
                expect(this.player2).not.toBeAbleToSelect(this.riotInTheStreets);
                expect(this.player2).toBeAbleToSelect(this.alongTheRiverOfGold);
                expect(this.player2).not.toBeAbleToSelect(this.frostbittenCrossing);
                expect(this.player2).toBeAbleToSelect(this.brothersGiftDojo);

                this.player2.clickPrompt('Cancel');
                this.player2.pass();

                this.player1.clickCard(this.p1Keeper);
                expect(this.player1).not.toBeAbleToSelect(this.meditationsOnTheTao);
                expect(this.player1).not.toBeAbleToSelect(this.vassalFields);
                expect(this.player1).not.toBeAbleToSelect(this.kuroiMori);
                expect(this.player1).not.toBeAbleToSelect(this.rallyToTheCause);
                expect(this.player1).not.toBeAbleToSelect(this.riotInTheStreets);
                expect(this.player1).toBeAbleToSelect(this.alongTheRiverOfGold);
                expect(this.player1).not.toBeAbleToSelect(this.frostbittenCrossing);
                expect(this.player1).toBeAbleToSelect(this.brothersGiftDojo);
            });

            it('should not work not during a conflict', function() {
                this.player1.passConflict();
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.p1Keeper);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should not allow selecting a blanked province', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.scout],
                    defenders: [this.p2Keeper],
                    province: this.alongTheRiverOfGold
                });

                this.player2.clickCard(this.p2Keeper);
                expect(this.player2).not.toBeAbleToSelect(this.meditationsOnTheTao);
                expect(this.player2).toBeAbleToSelect(this.vassalFields);
                expect(this.player2).toBeAbleToSelect(this.kuroiMori);
                expect(this.player2).not.toBeAbleToSelect(this.rallyToTheCause);
                expect(this.player2).not.toBeAbleToSelect(this.riotInTheStreets);
                expect(this.player2).not.toBeAbleToSelect(this.alongTheRiverOfGold);
                expect(this.player2).not.toBeAbleToSelect(this.frostbittenCrossing);
                expect(this.player2).toBeAbleToSelect(this.brothersGiftDojo);

                this.player2.clickPrompt('Cancel');
                this.player2.pass();

                this.player1.clickCard(this.p1Keeper);
                expect(this.player1).not.toBeAbleToSelect(this.meditationsOnTheTao);
                expect(this.player1).toBeAbleToSelect(this.vassalFields);
                expect(this.player1).toBeAbleToSelect(this.kuroiMori);
                expect(this.player1).not.toBeAbleToSelect(this.rallyToTheCause);
                expect(this.player1).not.toBeAbleToSelect(this.riotInTheStreets);
                expect(this.player1).not.toBeAbleToSelect(this.alongTheRiverOfGold);
                expect(this.player1).not.toBeAbleToSelect(this.frostbittenCrossing);
                expect(this.player1).toBeAbleToSelect(this.brothersGiftDojo);
            });
        });
    });
});
