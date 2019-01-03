describe('Shiotome Heroine', function() {
    integration(function() {
        describe('Shiotome Heroine\'s Ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'draw',
                    player1: {
                        inPlay: ['shiotome-heroine'],
                        dynastyDiscard: ['windswept-yurt']
                    },
                    player2: {
                        inPlay: ['adept-of-shadows', 'tranquil-philosopher']
                    }
                });
                this.shiotomeHeroine = this.player1.findCardByName('shiotome-heroine');
                this.windsweptYurt = this.player1.placeCardInProvince('windswept-yurt', 'province 1');
                this.shiotomeHeroine.bowed = true;

                this.adeptOfShadows = this.player2.findCardByName('adept-of-shadows');
                this.tranquilPhilosopher = this.player2.findCardByName('tranquil-philosopher');

                this.game.rings.air.fate = 1;
            });

            it('should trigger when your opponent gains 1 or more fate through a card effect (via Shiotome Heroine\'s controller card effect)', function() {
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                let honor = this.player2.player.honor;
                this.player1.clickCard(this.windsweptYurt);
                this.player1.clickPrompt('Each player gains 2 honor');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.shiotomeHeroine);
                expect(this.player2.player.honor).toBe(honor + 2);
            });

            it('should trigger when your opponent gains 1 or more fate through a card effect (via Shiotome Heroine\'s opponent card effect)', function() {
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                this.player1.pass();
                let honor = this.player2.player.honor;
                this.player2.clickCard(this.tranquilPhilosopher);
                this.player2.clickRing('air');
                this.player2.clickRing('earth');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.shiotomeHeroine);
                expect(this.player2.player.honor).toBe(honor + 1);
            });

            it('should not trigger when your opponent gains 1 or more fate through a framework effect', function() {
                let honor = this.player2.player.honor;
                this.player1.clickPrompt('2');
                this.player2.clickPrompt('1');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.player2.player.honor).toBe(honor + 1);
            });

            it('should not trigger on honor loss', function() {
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                this.player1.pass();
                let honor = this.player2.player.honor;
                this.player2.clickCard(this.adeptOfShadows);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.player2.player.honor).toBe(honor - 1);
            });

            it('should ready Shiotome Heroine', function() {
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                this.player1.clickCard(this.windsweptYurt);
                this.player1.clickPrompt('Each player gains 2 honor');
                this.player1.clickCard(this.shiotomeHeroine);
                expect(this.shiotomeHeroine.bowed).toBe(false);
            });
        });
    });
});
