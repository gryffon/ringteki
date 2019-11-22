describe('Fruitful Respite', function() {
    integration(function() {
        describe('Fruitful Respite\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['asako-tsuki'],
                        hand: ['against-the-waves']
                    },
                    player2: {
                        inPlay: ['borderlands-defender'],
                        hand: ['fruitful-respite', 'fruitful-respite']
                    }
                });
                this.asakoTsuki = this.player1.findCardByName('asako-tsuki');
                this.borderlands = this.player2.findCardByName('borderlands-defender');

                this.atw = this.player1.findCardByName('against-the-waves');
                this.fruitful1 = this.player2.filterCardsByName('fruitful-respite')[0];
                this.fruitful2 = this.player2.filterCardsByName('fruitful-respite')[1];
            });

            it('should prompt you to gain two fate if opponent passes with a ready character', function() {
                let fate = this.player2.fate;
                this.noMoreActions();
                this.player1.passConflict();
                expect(this.player2).toHavePrompt('Triggered abilities');
                expect(this.player2).toBeAbleToSelect(this.fruitful1);
                this.player2.clickCard(this.fruitful1);
                expect(this.player2.fate).toBe(fate + 2);
            });

            it('should let you play more than one copy', function() {
                let fate = this.player2.fate;
                this.noMoreActions();
                this.player1.passConflict();
                expect(this.player2).toHavePrompt('Triggered abilities');
                expect(this.player2).toBeAbleToSelect(this.fruitful1);
                this.player2.clickCard(this.fruitful1);
                expect(this.player2).toBeAbleToSelect(this.fruitful2);
                this.player2.clickCard(this.fruitful2);
                expect(this.player2.fate).toBe(fate + 4);
            });

            it('should not prompt you to gain two fate if opponent passes with no ready characters', function() {
                let fate = this.player2.fate;
                this.player1.clickCard(this.atw);
                this.player1.clickCard(this.asakoTsuki);
                this.noMoreActions();
                expect(this.getChatLogs(1)).toContain('player1 passes their conflict opportunity as none of their characters can be declared as an attacker');
                expect(this.player2).not.toHavePrompt('Triggered abilities');
                expect(this.player2).not.toBeAbleToSelect(this.fruitful1);
                this.player2.clickCard(this.fruitful1);
                expect(this.player2.fate).toBe(fate);
            });

            it('should not prompt you to gain two fate if you pass with ready characters', function() {
                let fate = this.player2.fate;
                this.player1.clickCard(this.atw);
                this.player1.clickCard(this.asakoTsuki);
                this.noMoreActions();
                expect(this.getChatLogs(1)).toContain('player1 passes their conflict opportunity as none of their characters can be declared as an attacker');
                expect(this.player2).not.toHavePrompt('Triggered abilities');
                expect(this.player2).not.toBeAbleToSelect(this.fruitful1);
                this.player2.clickCard(this.fruitful1);
                expect(this.player2.fate).toBe(fate);

                this.noMoreActions();
                this.player2.passConflict();

                expect(this.player2).not.toHavePrompt('Triggered abilities');
                expect(this.player2).not.toBeAbleToSelect(this.fruitful1);
                this.player2.clickCard(this.fruitful1);
                expect(this.player2.fate).toBe(fate);
            });
        });
    });
});
