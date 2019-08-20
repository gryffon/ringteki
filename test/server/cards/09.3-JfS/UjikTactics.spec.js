describe('Ujik Tactics', function () {
    integration(function () {
        describe('Ujik Tactics\'s action ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['border-rider', 'moto-nergui', 'iuchi-wayfinder', 'shinjo-ambusher'],
                        hand: ['ujik-tactics']
                    },
                    player2: {
                        inPlay: ['goblin-sneak']
                    }
                });

                this.borderRider = this.player1.findCardByName('border-rider');
                this.motoNergui = this.player1.findCardByName('moto-nergui');
                this.shinjoAmbusher = this.player1.findCardByName('shinjo-ambusher');
                this.iuchiWayfinder = this.player1.findCardByName('iuchi-wayfinder');
                this.ujikTactics = this.player1.findCardByName('ujik-tactics');
                this.goblin = this.player2.findCardByName('goblin-sneak');

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.borderRider, this.motoNergui, this.iuchiWayfinder],
                    defenders: [this.goblin]
                });
            });

            it('should give all non-unique character +1 military', function() {
                this.player2.pass();
                this.player1.clickCard(this.ujikTactics);

                expect(this.borderRider.getMilitarySkill()).toBe(3);
                expect(this.iuchiWayfinder.getMilitarySkill()).toBe(2);
                expect(this.shinjoAmbusher.getMilitarySkill()).toBe(3);

                expect(this.motoNergui.getMilitarySkill()).toBe(2);
            });
        });
    });
});
