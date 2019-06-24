describe('Ascetic Visionary', function () {
    integration(function () {
        describe('Ascetic Visionary\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['ascetic-visionary', 'togashi-initiate', 'togashi-yokuni', 'mirumoto-raitsugu'],
                        hand: ['tattooed-wanderer']
                    },
                    player2: {
                        inPlay: ['keeper-initiate', 'miya-mystic']
                    }
                });
                this.asceticVisionary = this.player1.findCardByName('ascetic-visionary');
                this.togashiInitiate = this.player1.findCardByName('togashi-initiate');
                this.togashiYokuni = this.player1.findCardByName('togashi-yokuni');
                this.tattooedWanderer = this.player1.findCardByName('tattooed-wanderer');
                this.mirumotoRaitsugu = this.player1.findCardByName('mirumoto-raitsugu');
                this.keeperInitiate = this.player2.findCardByName('keeper-initiate');
                this.miyaMystic = this.player2.findCardByName('miya-mystic');

                this.togashiYokuni.bowed = true;
                this.mirumotoRaitsugu.bowed = true;
                this.keeperInitiate.bowed = true;

                this.player1.clickCard(this.tattooedWanderer);
                this.player1.clickPrompt('Play Tattooed Wanderer as an attachment');
                this.player1.clickCard(this.togashiYokuni);
                this.noMoreActions();
            });

            it('should be able to choose any bowed Monk or character with a monk attachment', function () {
                this.initiateConflict({
                    attackers: [this.asceticVisionary],
                    defenders: []
                });
                this.asceticVisionary.bowed = true;
                this.player2.pass();
                this.player1.clickCard(this.asceticVisionary);
                expect(this.player1).toHavePrompt('Ascetic Visionary');
                expect(this.player1).toBeAbleToSelect(this.asceticVisionary);
                expect(this.player1).not.toBeAbleToSelect(this.togashiInitiate);
                expect(this.player1).toBeAbleToSelect(this.togashiYokuni);
                expect(this.player1).not.toBeAbleToSelect(this.mirumotoRaitsugu);
                expect(this.player1).toBeAbleToSelect(this.keeperInitiate);
                expect(this.player1).not.toBeAbleToSelect(this.miyaMystic);
            });

            it('should ready the monk and put a fate onto the chosen unclaimed ring', function () {
                let playerFate = this.player1.player.fate;
                let airFate = this.game.rings.air.fate;
                this.initiateConflict({
                    ring: 'fire',
                    attackers: [this.asceticVisionary],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.asceticVisionary);
                expect(this.player1).toHavePrompt('Ascetic Visionary');
                this.player1.clickCard(this.togashiYokuni);
                expect(this.player1).toHavePrompt('Select a ring to place fate on');
                expect(this.player1).toBeAbleToSelectRing('air');
                expect(this.player1).toBeAbleToSelectRing('earth');
                expect(this.player1).toBeAbleToSelectRing('water');
                expect(this.player1).toBeAbleToSelectRing('void');
                expect(this.player1).not.toBeAbleToSelectRing('fire');
                this.player1.clickRing('air');
                expect(this.togashiYokuni.bowed).toBe(false);
                expect(this.player1.player.fate).toBe(playerFate - 1);
                expect(this.game.rings.air.fate).toBe(airFate + 1);
            });

            it('should not be able to trigger as the defender', function () {
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.miyaMystic],
                    defenders: [this.asceticVisionary]
                });
                this.player1.clickCard(this.asceticVisionary);
                expect(this.player1).not.toHavePrompt('Ascetic Visionary');
            });

            it('should not be able to trigger when at home', function () {
                this.mirumotoRaitsugu.bowed = false;
                this.initiateConflict({
                    attackers: [this.mirumotoRaitsugu],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.asceticVisionary);
                expect(this.player1).not.toHavePrompt('Ascetic Visionary');
            });
        });
    });
});
