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

            it('should react when a crab and non-crab character you control is targetted by an event', function() {
                this.player2.clickCard(this.wayOfTheScorpion);
                this.player2.clickCard(this.crisisBreaker);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.withstandTheDarkness);
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

        describe('Withstand The Darkness\'s Reaction (Multiple Targets)', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['eager-scout', 'hiruma-skirmisher', 'brash-samurai'],
                        hand: ['withstand-the-darkness']
                    },
                    player2: {
                        inPlay: ['eager-scout'],
                        hand: ['unfulfilled-duty', 'way-of-the-scorpion']
                    }
                });
                this.eagerScout = this.player1.findCardByName('eager-scout');
                this.hirumaSkirmisher = this.player1.findCardByName('hiruma-skirmisher');
                this.brashSamurai = this.player1.findCardByName('brash-samurai');
                this.withstandTheDarkness = this.player1.findCardByName('withstand-the-darkness');

                this.eagerScoutP2 = this.player2.findCardByName('eager-scout');
                this.unfulfilledDuty = this.player2.findCardByName('unfulfilled-duty');
                this.wayOfTheScorpion = this.player2.findCardByName('way-of-the-scorpion');

                this.eagerScout.fate = 0;
                this.hirumaSkirmisher.fate = 0;
                this.brashSamurai.fate = 0;
                this.eagerScoutP2.fate = 0;

                this.eagerScout.bowed = true;
                this.hirumaSkirmisher.bowed = true;
                this.brashSamurai.bowed = true;
                this.eagerScoutP2.bowed = true;

                this.player1.pass();
                this.player2.clickCard(this.unfulfilledDuty);
            });

            it('should react when multiple crab characters you control are targetted by an event', function() {
                this.player2.clickCard(this.eagerScout);
                this.player2.clickCard(this.hirumaSkirmisher);
                this.player2.clickPrompt('Done');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.withstandTheDarkness);
            });

            it('should let you select only targetted crab characters you control', function() {
                this.player2.clickCard(this.eagerScout);
                this.player2.clickCard(this.hirumaSkirmisher);
                this.player2.clickCard(this.brashSamurai);
                this.player2.clickCard(this.eagerScoutP2);
                this.player2.clickPrompt('Done');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.withstandTheDarkness);
                this.player1.clickCard(this.withstandTheDarkness);
                expect(this.player1).toBeAbleToSelect(this.eagerScout);
                expect(this.player1).toBeAbleToSelect(this.hirumaSkirmisher);
                expect(this.player1).not.toBeAbleToSelect(this.brashSamurai);
                expect(this.player1).not.toBeAbleToSelect(this.eagerScoutP2);
            });

            it('should not let you select crab characters you control that were not targetted', function() {
                this.player2.clickCard(this.eagerScout);
                this.player2.clickCard(this.brashSamurai);
                this.player2.clickCard(this.eagerScoutP2);
                this.player2.clickPrompt('Done');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.withstandTheDarkness);
                this.player1.clickCard(this.withstandTheDarkness);
                expect(this.player1).toBeAbleToSelect(this.eagerScout);
                expect(this.player1).not.toBeAbleToSelect(this.hirumaSkirmisher);
                expect(this.player1).not.toBeAbleToSelect(this.brashSamurai);
                expect(this.player1).not.toBeAbleToSelect(this.eagerScoutP2);
            });

            it('should not have memory when another event is played', function() {
                this.player2.clickCard(this.eagerScout);
                this.player2.clickCard(this.hirumaSkirmisher);
                this.player2.clickPrompt('Done');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.withstandTheDarkness);

                this.eagerScout.bowed = false;
                this.hirumaSkirmisher.bowed = false;
                this.brashSamurai.bowed = false;
                this.eagerScoutP2.bowed = false;

                this.player1.clickPrompt('Pass');

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.brashSamurai, this.eagerScout],
                    defenders: [this.eagerScoutP2]
                });

                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.player2.clickCard(this.wayOfTheScorpion);
                this.player2.clickCard(this.brashSamurai);
                expect(this.brashSamurai.isDishonored).toBe(true);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.player1).not.toBeAbleToSelect(this.withstandTheDarkness);
            });
        });

        describe('Withstand The Darkness\'s Reaction (Banzai)', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['eager-scout', 'hiruma-skirmisher', 'brash-samurai'],
                        hand: ['withstand-the-darkness']
                    },
                    player2: {
                        inPlay: ['eager-scout'],
                        hand: ['banzai']
                    }
                });
                this.eagerScout = this.player1.findCardByName('eager-scout');
                this.hirumaSkirmisher = this.player1.findCardByName('hiruma-skirmisher');
                this.brashSamurai = this.player1.findCardByName('brash-samurai');
                this.withstandTheDarkness = this.player1.findCardByName('withstand-the-darkness');

                this.eagerScoutP2 = this.player2.findCardByName('eager-scout');
                this.banzai = this.player2.findCardByName('banzai');

                this.eagerScout.fate = 0;
                this.hirumaSkirmisher.fate = 0;
                this.brashSamurai.fate = 0;
                this.eagerScoutP2.fate = 0;

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.eagerScout, this.hirumaSkirmisher],
                    defenders: [this.eagerScoutP2]
                });
            });

            it('should react only when banzai is finished resolving', function() {
                this.player2.clickCard(this.banzai);
                this.player2.clickCard(this.eagerScout);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).not.toBeAbleToSelect(this.withstandTheDarkness);
                this.player2.clickPrompt('Lose 1 honor to resolve this ability again');
                this.player2.clickCard(this.hirumaSkirmisher);
                this.player2.clickPrompt('Done');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.withstandTheDarkness);
                this.player1.clickCard(this.withstandTheDarkness);
                expect(this.player1).toBeAbleToSelect(this.eagerScout);
                expect(this.player1).toBeAbleToSelect(this.hirumaSkirmisher);
            });
        });
    });
});
