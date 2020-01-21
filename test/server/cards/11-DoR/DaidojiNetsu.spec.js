describe('Daidoji Netsu', function() {
    integration(function() {
        describe('Daidoji Netsu\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['daidoji-netsu', 'doji-hotaru-2', 'steadfast-witch-hunter'],
                        hand: ['way-of-the-crane', 'way-of-the-scorpion', 'noble-sacrifice', 'assassination', 'way-of-the-crab', 'seal-of-the-crab', 'charge', 'forebearer-s-echoes', 'feral-ningyo', 'adept-of-shadows'],
                        dynastyDiscard: ['funeral-pyre', 'doji-kuwanan', 'fushicho', 'isawa-ujina']
                    },
                    player2: {
                        inPlay: ['doomed-shugenja', 'steadfast-witch-hunter'],
                        hand: ['isawa-tadaka-2']
                    }
                });

                this.netsu = this.player1.findCardByName('daidoji-netsu');
                this.hotaru = this.player1.findCardByName('doji-hotaru-2');
                this.kuwanan = this.player1.findCardByName('doji-kuwanan');
                this.pyre = this.player1.findCardByName('funeral-pyre');
                this.p1WitchHunter = this.player1.findCardByName('steadfast-witch-hunter');

                this.wayOfTheCrane = this.player1.findCardByName('way-of-the-crane');
                this.wayOfTheScorpion = this.player1.findCardByName('way-of-the-scorpion');
                this.nobleSacrifice = this.player1.findCardByName('noble-sacrifice');
                this.assassination = this.player1.findCardByName('assassination');
                this.wayOfTheCrab = this.player1.findCardByName('way-of-the-crab');
                this.sealOfTheCrab = this.player1.findCardByName('seal-of-the-crab');
                this.charge = this.player1.findCardByName('charge');
                this.echoes = this.player1.findCardByName('forebearer-s-echoes');
                this.ningyo = this.player1.findCardByName('feral-ningyo');
                this.shadows = this.player1.findCardByName('adept-of-shadows');
                this.fushicho = this.player1.findCardByName('fushicho');
                this.ujina = this.player1.findCardByName('isawa-ujina');

                this.doomed = this.player2.findCardByName('doomed-shugenja');
                this.tadaka = this.player2.findCardByName('isawa-tadaka-2');
                this.p2WitchHunter = this.player2.findCardByName('steadfast-witch-hunter');

                this.player1.playAttachment(this.sealOfTheCrab, this.netsu);
                this.player1.placeCardInProvince(this.pyre, 'province 1');
                this.player1.placeCardInProvince(this.kuwanan, 'province 2');
                this.pyre.facedown = false;
                this.kuwanan.facedown = false;
                this.p2WitchHunter.bowed = true;
                this.p1WitchHunter.bowed = true;
            });

            it('should allow Netsu to be discarded (but no one else)', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.netsu],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.assassination);
                expect(this.player1).toBeAbleToSelect(this.netsu);
                expect(this.player1).not.toBeAbleToSelect(this.doomed);
            });

            it('should not allow Netsu to be used to pay the cost for Noble Sacrifice', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.netsu],
                    defenders: [this.doomed]
                });
                this.player2.pass();
                this.player1.clickCard(this.wayOfTheCrane);
                this.player1.clickCard(this.netsu);
                this.player2.pass();
                this.player1.clickCard(this.wayOfTheScorpion);
                this.player1.clickCard(this.doomed);
                this.player2.pass();
                this.player1.clickCard(this.nobleSacrifice);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not allow Netsu to be used to pay the cost for Way of the Crab', function() {
                this.player2.pass();
                this.player1.clickCard(this.wayOfTheCrab);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should allow Netsu to sacrificed for other effects', function() {
                this.player2.pass();
                this.player1.clickCard(this.pyre);
                expect(this.player1).toBeAbleToSelect(this.netsu);
                expect(this.player1).not.toBeAbleToSelect(this.hotaru);
            });

            it('should stop Hotaru and Kuwanan from killing each other', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.netsu],
                    defenders: [this.doomed]
                });
                this.player2.pass();
                this.player1.clickCard(this.charge);
                this.player1.clickCard(this.kuwanan);
                expect(this.kuwanan.location).toBe('play area');
                expect(this.hotaru.location).toBe('play area');
            });

            it('should allow disguised to be used', function() {
                this.player2.clickCard(this.tadaka);
                expect(this.player2).toHavePromptButton('Play this character with Disguise');
                expect(this.player2).toHavePromptButton('Play this character');
            });

            it('should not allow abilities to be used that require sacrificing as a cost', function() {
                this.player2.clickCard(this.p2WitchHunter);
                expect(this.player2).toHavePrompt('Action Window');
            });

            it('should only allow sacrificing Netsu to pay costs for abilities to be used that require sacrificing as a cost', function() {
                this.player2.pass();
                this.player1.clickCard(this.p1WitchHunter);
                expect(this.player1).toHavePrompt('Steadfast Witch Hunter');
                expect(this.player1).toBeAbleToSelect(this.p1WitchHunter);
                this.player1.clickCard(this.p1WitchHunter);
                expect(this.player1).toBeAbleToSelect(this.netsu);
                expect(this.player1).not.toBeAbleToSelect(this.hotaru);
            });

            it('should not allow abilities to be used that return to hand', function() {
                this.player2.pass();
                this.player1.clickCard(this.shadows);
                this.player1.clickPrompt('0');
                this.player2.pass();
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.shadows);
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.shadows.location).toBe('play area');
            });

            it('should not put ningyo back into the deck', function() {
                this.player1.fate = 0;
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.netsu],
                    defenders: [this.doomed],
                    ring: 'water'
                });
                this.player2.pass();
                this.player1.clickCard(this.ningyo);
                this.netsu.bowed = true;
                this.ningyo.bowed = true;
                this.player2.pass();
                this.player1.pass();
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.ningyo.location).toBe('play area');
            });

            it('should not put cards back into the deck after echoes', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.netsu],
                    defenders: [this.doomed],
                    ring: 'water'
                });
                this.player2.pass();
                this.player1.clickCard(this.echoes);
                this.player1.clickCard(this.fushicho);
                this.netsu.bowed = true;
                this.fushicho.bowed = true;
                this.player2.pass();
                this.player1.pass();
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.fushicho.location).toBe('play area');
            });

            it('should not allow removing cards from the game', function() {
                this.noMoreActions();
                this.netsu.fate = 1;
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.netsu],
                    defenders: [this.doomed],
                    ring: 'void'
                });
                this.player2.pass();
                this.player1.clickCard(this.echoes);
                this.player1.clickCard(this.ujina);
                this.netsu.bowed = true;
                this.ujina.bowed = true;
                this.player2.pass();
                this.player1.pass();
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.ujina.location).toBe('play area');
            });

        });

        describe('Daidoji Netsu\'s ability (Double Netsu)', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['daidoji-netsu', 'doji-hotaru-2', 'steadfast-witch-hunter'],
                        hand: ['way-of-the-crane', 'way-of-the-scorpion', 'noble-sacrifice', 'assassination', 'way-of-the-crab', 'seal-of-the-crab', 'charge'],
                        dynastyDiscard: ['funeral-pyre', 'doji-kuwanan']
                    },
                    player2: {
                        inPlay: ['doomed-shugenja', 'steadfast-witch-hunter', 'daidoji-netsu'],
                        hand: ['isawa-tadaka-2']
                    }
                });

                this.netsu = this.player1.findCardByName('daidoji-netsu');
                this.hotaru = this.player1.findCardByName('doji-hotaru-2');
                this.kuwanan = this.player1.findCardByName('doji-kuwanan');
                this.pyre = this.player1.findCardByName('funeral-pyre');
                this.p1WitchHunter = this.player1.findCardByName('steadfast-witch-hunter');

                this.wayOfTheCrane = this.player1.findCardByName('way-of-the-crane');
                this.wayOfTheScorpion = this.player1.findCardByName('way-of-the-scorpion');
                this.nobleSacrifice = this.player1.findCardByName('noble-sacrifice');
                this.assassination = this.player1.findCardByName('assassination');
                this.wayOfTheCrab = this.player1.findCardByName('way-of-the-crab');
                this.sealOfTheCrab = this.player1.findCardByName('seal-of-the-crab');
                this.charge = this.player1.findCardByName('charge');

                this.doomed = this.player2.findCardByName('doomed-shugenja');
                this.tadaka = this.player2.findCardByName('isawa-tadaka-2');
                this.p2WitchHunter = this.player2.findCardByName('steadfast-witch-hunter');

                this.player1.playAttachment(this.sealOfTheCrab, this.netsu);
                this.player1.placeCardInProvince(this.pyre, 'province 1');
                this.player1.placeCardInProvince(this.kuwanan, 'province 2');
                this.pyre.facedown = false;
                this.kuwanan.facedown = false;
                this.p2WitchHunter.bowed = true;
                this.p1WitchHunter.bowed = true;
            });

            it('should allow no one to be discarded', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.netsu],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.assassination);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not allow Netsu to be used to pay the cost for Noble Sacrifice', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.netsu],
                    defenders: [this.doomed]
                });
                this.player2.pass();
                this.player1.clickCard(this.wayOfTheCrane);
                this.player1.clickCard(this.netsu);
                this.player2.pass();
                this.player1.clickCard(this.wayOfTheScorpion);
                this.player1.clickCard(this.doomed);
                this.player2.pass();
                this.player1.clickCard(this.nobleSacrifice);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not allow Netsu to be used to pay the cost for Way of the Crab', function() {
                this.player2.pass();
                this.player1.clickCard(this.wayOfTheCrab);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should not allow Netsu to sacrificed for other effects', function() {
                this.player2.pass();
                this.player1.clickCard(this.pyre);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should stop Hotaru and Kuwanan from killing each other', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.netsu],
                    defenders: [this.doomed]
                });
                this.player2.pass();
                this.player1.clickCard(this.charge);
                this.player1.clickCard(this.kuwanan);
                expect(this.kuwanan.location).toBe('play area');
                expect(this.hotaru.location).toBe('play area');
            });

            it('should allow disguised to be used', function() {
                this.player2.clickCard(this.tadaka);
                expect(this.player2).toHavePromptButton('Play this character with Disguise');
                expect(this.player2).toHavePromptButton('Play this character');
            });

            it('should not allow abilities to be used that require sacrificing as a cost', function() {
                this.player2.clickCard(this.p2WitchHunter);
                expect(this.player2).toHavePrompt('Action Window');
                this.player2.pass();
                this.player1.clickCard(this.p2WitchHunter);
                expect(this.player1).toHavePrompt('Action Window');
            });
        });

        describe('Daidoji Netsu\'s ability (non-conflict phase)', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'fate',
                    player1: {
                        inPlay: ['daidoji-netsu', 'doji-hotaru-2', 'steadfast-witch-hunter'],
                        hand: ['way-of-the-crane', 'way-of-the-scorpion', 'noble-sacrifice', 'assassination', 'way-of-the-crab', 'seal-of-the-crab', 'charge'],
                        dynastyDiscard: ['funeral-pyre', 'doji-kuwanan']
                    },
                    player2: {
                        inPlay: ['doomed-shugenja', 'steadfast-witch-hunter'],
                        hand: ['isawa-tadaka-2']
                    }
                });

                this.netsu = this.player1.findCardByName('daidoji-netsu');
                this.hotaru = this.player1.findCardByName('doji-hotaru-2');
                this.kuwanan = this.player1.findCardByName('doji-kuwanan');
                this.pyre = this.player1.findCardByName('funeral-pyre');
                this.p1WitchHunter = this.player1.findCardByName('steadfast-witch-hunter');

                this.wayOfTheCrane = this.player1.findCardByName('way-of-the-crane');
                this.wayOfTheScorpion = this.player1.findCardByName('way-of-the-scorpion');
                this.nobleSacrifice = this.player1.findCardByName('noble-sacrifice');
                this.assassination = this.player1.findCardByName('assassination');
                this.wayOfTheCrab = this.player1.findCardByName('way-of-the-crab');
                this.sealOfTheCrab = this.player1.findCardByName('seal-of-the-crab');
                this.charge = this.player1.findCardByName('charge');

                this.doomed = this.player2.findCardByName('doomed-shugenja');
                this.tadaka = this.player2.findCardByName('isawa-tadaka-2');
                this.p2WitchHunter = this.player2.findCardByName('steadfast-witch-hunter');

                this.player1.playAttachment(this.sealOfTheCrab, this.netsu);
                this.player1.placeCardInProvince(this.pyre, 'province 1');
                this.player1.placeCardInProvince(this.kuwanan, 'province 2');
                this.pyre.facedown = false;
                this.kuwanan.facedown = false;
                this.p2WitchHunter.bowed = true;
                this.p1WitchHunter.bowed = true;
                this.doomed.dishonor();
            });

            it('should allow using noble Sacrifice', function() {
                this.player2.pass();
                this.player1.clickCard(this.wayOfTheCrane);
                this.player1.clickCard(this.netsu);
                this.player2.pass();
                this.player1.clickCard(this.nobleSacrifice);
                expect(this.player1).toHavePrompt('Noble Sacrifice');
            });

            it('should allow Way of the Crab', function() {
                this.player2.pass();
                this.player1.clickCard(this.wayOfTheCrab);
                expect(this.player1).toHavePrompt('Way of the Crab');
            });

            it('should allow any character to be sacrificed for effects', function() {
                this.player2.pass();
                this.player1.clickCard(this.pyre);
                expect(this.player1).toBeAbleToSelect(this.netsu);
                expect(this.player1).toBeAbleToSelect(this.hotaru);
            });

            it('should allow abilities to be used that require sacrificing as a cost', function() {
                this.player2.clickCard(this.p2WitchHunter);
                expect(this.player2).toHavePrompt('Steadfast Witch Hunter');
            });
        });
    });
});
