describe('Matsu Tsuko', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['matsu-tsuko-2', 'akodo-toturi'],
                    hand: ['way-of-the-lion'],
                    honor: 12
                },
                player2: {
                    inPlay: ['mirumoto-raitsugu'],
                    provinces: ['public-forum', 'entrenched-position'],
                    honor: 10
                }
            });

            this.matsuTsuko = this.player1.findCardByName('matsu-tsuko-2');
            this.akodoToturi = this.player1.findCardByName('akodo-toturi');
            this.wayOfTheLion = this.player1.findCardByName('way-of-the-lion');

            this.mirumotoRaitsugu = this.player2.findCardByName('mirumoto-raitsugu');
            this.publicForum = this.player2.findCardByName('public-forum', 'province 1');
            this.entrenchedPosition = this.player2.findCardByName('entrenched-position', 'province 2');

            this.noMoreActions();
        });

        it('should allow you to break the province when winning and tsuko is participating', function() {
            this.initiateConflict({
                attackers: [this.matsuTsuko],
                defenders: [this.mirumotoRaitsugu],
                province: this.entrenchedPosition
            });

            this.noMoreActions();

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.matsuTsuko);

            this.player1.clickCard(this.matsuTsuko);
            expect(this.entrenchedPosition.isBroken).toBe(true);
        });

        it('should allow you to break the province when winning and tsuko is participating, even on political', function() {
            this.initiateConflict({
                attackers: [this.matsuTsuko],
                defenders: [this.mirumotoRaitsugu],
                province: this.entrenchedPosition,
                type: 'political'
            });

            this.noMoreActions();

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.matsuTsuko);

            this.player1.clickCard(this.matsuTsuko);
            expect(this.entrenchedPosition.isBroken).toBe(true);
        });

        it('should break public forum in one go', function() {
            this.initiateConflict({
                attackers: [this.matsuTsuko],
                defenders: [this.mirumotoRaitsugu],
                province: this.publicForum
            });

            this.player2.pass();
            this.player1.clickCard(this.wayOfTheLion);
            this.player1.clickCard(this.matsuTsuko);
            this.player2.pass();
            this.player1.pass();

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.matsuTsuko);

            this.player1.clickCard(this.matsuTsuko);

            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.publicForum);
            this.player2.clickCard(this.publicForum);

            expect(this.publicForum.isBroken).toBe(true);
        });

        it('should not allow you to break the province when winning and tsuko isn\'t participating', function() {
            this.initiateConflict({
                attackers: [this.akodoToturi],
                defenders: [this.mirumotoRaitsugu],
                province: this.entrenchedPosition
            });

            this.noMoreActions();

            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player1).not.toBeAbleToSelect(this.matsuTsuko);

            this.player1.clickCard(this.matsuTsuko);
            expect(this.entrenchedPosition.isBroken).toBe(false);
        });

        it('should not allow you to break the province when winning and tsuko is participating but you are less honorable', function() {
            this.player2.honor = 20;

            this.initiateConflict({
                attackers: [this.matsuTsuko],
                defenders: [this.mirumotoRaitsugu],
                province: this.entrenchedPosition
            });

            this.noMoreActions();

            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player1).not.toBeAbleToSelect(this.matsuTsuko);

            this.player1.clickCard(this.matsuTsuko);
            this.player1.clickPrompt('Don\'t Resolve');
            expect(this.entrenchedPosition.isBroken).toBe(false);
            expect(this.player1).toHavePrompt('Action Window');
        });
    });
});
