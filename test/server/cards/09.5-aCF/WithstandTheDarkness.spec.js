describe('Withstand The Darkness', function() {
    integration(function() {
        describe('Withstand The Darkness\'s Reaction', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['crisis-breaker', 'doji-challenger'],
                        hand: ['withstand-the-darkness']
                    },
                    player2: {
                        inPlay: ['eager-scout'],
                        hand: ['way-of-the-scorpion']
                    }
                });
                this.crisisBreaker = this.player1.findCardByName('crisis-breaker');
                this.dojiChallenger = this.player1.findCardByName('doji-challenger');
                this.withstandTheDarkness = this.player1.findCardByName('withstand-the-darkness');
                this.eagerScout = this.player2.findCardByName('eager-scout');
                this.wayOfTheScorpion = this.player2.findCardByName('way-of-the-scorpion');

                this.crisisBreaker.fate = 0;

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.crisisBreaker, this.dojiChallenger],
                    defenders: [this.eagerScout]
                });
            });

            it('should react when a crab character you control is targetted by an event', function() {
                this.player2.clickCard(this.wayOfTheScorpion);
                this.player2.clickCard(this.crisisBreaker);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.withstandTheDarkness);
            });

            it('should not react when a non-crab character you control is targetted by an event', function() {
                this.player2.clickCard(this.wayOfTheScorpion);
                this.player2.clickCard(this.dojiChallenger);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not react when a crab character you don\'t control is targetted by an event', function() {
                this.player2.clickCard(this.wayOfTheScorpion);
                this.player2.clickCard(this.eagerScout);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should add a fate after a crab character you control is targetted by an event', function() {
                this.player2.clickCard(this.wayOfTheScorpion);
                this.player2.clickCard(this.crisisBreaker);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.withstandTheDarkness);
                this.player1.clickCard(this.withstandTheDarkness);
                this.player1.clickCard(this.crisisBreaker);
                expect(this.crisisBreaker.fate).toBe(1);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });
        });
    });
});
