describe('Ivory Kingdoms Unicorn', function() {
    integration(function() {
        describe('Ivory Kingdoms Unicorn\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['ivory-kingdoms-unicorn', 'otomo-courtier', 'iuchi-farseer'],
                        hand: ['iuchi-wayfinder'],
                        stronghold: ['hisu-mori-toride-unicorn']
                    },
                    player2: {
                        inPlay: ['doji-challenger'],
                        hand: ['against-the-waves', 'talisman-of-the-sun'],
                        provinces: ['shameful-display', 'shameful-display', 'endless-plains', 'shameful-display'],
                        role: 'keeper-of-water'
                    }
                });

                this.ivoryKingdomsUnicorn = this.player1.findCardByName('ivory-kingdoms-unicorn');
                this.otomoCourtier = this.player1.findCardByName('otomo-courtier');
                this.iuchiFarseer = this.player1.findCardByName('iuchi-farseer');
                this.iuchiWayfinder = this.player1.findCardByName('iuchi-wayfinder');
                this.hisuMoriToride = this.player1.findCardByName('hisu-mori-toride-unicorn');

                this.dojiChallenger = this.player2.findCardByName('doji-challenger');
                this.againstTheWaves = this.player2.findCardByName('against-the-waves');
                this.talismanOfTheSun = this.player2.findCardByName('talisman-of-the-sun');

                this.shamefulDisplay1 = this.player2.provinces['province 1'].provinceCard;
                this.shamefulDisplay2 = this.player2.provinces['province 2'].provinceCard;
                this.endlessPlains3 = this.player2.provinces['province 3'].provinceCard;
            });

            it('should not trigger if Ivory Kingdoms Unicorn is not attacking', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.iuchiFarseer],
                    defenders: [],
                    type: 'political'
                });
                this.noMoreActions();
                this.player1.clickPrompt('No');
                this.player1.clickPrompt('Don\'t Resolve');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should not trigger unless province is broken', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.ivoryKingdomsUnicorn],
                    defenders: [this.dojiChallenger]
                });
                this.noMoreActions();
                this.player1.clickPrompt('Don\'t Resolve');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should not trigger if you have no remaining conflict declarations', function() {
                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();
                this.player2.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.ivoryKingdomsUnicorn],
                    defenders: []
                });
                this.noMoreActions();
                expect(this.player1.player.conflictOpportunities['total']).toBe(0);
                this.player1.clickPrompt('No');
                this.player1.clickPrompt('Don\'t Resolve');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should not trigger if you have no elligible attackers for a military conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.ivoryKingdomsUnicorn],
                    defenders: []
                });
                this.player2.clickCard(this.againstTheWaves);
                this.player2.clickCard(this.iuchiFarseer);
                expect(this.iuchiFarseer.bowed).toBe(true);
                this.noMoreActions();
                this.player1.clickPrompt('No');
                this.player1.clickPrompt('Don\'t Resolve');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should trigger after the conflict ends if you break a province when Ivory Kingdoms Unicorn is attacking', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.ivoryKingdomsUnicorn],
                    defenders: []
                });
                this.noMoreActions();
                this.player1.clickPrompt('No');
                this.player1.clickPrompt('Don\'t Resolve');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.ivoryKingdomsUnicorn);
            });

            it('should trigger after the conflict ends if a province is broken at any point during the conflict when Ivory Kingdoms Unicorn is attacking', function() {
                this.player1.clickCard(this.iuchiWayfinder);
                this.player1.clickPrompt('0');
                this.player1.clickPrompt('Pass');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.ivoryKingdomsUnicorn, this.iuchiWayfinder],
                    province: this.endlessPlains3
                });
                this.player2.clickCard(this.endlessPlains3);
                this.player1.clickPrompt('No');
                this.player1.clickCard(this.iuchiWayfinder);
                expect(this.iuchiWayfinder.location).toBe('conflict discard pile');
                this.player2.clickPrompt('Done');
                this.player2.clickCard(this.talismanOfTheSun);
                this.player2.clickCard(this.dojiChallenger);
                this.player1.pass();
                this.player2.clickCard(this.talismanOfTheSun);
                this.player2.clickCard(this.shamefulDisplay1);
                expect(this.game.currentConflict.conflictProvince).toBe(this.shamefulDisplay1);
                this.noMoreActions();
                this.player1.clickPrompt('No');
                this.player1.clickPrompt('Don\'t Resolve');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.ivoryKingdomsUnicorn);
            });

            it('should initiate a new military conflict immediately', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.ivoryKingdomsUnicorn],
                    defenders: []
                });
                this.noMoreActions();
                this.player1.clickPrompt('No');
                this.player1.clickPrompt('Don\'t Resolve');
                this.player1.clickCard(this.ivoryKingdomsUnicorn);
                expect(this.getChatLogs(1)).toContain('player1 uses Ivory Kingdoms Unicorn to declare a new conflict');
                expect(this.player1).toHavePrompt('Initiate Conflict');
                expect(this.player1).not.toHavePromptButton('Pass Conflict');
                expect(this.game.rings['earth'].conflictType).toBe('political');
                this.player1.clickRing('earth');
                expect(this.game.rings['earth'].conflictType).toBe('military');
                this.player1.clickRing('earth');
                expect(this.game.rings['earth'].conflictType).toBe('military');
                expect(this.game.rings['fire'].conflictType).toBe('military');
                this.player1.clickRing('fire');
                expect(this.game.rings['fire'].conflictType).toBe('military');
                this.player1.clickRing('fire');
                expect(this.game.rings['fire'].conflictType).toBe('military');
                this.player1.clickCard(this.iuchiFarseer);
                this.player1.clickCard(this.shamefulDisplay2);
                this.player1.clickPrompt('Initiate Conflict');
                expect(this.game.currentConflict).toBeDefined();
                expect(this.game.currentConflict.conflictType).toBe('military');
            });

            it('should use up a conflict declaration, but not use up a specific conflict type', function() {
                this.player1.clickCard(this.iuchiWayfinder);
                this.player1.clickPrompt('0');
                this.player1.clickPrompt('Pass');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.ivoryKingdomsUnicorn, this.iuchiWayfinder],
                    defenders: []
                });
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.hisuMoriToride);
                this.player1.clickCard(this.hisuMoriToride);
                this.player1.clickCard(this.iuchiWayfinder);
                this.player1.clickPrompt('No');
                this.player1.clickPrompt('Don\'t Resolve');
                this.player1.clickCard(this.ivoryKingdomsUnicorn);
                this.player1.clickRing('earth');
                this.player1.clickCard(this.iuchiFarseer);
                this.player1.clickCard(this.shamefulDisplay2);
                this.player1.clickPrompt('Initiate Conflict');
                expect(this.player1.player.conflictOpportunities['military']).toBe(1);
                expect(this.player1.player.conflictOpportunities['political']).toBe(1);
                expect(this.player1.player.conflictOpportunities['total']).toBe(1);
            });
        });
    });
});

