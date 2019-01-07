describe('Ide Negotiator', function() {
    integration(function() {
        describe('Ide Negotiator\'s Ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'draw',
                    player1: {
                        inPlay: ['ide-negotiator']
                    }
                });
                this.ideNegotiator = this.player1.findCardByName('ide-negotiator');
            });

            it('should trigger when honor dials are revealed', function() {
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.ideNegotiator);
            });

            it('should prompt to increase or decrease the bid', function() {
                this.player1.clickPrompt('3');
                this.player2.clickPrompt('3');
                this.player1.clickCard(this.ideNegotiator);
                expect(this.player1).toHavePromptButton('Increase bid by 1');
                expect(this.player1).toHavePromptButton('Decrease bid by 1');
            });

            it('should only prompt to increase if current bid is 1', function() {
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('3');
                this.player1.clickCard(this.ideNegotiator);
                expect(this.player1).toHavePromptButton('Increase bid by 1');
                expect(this.player1).not.toHavePromptButton('Decrease bid by 1');
            });

            it('should only prompt to decrease if current bid is 5', function() {
                this.player1.clickPrompt('5');
                this.player2.clickPrompt('3');
                this.player1.clickCard(this.ideNegotiator);
                expect(this.player1).not.toHavePromptButton('Increase bid by 1');
                expect(this.player1).toHavePromptButton('Decrease bid by 1');
            });

            it('should increase the bid by 1 if chosen', function() {
                this.player1.clickPrompt('2');
                this.player2.clickPrompt('2');
                this.player1.clickCard(this.ideNegotiator);
                this.player1.clickPrompt('Increase bid by 1');
                expect(this.player1.player.honorBid).toBe(3);
            });

            it('should decrease the bid by 1 if chosen', function() {
                this.player1.clickPrompt('3');
                this.player2.clickPrompt('2');
                this.player1.clickCard(this.ideNegotiator);
                this.player1.clickPrompt('Decrease bid by 1');
                expect(this.player1.player.honorBid).toBe(2);
            });
        });
    });
});
