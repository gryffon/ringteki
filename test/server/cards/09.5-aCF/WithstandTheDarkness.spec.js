describe('Withstand The Darkness', function() {
    integration(function() {
        describe('Withstand The Darkness\'s Reaction', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['crisis-breaker', 'doji-challenger'],
                        hand: ['withstand-the-darkness', 'withstand-the-darkness', 'way-of-the-scorpion']
                    },
                    player2: {
                        inPlay: ['eager-scout', 'doji-kuwanan'],
                        hand: ['way-of-the-scorpion', 'way-of-the-scorpion']
                    }
                });
                this.crisisBreaker = this.player1.findCardByName('crisis-breaker');
                this.dojiChallenger = this.player1.findCardByName('doji-challenger');
                this.withstandTheDarkness = this.player1.filterCardsByName('withstand-the-darkness')[0];
                this.withstandTheDarkness2 = this.player1.filterCardsByName('withstand-the-darkness')[1];
                this.eagerScout = this.player2.findCardByName('eager-scout');
                this.dojiKuwanan = this.player2.findCardByName('doji-kuwanan');
                this.wayOfTheScorpion = this.player2.filterCardsByName('way-of-the-scorpion')[0];
                this.wayOfTheScorpion2 = this.player2.filterCardsByName('way-of-the-scorpion')[1];
                this.p1wayOfTheScorpion = this.player1.findCardByName('way-of-the-scorpion');

                this.crisisBreaker.honor();
                this.crisisBreaker.fate = 0;

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.crisisBreaker, this.dojiChallenger],
                    defenders: [this.eagerScout, this.dojiKuwanan]
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

            it('should not react when you target a crab character you control', function() {
                this.player2.pass();
                this.player1.clickCard(this.p1wayOfTheScorpion);
                this.player1.clickCard(this.crisisBreaker);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should not react when a crab character you control is targetted by a non-event', function() {
                this.player2.clickCard(this.dojiKuwanan);
                this.player2.clickCard(this.crisisBreaker);
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

            it('should not be playable twice', function() {
                this.player2.clickCard(this.wayOfTheScorpion);
                this.player2.clickCard(this.crisisBreaker);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.withstandTheDarkness);
                expect(this.player1).toBeAbleToSelect(this.withstandTheDarkness2);
                this.player1.clickCard(this.withstandTheDarkness);
                this.player1.clickCard(this.crisisBreaker);
                expect(this.crisisBreaker.fate).toBe(1);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.player1).not.toBeAbleToSelect(this.withstandTheDarkness2);
                this.player1.pass();
                this.player2.clickCard(this.wayOfTheScorpion2);
                this.player2.clickCard(this.crisisBreaker);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });
        });

        describe('Withstand The Darkness\'s Reaction (Edge Cases)', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['crisis-breaker', 'hida-guardian'],
                        hand: ['withstand-the-darkness', 'voice-of-honor']
                    },
                    player2: {
                        inPlay: ['eager-scout'],
                        hand: ['way-of-the-scorpion', 'civil-discourse'],
                        conflictDiscard: ['defend-your-honor']
                    }
                });
                this.crisisBreaker = this.player1.findCardByName('crisis-breaker');
                this.hidaGuardian = this.player1.findCardByName('hida-guardian');
                this.withstandTheDarkness = this.player1.findCardByName('withstand-the-darkness');
                this.eagerScout = this.player2.findCardByName('eager-scout');
                this.wayOfTheScorpion = this.player2.findCardByName('way-of-the-scorpion');
                this.voice = this.player1.findCardByName('voice-of-honor');
                this.dyh = this.player2.findCardByName('defend-your-honor');
                this.civilDiscourse = this.player2.findCardByName('civil-discourse');

                this.crisisBreaker.honor();
                this.crisisBreaker.fate = 0;

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.crisisBreaker, this.hidaGuardian],
                    defenders: [this.eagerScout]
                });
            });

            it('should react even if the event is cancelled', function() {
                this.player2.clickCard(this.wayOfTheScorpion);
                this.player2.clickCard(this.crisisBreaker);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.voice);
                expect(this.player1).not.toBeAbleToSelect(this.withstandTheDarkness);
                this.player1.clickCard(this.voice);
                expect(this.voice.location).toBe('conflict discard pile');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.withstandTheDarkness);
                this.player1.clickCard(this.withstandTheDarkness);
                expect(this.player1).toBeAbleToSelect(this.crisisBreaker);
            });

            it('should react properly on duels where you choose the target', function() {
                this.player2.clickCard(this.civilDiscourse);
                this.player2.clickCard(this.eagerScout);
                this.player1.clickCard(this.crisisBreaker);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.voice);
                this.player1.pass();
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.withstandTheDarkness);
                this.player1.clickCard(this.withstandTheDarkness);
                expect(this.player1).toBeAbleToSelect(this.crisisBreaker);
            });

            it('should react properly on nested events', function() {
                this.player2.moveCard(this.dyh, 'hand');
                this.player2.clickCard(this.wayOfTheScorpion);
                this.player2.clickCard(this.crisisBreaker);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.voice);
                expect(this.player1).not.toBeAbleToSelect(this.withstandTheDarkness);
                this.player1.clickCard(this.voice);

                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.dyh);
                this.player2.clickCard(this.dyh);
                this.player2.clickCard(this.eagerScout);
                this.player1.clickCard(this.hidaGuardian);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.withstandTheDarkness);
                this.player1.clickCard(this.withstandTheDarkness);
                expect(this.player1).toBeAbleToSelect(this.hidaGuardian);
                expect(this.player1).not.toBeAbleToSelect(this.crisisBreaker);
                this.player1.clickPrompt('Cancel');
                this.player1.clickPrompt('Pass');

                expect(this.voice.location).toBe('conflict discard pile');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.withstandTheDarkness);
                this.player1.clickCard(this.withstandTheDarkness);
                expect(this.player1).toBeAbleToSelect(this.crisisBreaker);
                expect(this.player1).not.toBeAbleToSelect(this.hidaGuardian);
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
                        hand: ['banzai', 'banzai']
                    }
                });
                this.eagerScout = this.player1.findCardByName('eager-scout');
                this.hirumaSkirmisher = this.player1.findCardByName('hiruma-skirmisher');
                this.brashSamurai = this.player1.findCardByName('brash-samurai');
                this.withstandTheDarkness = this.player1.findCardByName('withstand-the-darkness');

                this.eagerScoutP2 = this.player2.findCardByName('eager-scout');
                this.banzai = this.player2.filterCardsByName('banzai')[0];
                this.banzai2 = this.player2.filterCardsByName('banzai')[1];

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
                this.player2.clickPrompt('Lose 1 honor to resolve this ability again');
                this.player2.clickCard(this.hirumaSkirmisher);
                this.player2.clickPrompt('Done');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.withstandTheDarkness);
                this.player1.clickCard(this.withstandTheDarkness);
                expect(this.player1).toBeAbleToSelect(this.hirumaSkirmisher);
                expect(this.player1).toBeAbleToSelect(this.eagerScout);
            });

            it('should react if banzai is split between opponent and your character', function() {
                this.player2.clickCard(this.banzai);
                this.player2.clickCard(this.eagerScoutP2);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                this.player2.clickPrompt('Lose 1 honor to resolve this ability again');
                this.player2.clickCard(this.hirumaSkirmisher);
                this.player2.clickPrompt('Done');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.withstandTheDarkness);
                this.player1.clickCard(this.withstandTheDarkness);
                expect(this.player1).toBeAbleToSelect(this.hirumaSkirmisher);
            });

            it('should react if banzai is split between opponent and your character (reversed targets)', function() {
                this.player2.clickCard(this.banzai);
                this.player2.clickCard(this.hirumaSkirmisher);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                this.player2.clickPrompt('Lose 1 honor to resolve this ability again');
                this.player2.clickCard(this.eagerScoutP2);
                this.player2.clickPrompt('Done');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.withstandTheDarkness);
                this.player1.clickCard(this.withstandTheDarkness);
                expect(this.player1).toBeAbleToSelect(this.hirumaSkirmisher);
            });

            it('should not have banzai memory', function() {
                this.player2.clickCard(this.banzai);
                this.player2.clickCard(this.eagerScout);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                this.player2.clickPrompt('Lose 1 honor to resolve this ability again');
                this.player2.clickCard(this.hirumaSkirmisher);
                this.player2.clickPrompt('Done');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.withstandTheDarkness);
                this.player1.clickCard(this.withstandTheDarkness);
                expect(this.player1).toBeAbleToSelect(this.hirumaSkirmisher);
                expect(this.player1).toBeAbleToSelect(this.eagerScout);
                this.player1.clickPrompt('Cancel');
                this.player1.pass();

                this.noMoreActions();
                this.player1.clickPrompt('No');
                this.player1.clickPrompt('Don\'t Resolve');

                this.eagerScout.bowed = false;
                this.hirumaSkirmisher.bowed = false;
                this.eagerScoutP2.bowed = false;

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.eagerScoutP2],
                    defenders: [this.eagerScout, this.hirumaSkirmisher],
                    ring: 'fire'
                });

                this.player1.pass();
                this.player2.clickCard(this.banzai2);
                this.player2.clickCard(this.eagerScoutP2);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                this.player2.clickPrompt('Lose 1 honor to resolve this ability again');
                this.player2.clickCard(this.eagerScoutP2);
                this.player2.clickPrompt('Done');
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });
        });

        describe('Withstand The Darkness\'s Reaction (Banzai Edge Cases)', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['crisis-breaker', 'hida-guardian', 'hiruma-skirmisher'],
                        hand: ['withstand-the-darkness', 'voice-of-honor']
                    },
                    player2: {
                        inPlay: ['eager-scout'],
                        hand: ['banzai'],
                        conflictDiscard: ['defend-your-honor']
                    }
                });
                this.crisisBreaker = this.player1.findCardByName('crisis-breaker');
                this.hidaGuardian = this.player1.findCardByName('hida-guardian');
                this.hirumaSkirmisher = this.player1.findCardByName('hiruma-skirmisher');
                this.withstandTheDarkness = this.player1.findCardByName('withstand-the-darkness');
                this.eagerScout = this.player2.findCardByName('eager-scout');
                this.banzai = this.player2.findCardByName('banzai');
                this.voice = this.player1.findCardByName('voice-of-honor');
                this.dyh = this.player2.findCardByName('defend-your-honor');

                this.crisisBreaker.honor();
                this.crisisBreaker.fate = 0;

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.crisisBreaker, this.hidaGuardian, this.hirumaSkirmisher],
                    defenders: [this.eagerScout]
                });
            });

            it('should react even if banzai is cancelled', function() {
                this.player2.clickCard(this.banzai);
                this.player2.clickCard(this.crisisBreaker);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.voice);
                expect(this.player1).not.toBeAbleToSelect(this.withstandTheDarkness);
                this.player1.clickCard(this.voice);
                expect(this.voice.location).toBe('conflict discard pile');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.withstandTheDarkness);
                this.player1.clickCard(this.withstandTheDarkness);
                expect(this.player1).toBeAbleToSelect(this.crisisBreaker);
            });

            it('should react properly if banzai kicker is cancelled', function() {
                this.player2.clickCard(this.banzai);
                this.player2.clickCard(this.crisisBreaker);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.pass();
                this.player2.clickPrompt('Lose 1 honor to resolve this ability again');
                this.player2.clickCard(this.hidaGuardian);

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.voice);
                expect(this.player1).not.toBeAbleToSelect(this.withstandTheDarkness);
                this.player1.clickCard(this.voice);
                expect(this.voice.location).toBe('conflict discard pile');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.withstandTheDarkness);
                this.player1.clickCard(this.withstandTheDarkness);
                expect(this.player1).toBeAbleToSelect(this.crisisBreaker);
                expect(this.player1).toBeAbleToSelect(this.hidaGuardian);
            });

            it('should react properly when banzai is nested', function() {
                this.player2.moveCard(this.dyh, 'hand');
                this.player2.clickCard(this.banzai);
                this.player2.clickCard(this.crisisBreaker);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.pass();
                this.player2.clickPrompt('Lose 1 honor to resolve this ability again');
                this.player2.clickCard(this.hidaGuardian);

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.voice);
                expect(this.player1).not.toBeAbleToSelect(this.withstandTheDarkness);
                this.player1.clickCard(this.voice);

                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.dyh);
                this.player2.clickCard(this.dyh);
                this.player2.clickCard(this.eagerScout);
                this.player1.clickCard(this.hirumaSkirmisher);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.withstandTheDarkness);
                this.player1.clickCard(this.withstandTheDarkness);
                expect(this.player1).toBeAbleToSelect(this.hirumaSkirmisher);
                expect(this.player1).not.toBeAbleToSelect(this.crisisBreaker);
                expect(this.player1).not.toBeAbleToSelect(this.hidaGuardian);
                this.player1.clickPrompt('Cancel');
                this.player1.clickPrompt('Pass');

                expect(this.voice.location).toBe('conflict discard pile');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.withstandTheDarkness);
                this.player1.clickCard(this.withstandTheDarkness);
                expect(this.player1).toBeAbleToSelect(this.crisisBreaker);
                expect(this.player1).toBeAbleToSelect(this.hidaGuardian);
                expect(this.player1).not.toBeAbleToSelect(this.hirumaSkirmisher);
            });
        });
    });
});
