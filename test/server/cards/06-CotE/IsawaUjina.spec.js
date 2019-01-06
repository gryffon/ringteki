describe('Isawa Ujina', function() {
    integration(function() {
        describe('Isawa Ujina\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['isawa-ujina', 'adept-of-the-waves', 'fushicho'],
                        hand: ['know-the-world', 'know-the-world']
                    },
                    player2: {
                        inPlay: ['callow-delegate', 'doji-challenger', 'doji-hotaru']
                    }
                });
                this.isawaUjina = this.player1.findCardByName('isawa-ujina');
                this.adeptOfTheWaves = this.player1.findCardByName('adept-of-the-waves');
                this.fushicho = this.player1.findCardByName('fushicho');
                let knowTheWorlds = this.player1.filterCardsByName('know-the-world');
                this.knowTheWorld1 = knowTheWorlds[0];
                this.knowTheWorld2 = knowTheWorlds[1];

                this.callowDelegate = this.player2.findCardByName('callow-delegate');
                this.dojiChallenger = this.player2.findCardByName('doji-challenger');
                this.dojiChallenger.fate = 1;
                this.dojiHotaru = this.player2.findCardByName('doji-hotaru');
                this.dojiHotaru.fate = 2;
            });

            it('should trigger after the void ring is claimed (by controller)', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.isawaUjina],
                    defenders: [this.callowDelegate],
                    ring: 'void'
                });
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Void Ring');
                expect(this.player1).toBeAbleToSelect(this.dojiChallenger);
                expect(this.player1).toBeAbleToSelect(this.dojiHotaru);
                this.player1.clickCard(this.dojiChallenger);
                expect(this.player1).toHavePrompt('Isawa Ujina');
            });

            it('should trigger after the void ring is claimed (by opponent)', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.isawaUjina],
                    defenders: [this.dojiHotaru],
                    ring: 'void'
                });
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Isawa Ujina');
            });

            describe('when triggered', function() {
                beforeEach(function() {
                    this.noMoreActions();
                    this.initiateConflict({
                        attackers: [this.isawaUjina],
                        defenders: [this.callowDelegate],
                        type: 'political',
                        ring: 'void'
                    });
                    this.noMoreActions();
                    this.player1.clickPrompt('No');
                    this.player1.clickCard(this.dojiChallenger);
                });

                it('should only be able to target a character with no fate', function() {
                    expect(this.player1).toHavePrompt('Isawa Ujina');
                    expect(this.player1).toBeAbleToSelect(this.isawaUjina);
                    expect(this.player1).toBeAbleToSelect(this.callowDelegate);
                    expect(this.player1).toBeAbleToSelect(this.dojiChallenger);
                    expect(this.player1).not.toBeAbleToSelect(this.dojiHotaru);
                });

                it('should remove the target from the game', function() {
                    this.player1.clickCard(this.dojiChallenger);
                    expect(this.dojiChallenger.location).toBe('removed from game');
                });

                it('should trigger \'leaves play\' triggers', function() {
                    this.player1.clickCard(this.callowDelegate);
                    expect(this.player2).toHavePrompt('Triggered Abilities');
                    expect(this.player2).toBeAbleToSelect(this.callowDelegate);
                });
            });

            it('should trigger multiple times', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.isawaUjina],
                    defenders: [this.dojiChallenger],
                    type: 'political',
                    ring: 'void'
                });
                this.noMoreActions();
                this.player1.clickCard(this.dojiChallenger);
                expect(this.player1).toHavePrompt('Isawa Ujina');
                this.player1.clickCard(this.dojiChallenger);
                expect(this.dojiChallenger.location).toBe('removed from game');
                this.player1.clickCard(this.knowTheWorld1);
                this.player1.clickRing('void');
                this.player1.clickRing('air');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.callowDelegate],
                    defenders: [this.adeptOfTheWaves],
                    type: 'political',
                    ring: 'void'
                });
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Isawa Ujina');
                this.player1.clickCard(this.callowDelegate);
                this.player2.clickPrompt('Pass');
                expect(this.callowDelegate.location).toBe('removed from game');
                this.player1.clickCard(this.knowTheWorld2);
                this.player1.clickRing('void');
                this.player1.clickRing('earth');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.fushicho],
                    defenders: [],
                    ring: 'void'
                });
                this.noMoreActions();
                this.player1.clickPrompt('No');
                this.player1.clickCard(this.dojiHotaru);
                expect(this.player1).toHavePrompt('Isawa Ujina');
            });
        });
    });
});
