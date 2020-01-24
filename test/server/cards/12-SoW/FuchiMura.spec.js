describe('Fuchi Mura', function() {
    integration(function() {
        describe('Fuchi Mura\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['matsu-berserker']
                    },
                    player2: {
                        hand: ['talisman-of-the-sun'],
                        provinces: ['manicured-garden', 'fuchi-mura']
                    }
                });
                this.matsuBerserker = this.player1.findCardByName('matsu-berserker');
                this.talisman = this.player2.findCardByName('talisman-of-the-sun');
                this.mura = this.player2.findCardByName('fuchi-mura');
                this.player1.pass();
                this.player2.playAttachment(this.talisman, this.matsuBerserker);
            });

            it('should trigger when attackers are declared', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['matsu-berserker'],
                    province: 'fuchi-mura'
                });
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect('fuchi-mura');
            });

            it('should put a fate on each unclaimed ring', function() {
                let airFate = this.game.rings.air.fate;
                let earthFate = this.game.rings.earth.fate;
                let fireFate = this.game.rings.fire.fate;
                let voidFate = this.game.rings.void.fate;
                let waterFate = this.game.rings.water.fate;

                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['matsu-berserker'],
                    province: 'fuchi-mura',
                    ring: 'air'
                });
                this.player2.clickCard('fuchi-mura');

                expect(this.game.rings.air.fate).toBe(airFate);
                expect(this.game.rings.earth.fate).toBe(earthFate + 1);
                expect(this.game.rings.fire.fate).toBe(fireFate + 1);
                expect(this.game.rings.void.fate).toBe(voidFate + 1);
                expect(this.game.rings.water.fate).toBe(waterFate + 1);
            });

            it('should not trigger if you move the conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['matsu-berserker'],
                    defenders: [],
                    province: 'manicured-garden'
                });
                this.player2.clickCard(this.talisman);
                expect(this.player2).toHavePrompt('Talisman of the Sun');
                expect(this.player2).toBeAbleToSelect(this.mura);
                this.player2.clickCard(this.mura);
                expect(this.game.currentConflict.conflictProvince).toBe(this.mura);

                expect(this.player2).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });
        });
    });
});
