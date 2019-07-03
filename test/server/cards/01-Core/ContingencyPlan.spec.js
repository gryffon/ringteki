describe('Contingency Plan', function () {
    integration(function () {
        describe('In the Draw Phase, Contingency Plan', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'draw',
                    player1: {
                    },
                    player2: {
                        hand: ['contingency-plan']
                    }
                });

                this.contingencyPlan = this.player2.findCardByName('contingency-plan');
            });

            it('should allow you to increase your honor bid by 1 and draw an additional card', function () {
                let honor = this.player2.player.honor;
                let handSizeWithoutContingencyPlan = this.player2.player.hand.size() - 1;
                this.player1.clickPrompt('5');
                this.player2.clickPrompt('5');
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.contingencyPlan);
                this.player2.clickCard(this.contingencyPlan);
                this.player2.clickPrompt('Increase honor bid');
                expect(this.player2.player.honor).toBe(honor - 1);
                expect(this.player2.player.hand.size()).toBe(handSizeWithoutContingencyPlan + 5 + 1);
            });

            it('should allow you to decrease your honor bid by 1 and draw on card less', function () {
                let honor = this.player2.player.honor;
                let handSizeWithoutContingencyPlan = this.player2.player.hand.size() - 1;
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.contingencyPlan);
                this.player2.clickCard(this.contingencyPlan);
                this.player2.clickPrompt('Decrease honor bid');
                expect(this.player2.player.honor).toBe(honor + 1);
                expect(this.player2.player.hand.size()).toBe(handSizeWithoutContingencyPlan);
            });
        });

        describe('Multiple Contingency Plans', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'draw',
                    player1: {
                    },
                    player2: {
                        hand: ['contingency-plan', 'contingency-plan']
                    }
                });

                this.contingencyPlan = this.player2.findCardByName('contingency-plan');
            });

            it('should allow you to increase your honor bid accordingly', function () {
                let honor = this.player2.player.honor;
                let handSizeWithoutContingencyPlans = this.player2.player.hand.size() - 2;
                this.player1.clickPrompt('5');
                this.player2.clickPrompt('5');
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.contingencyPlan);
                this.player2.clickCard(this.contingencyPlan);
                this.player2.clickPrompt('Increase honor bid');
                this.contingencyPlan2 = this.player2.findCardByName('contingency-plan', 'hand');
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.contingencyPlan2);
                this.player2.clickCard(this.contingencyPlan2);
                this.player2.clickPrompt('Increase honor bid');
                expect(this.player2.player.honor).toBe(honor - 2);
                expect(this.player2.player.hand.size()).toBe(handSizeWithoutContingencyPlans + 5 + 2);
            });

            it('should not allow you to decrease your honor bid below 0', function () {
                let honor = this.player2.player.honor;
                let handSizeWithoutContingencyPlans = this.player2.player.hand.size() - 2;
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.contingencyPlan);
                this.player2.clickCard(this.contingencyPlan);
                this.player2.clickPrompt('Decrease honor bid');
                expect(this.getChatLogs(4)).toContain('player2 chooses to decrease their honor bid');
                this.contingencyPlan2 = this.player2.findCardByName('contingency-plan', 'hand');
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.contingencyPlan2);
                this.player2.clickCard(this.contingencyPlan2);
                expect(this.getChatLogs(4)).toContain('player2 chooses to increase their honor bid');
                expect(this.getChatLogs(6)).toContain('player1 draws 1 cards for the draw phase');
                expect(this.getChatLogs(6)).toContain('player2 draws 1 cards for the draw phase');
                expect(this.player2.player.honor).toBe(honor);
                expect(this.player2.player.hand.size()).toBe(handSizeWithoutContingencyPlans + 1);
            });
        });

        describe('During a duel, Contingency Plan', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-challenger']
                    },
                    player2: {
                        inPlay: ['mirumoto-raitsugu'],
                        hand: ['contingency-plan']
                    }
                });

                this.dojiChallenger = this.player1.findCardByName('doji-challenger');
                this.mirumotoRaitsugu = this.player2.findCardByName('mirumoto-raitsugu');
                this.contingencyPlan = this.player2.findCardByName('contingency-plan');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.dojiChallenger],
                    defenders: [this.mirumotoRaitsugu]
                });
            });

            it('should allow you to increase your honor bid by 1', function () {
                let honor = this.player2.player.honor;
                this.player2.clickCard(this.mirumotoRaitsugu);
                this.player2.clickCard(this.dojiChallenger);
                this.player1.clickPrompt('5');
                this.player2.clickPrompt('5');
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.contingencyPlan);
                this.player2.clickCard(this.contingencyPlan);
                this.player2.clickPrompt('Increase honor bid');
                expect(this.player2.player.honor).toBe(honor - 1);
                expect(this.dojiChallenger.location).toBe('dynasty discard pile');
            });

            it('should allow you to decrease your honor bid by 1 and draw on card less', function () {
                let honor = this.player2.player.honor;
                this.player2.clickCard(this.mirumotoRaitsugu);
                this.player2.clickCard(this.dojiChallenger);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.contingencyPlan);
                this.player2.clickCard(this.contingencyPlan);
                this.player2.clickPrompt('Decrease honor bid');
                expect(this.player2.player.honor).toBe(honor + 1);
                expect(this.mirumotoRaitsugu.location).toBe('dynasty discard pile');
            });
        });
    });
});
