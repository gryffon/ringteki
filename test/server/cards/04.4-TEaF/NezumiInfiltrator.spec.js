describe('Nezumi Infiltrator', function() {
    integration(function() {
        describe('Nezumi Infiltrator\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['third-tower-guard'],
                        hand: ['nezumi-infiltrator','ride-them-down'],
                        provinces: ['defend-the-wall']
                    },
                    player2: {
                        inPlay: [],
                        provinces: ['shameful-display']
                    }
                });
                this.dtw = this.player1.findCardByName('defend-the-wall', 'province 1');
                this.ttg = this.player1.findCardByName('third-tower-guard');
                this.nezumi = this.player1.findCardByName('nezumi-infiltrator');
                this.rtd = this.player1.findCardByName('ride-them-down');

                this.sd = this.player2.findCardByName('shameful-display', 'province 1');

            });

            it('should not trigger when entering play before a conflict', function() {
                this.player1.clickCard(this.nezumi);
                this.player1.clickPrompt('0');
                expect(this.player1).not.toBeAbleToSelect(this.nezumi);
                expect(this.nezumi.location).toBe('play area');
            });

            it('should trigger at home after entering play during a conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    ring: 'earth',
                    attackers: [this.ttg],
                    province: this.sd,
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.nezumi);
                this.player1.clickPrompt('0');
                this.player1.clickPrompt('Conflict');
                expect(this.nezumi.location).toBe('play area');
                expect(this.player1).toBeAbleToSelect(this.nezumi);
                this.player1.clickCard(this.nezumi);
                expect(this.player1).toHavePrompt('Raise');
            });
        });
    });
});
