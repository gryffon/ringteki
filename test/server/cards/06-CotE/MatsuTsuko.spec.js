describe('Matsu Tsuko', function() {
    integration(function() {
        describe('Matsu Tsuko\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['matsu-tsuko','akodo-toturi'],
                        hand: ['strength-in-numbers', 'master-of-the-spear', 'sashimono'],
                        honor: 10
                    },
                    player2: {
                        inPlay: ['mirumoto-raitsugu'],
                        honor: 10
                    }
                });
                this.matsuTsuko = this.player1.findCardByName('matsu-tsuko');
                this.akodoToturi = this.player1.findCardByName('akodo-toturi');
                this.strengthInNumbers = this.player1.findCardByName('strength-in-numbers');
                this.masterOfTheSpear = this.player1.findCardByName('master-of-the-spear');
                this.sashimono = this.player1.findCardByName('sashimono');

                this.mirumotoRaitsugu = this.player2.findCardByName('mirumoto-raitsugu');
            });

            it('should not be able to be triggered outside of a conflict', function() {
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.matsuTsuko);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should not be able to be triggered if Matsu Tsuko is not participating', function() {
                this.player1.player.honor = 11;
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.akodoToturi],
                    defenders: []
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.matsuTsuko);
                expect(this.player1.player.honor > this.player2.player.honor).toBe(true);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not be able to be triggered if Matsu Tsuko is defending', function() {
                this.player1.player.honor = 11;
                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.mirumotoRaitsugu],
                    defenders: [this.matsuTsuko]
                });
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.matsuTsuko);
                expect(this.player1.player.honor > this.player2.player.honor).toBe(true);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not be able to be triggered if equally honorable as opponent', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.matsuTsuko],
                    defenders: [this.mirumotoRaitsugu]
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.matsuTsuko);
                expect(this.player1.player.honor === this.player2.player.honor).toBe(true);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not be able to be triggered if less honorable than opponent', function() {
                this.player1.player.honor = 9;
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.matsuTsuko],
                    defenders: [this.mirumotoRaitsugu]
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.matsuTsuko);
                expect(this.player1.player.honor < this.player2.player.honor).toBe(true);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should be able to be triggered if Matsu Tsuko is attacking and more honorable than opponent', function() {
                this.player1.player.honor = 11;
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.matsuTsuko],
                    defenders: [this.mirumotoRaitsugu]
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.matsuTsuko);
                expect(this.player1.player.honor > this.player2.player.honor).toBe(true);
                expect(this.player1).toHavePrompt('Waiting for opponent to take an action or pass');
            });

            describe('if it resolves', function() {
                beforeEach(function() {
                    this.player1.player.honor = 11;
                    this.noMoreActions();
                    this.initiateConflict({
                        attackers: [this.matsuTsuko],
                        defenders: [this.mirumotoRaitsugu]
                    });
                    this.player2.pass();
                    this.player1.clickCard(this.matsuTsuko);
                    this.player2.pass();
                });

                it('should reduce the cost of the next card by 2 (event)', function() {
                    let playerFate = this.player1.player.fate;
                    let expectedFateCost = Math.max(0, this.strengthInNumbers.cardData.cost - 2);
                    expect(expectedFateCost).toBe(0);
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                    this.player1.clickCard(this.strengthInNumbers);
                    this.player1.clickCard(this.mirumotoRaitsugu);
                    expect(this.player1.player.fate).toBe(playerFate - expectedFateCost);
                    expect(this.player1).toHavePrompt('Waiting for opponent to take an action or pass');
                });

                it('should reduce the cost of the next card by 2 (attachment)', function() {
                    let playerFate = this.player1.player.fate;
                    let expectedFateCost = Math.max(0, this.sashimono.cardData.cost - 2);
                    expect(expectedFateCost).toBe(0);
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                    this.player1.clickCard(this.sashimono);
                    this.player1.clickCard(this.matsuTsuko);
                    expect(this.player1.player.fate).toBe(playerFate - expectedFateCost);
                    expect(this.player1).toHavePrompt('Waiting for opponent to take an action or pass');
                });

                it('should reduce the cost of the next card by 2 (character)', function() {
                    let playerFate = this.player1.player.fate;
                    let expectedFateCost = Math.max(0, this.masterOfTheSpear.cardData.cost - 2);
                    expect(expectedFateCost).toBe(1);
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                    this.player1.clickCard(this.masterOfTheSpear);
                    this.player1.clickPrompt('0');
                    this.player1.clickPrompt('Home');
                    expect(this.player1.player.fate).toBe(playerFate - expectedFateCost);
                    expect(this.player1).toHavePrompt('Waiting for opponent to take an action or pass');
                });

                it('should only reduce the cost of the next card played', function() {
                    let playerFate = this.player1.player.fate;
                    this.player1.clickCard(this.strengthInNumbers);
                    let expectedFateCost1 = Math.max(0, this.strengthInNumbers.cardData.cost - 2);
                    expect(expectedFateCost1).toBe(0);
                    this.player1.clickCard(this.mirumotoRaitsugu);
                    this.player2.pass();
                    this.player1.clickCard(this.sashimono);
                    let expectedFateCost2 = this.sashimono.cardData.cost;
                    expect(expectedFateCost2).toBe(2);
                    this.player1.clickCard(this.akodoToturi);
                    expect(this.player1.player.fate).toBe(playerFate - expectedFateCost1 - expectedFateCost2);
                    expect(this.player1).toHavePrompt('Waiting for opponent to take an action or pass');
                });

                it('should expire after the conflict ends', function() {
                    this.player1.pass();
                    this.player1.clickPrompt('Don\'t Resolve');
                    expect(this.player1).toHavePrompt('Action Window');
                    let playerFate = this.player1.player.fate;
                    let expectedFateCost = this.sashimono.cardData.cost;
                    expect(expectedFateCost).toBe(2);
                    this.player1.clickCard(this.sashimono);
                    this.player1.clickCard(this.matsuTsuko);
                    expect(this.player1.player.fate).toBe(playerFate - expectedFateCost);
                    expect(this.player1).toHavePrompt('Waiting for opponent to take an action or pass');
                });
            });
        });
    });
});
