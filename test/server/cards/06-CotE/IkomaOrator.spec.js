describe('Ikoma Orator', function() {
    integration(function() {
        describe('Ikoma Orator\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['ikoma-orator'],
                        hand: ['assassination', 'banzai'],
                        honor: 12
                    },
                    player2: {
                        inPlay: ['bayushi-liar'],
                        honor: 11
                    }
                });
                this.ikomaOrator = this.player1.findCardByName('ikoma-orator');
                this.bayushiLiar = this.player2.findCardByName('bayushi-liar');
                this.assassination = this.player1.findCardByName('assassination');
                this.banzai = this.player1.findCardByName('banzai');

                this.noMoreActions();

                this.initiateConflict({
                    type: 'political',
                    attackers: [this.ikomaOrator],
                    defenders: [this.bayushiLiar]
                });
            });

            describe('when controller has more honor', function() {
                it('should have +2 political skill', function() {
                    expect(this.player1.player.honor).toBeGreaterThan(this.player2.player.honor);
                    expect(this.ikomaOrator.getPoliticalSkill()).toBe(this.ikomaOrator.getBasePoliticalSkill() + 2);
                });
            });

            describe('when controller has less honor', function() {
                it('should have base political skill', function() {
                    this.player2.pass();
                    this.player1.clickCard(this.assassination);
                    this.player1.clickCard(this.bayushiLiar);
                    expect(this.player1.player.honor).toBeLessThan(this.player2.player.honor);
                    expect(this.ikomaOrator.getPoliticalSkill()).toBe(this.ikomaOrator.getBasePoliticalSkill());
                });
            });

            describe('when controller has equal honor', function() {
                it('should have base political skill', function() {
                    this.player2.pass();
                    this.player1.clickCard(this.banzai);
                    this.player1.clickCard(this.ikomaOrator);
                    this.player1.clickPrompt('Lose 1 honor to resolve this ability again');
                    this.player1.clickCard(this.ikomaOrator);
                    this.player1.clickPrompt('Done');
                    expect(this.player1.player.honor).toBe(this.player2.player.honor);
                    expect(this.ikomaOrator.getPoliticalSkill()).toBe(this.ikomaOrator.getBasePoliticalSkill());
                });
            });
        });
    });
});
