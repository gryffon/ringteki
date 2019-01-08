describe('Yasuki Procurer', function() {
    integration(function() {
        describe('Yasuki Procurer\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'draw',
                    player1: {
                        inPlay: ['yasuki-procurer'],
                        hand: ['strength-in-numbers', 'master-of-the-spear', 'watch-commander']
                    },
                    player2: {
                        inPlay: ['bayushi-manipulator'],
                        hand: ['way-of-the-scorpion']
                    }
                });
                this.yasukiProcurer = this.player1.findCardByName('yasuki-procurer');
                this.strengthInNumbers = this.player1.findCardByName('strength-in-numbers');
                this.masterOfTheSpear = this.player1.findCardByName('master-of-the-spear');
                this.watchCommander = this.player1.findCardByName('watch-commander');

                this.bayushiManipulator = this.player2.findCardByName('bayushi-manipulator');
                this.wayOfTheScorpion = this.player2.findCardByName('way-of-the-scorpion');
                this.player1.clickPrompt('5');
                this.player2.clickPrompt('5');
                this.player2.clickPrompt('Pass');
            });

            it('should be able to be triggered if Yasuki Procurer is not dishonored', function() {
                expect(this.yasukiProcurer.isDishonored).toBe(false);
                this.player1.clickCard(this.yasukiProcurer);
                expect(this.yasukiProcurer.isDishonored).toBe(true);
                expect(this.player1).toHavePrompt('Waiting for opponent to take an action or pass');
            });

            it('should not carry over after the phase ends', function() {
                this.player1.clickCard(this.yasukiProcurer);
                expect(this.yasukiProcurer.isDishonored).toBe(true);
                this.noMoreActions();
                expect(this.game.currentPhase).toBe('conflict');
                let playerFate = this.player1.player.fate;
                let expectedFateCost = this.watchCommander.cardData.cost;
                expect(expectedFateCost).toBe(1);
                this.player1.clickCard(this.watchCommander);
                this.player1.clickCard(this.yasukiProcurer);
                expect(this.player1.player.fate).toBe(playerFate - expectedFateCost);
                expect(this.player1).toHavePrompt('Waiting for opponent to take an action or pass');
            });

            it('should not be able to be triggered if Yasuki Procurer is already dishonored', function() {
                this.noMoreActions();
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.yasukiProcurer],
                    defenders: [this.bayushiManipulator]
                });
                this.player2.clickCard(this.wayOfTheScorpion);
                this.player2.clickCard(this.yasukiProcurer);
                expect(this.yasukiProcurer.isDishonored).toBe(true);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.yasukiProcurer);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            describe('if it resolves', function() {
                beforeEach(function() {
                    this.noMoreActions();
                    this.noMoreActions();
                    this.initiateConflict({
                        attackers: [this.yasukiProcurer],
                        defenders: [this.bayushiManipulator]
                    });
                    this.player2.pass();
                    this.player1.clickCard(this.yasukiProcurer);
                    this.player2.pass();
                });

                it('should reduce the cost of the next attachment by 1', function() {
                    let playerFate = this.player1.player.fate;
                    let expectedFateCost = Math.max(0, this.watchCommander.cardData.cost - 1);
                    expect(expectedFateCost).toBe(0);
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                    this.player1.clickCard(this.watchCommander);
                    this.player1.clickCard(this.yasukiProcurer);
                    expect(this.player1.player.fate).toBe(playerFate - expectedFateCost);
                    expect(this.player1).toHavePrompt('Waiting for opponent to take an action or pass');
                });

                it('should reduce the cost of the next character by 1', function() {
                    let playerFate = this.player1.player.fate;
                    let expectedFateCost = Math.max(0, this.masterOfTheSpear.cardData.cost - 1);
                    expect(expectedFateCost).toBe(2);
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                    this.player1.clickCard(this.masterOfTheSpear);
                    this.player1.clickPrompt('0');
                    this.player1.clickPrompt('Home');
                    expect(this.player1.player.fate).toBe(playerFate - expectedFateCost);
                    expect(this.player1).toHavePrompt('Waiting for opponent to take an action or pass');
                });

                it('should not reduce the cost of the next event card by 1', function() {
                    let playerFate = this.player1.player.fate;
                    let expectedFateCost = this.strengthInNumbers.cardData.cost;
                    expect(expectedFateCost).toBe(1);
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                    this.player1.clickCard(this.strengthInNumbers);
                    this.player1.clickCard(this.bayushiManipulator);
                    expect(this.player1.player.fate).toBe(playerFate - expectedFateCost);
                    expect(this.player1).toHavePrompt('Waiting for opponent to take an action or pass');
                });

                it('should only reduce the cost of the next card played', function() {
                    let playerFate = this.player1.player.fate;
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                    this.player1.clickCard(this.masterOfTheSpear);
                    this.player1.clickPrompt('0');
                    this.player1.clickPrompt('Home');
                    let expectedFateCost1 = Math.max(0, this.masterOfTheSpear.cardData.cost - 1);
                    expect(expectedFateCost1).toBe(2);
                    this.player2.pass();
                    this.player1.clickCard(this.watchCommander);
                    let expectedFateCost2 = this.watchCommander.cardData.cost;
                    expect(expectedFateCost2).toBe(1);
                    this.player1.clickCard(this.yasukiProcurer);
                    expect(this.player1.player.fate).toBe(playerFate - expectedFateCost1 - expectedFateCost2);
                    expect(this.player1).toHavePrompt('Waiting for opponent to take an action or pass');
                });
            });
        });
    });
});
