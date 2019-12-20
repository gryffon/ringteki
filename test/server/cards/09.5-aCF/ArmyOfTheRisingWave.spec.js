describe('Army of the Rising Wave', function() {
    integration(function() {
        describe('Army of the Rising Wave\'s ability', function() {
            describe('Buying Character from a province', function() {
                beforeEach(function () {
                    this.setupTest({
                        phase: 'dynasty',
                        player1: {
                            dynastyDiscard: ['army-of-the-rising-wave']
                        },
                        player2: {
                            inPlay: []
                        }
                    });
                    this.army = this.player1.placeCardInProvince('army-of-the-rising-wave', 'province 1');
                });

                it('should be allowed to trigger as soon as the character is bought', function () {
                    this.player1.clickCard(this.army);
                    this.player1.clickPrompt('1');

                    expect(this.player1).toHavePrompt('Triggered Abilities');
                    expect(this.player1).toBeAbleToSelect(this.army);
                });

                it('should put a fate on all unclaimed rings', function () {
                    let airFate = this.game.rings.air.fate;
                    let earthFate = this.game.rings.earth.fate;
                    let fireFate = this.game.rings.fire.fate;
                    let voidFate = this.game.rings.void.fate;
                    let waterFate = this.game.rings.water.fate;

                    this.player1.clickCard(this.army);
                    this.player1.clickPrompt('1');

                    expect(this.player1).toHavePrompt('Triggered Abilities');
                    expect(this.player1).toBeAbleToSelect(this.army);
                    this.player1.clickCard(this.army);

                    expect(this.game.rings.air.fate).toBe(airFate + 1);
                    expect(this.game.rings.earth.fate).toBe(earthFate + 1);
                    expect(this.game.rings.fire.fate).toBe(fireFate + 1);
                    expect(this.game.rings.void.fate).toBe(voidFate + 1);
                    expect(this.game.rings.water.fate).toBe(waterFate + 1);
                });

                it('should not put a fate on a claimed ring', function () {
                    this.player1.claimRing('air');
                    this.player2.claimRing('earth');
                    let airFate = this.game.rings.air.fate;
                    let earthFate = this.game.rings.earth.fate;
                    let fireFate = this.game.rings.fire.fate;
                    let voidFate = this.game.rings.void.fate;
                    let waterFate = this.game.rings.water.fate;

                    this.player1.clickCard(this.army);
                    this.player1.clickPrompt('1');

                    expect(this.player1).toHavePrompt('Triggered Abilities');
                    expect(this.player1).toBeAbleToSelect(this.army);
                    this.player1.clickCard(this.army);

                    expect(this.game.rings.air.fate).toBe(airFate);
                    expect(this.game.rings.earth.fate).toBe(earthFate);
                    expect(this.game.rings.fire.fate).toBe(fireFate + 1);
                    expect(this.game.rings.void.fate).toBe(voidFate + 1);
                    expect(this.game.rings.water.fate).toBe(waterFate + 1);
                });
            });

            describe('Putting character into play', function() {
                beforeEach(function () {
                    this.setupTest({
                        phase: 'conflict',
                        player1: {
                            dynastyDiscard: ['army-of-the-rising-wave'],
                            inPlay: ['aranat'],
                            hand: ['charge']
                        },
                        player2: {
                            inPlay: []
                        }
                    });
                    this.army = this.player1.placeCardInProvince('army-of-the-rising-wave', 'province 1');
                    this.aranat = this.player1.findCardByName('aranat');
                    this.charge = this.player1.findCardByName('charge');
                    this.noMoreActions();
                    this.initiateConflict({
                        type: 'military',
                        ring: 'air',
                        attackers: [this.aranat],
                        defenders: []
                    });
                });

                it('should be allowed to trigger if the character is put into play from province', function () {
                    this.player2.pass();
                    this.player1.clickCard(this.charge);
                    this.player1.clickCard(this.army);

                    expect(this.player1).toHavePrompt('Triggered Abilities');
                    expect(this.player1).toBeAbleToSelect(this.army);
                });

                it('should not put a fate on contested rings', function () {
                    let airFate = this.game.rings.air.fate;
                    let earthFate = this.game.rings.earth.fate;
                    let fireFate = this.game.rings.fire.fate;
                    let voidFate = this.game.rings.void.fate;
                    let waterFate = this.game.rings.water.fate;

                    this.player2.pass();
                    this.player1.clickCard(this.charge);
                    this.player1.clickCard(this.army);

                    expect(this.player1).toHavePrompt('Triggered Abilities');
                    expect(this.player1).toBeAbleToSelect(this.army);
                    this.player1.clickCard(this.army);

                    expect(this.game.rings.air.fate).toBe(airFate);
                    expect(this.game.rings.earth.fate).toBe(earthFate + 1);
                    expect(this.game.rings.fire.fate).toBe(fireFate + 1);
                    expect(this.game.rings.void.fate).toBe(voidFate + 1);
                    expect(this.game.rings.water.fate).toBe(waterFate + 1);
                });

                it('should not put a fate on a contested or claimed ring', function () {
                    this.player1.claimRing('void');
                    this.player2.claimRing('earth');
                    let airFate = this.game.rings.air.fate;
                    let earthFate = this.game.rings.earth.fate;
                    let fireFate = this.game.rings.fire.fate;
                    let voidFate = this.game.rings.void.fate;
                    let waterFate = this.game.rings.water.fate;

                    this.player2.pass();
                    this.player1.clickCard(this.charge);
                    this.player1.clickCard(this.army);

                    expect(this.player1).toHavePrompt('Triggered Abilities');
                    expect(this.player1).toBeAbleToSelect(this.army);
                    this.player1.clickCard(this.army);

                    expect(this.game.rings.air.fate).toBe(airFate);
                    expect(this.game.rings.earth.fate).toBe(earthFate);
                    expect(this.game.rings.fire.fate).toBe(fireFate + 1);
                    expect(this.game.rings.void.fate).toBe(voidFate);
                    expect(this.game.rings.water.fate).toBe(waterFate + 1);
                });
            });
        });
    });
});
