describe('Kakita Toshimoko', function() {
    integration(function() {
        describe('Kakita Toshimoko\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['kakita-toshimoko']
                    },
                    player2: {
                        inPlay: ['akodo-toturi-2', 'lion-s-pride-brawler']
                    }
                });
                this.kakitaToshimoko = this.player1.findCardByName('kakita-toshimoko');

                this.akodoToturi2 = this.player2.findCardByName('akodo-toturi-2');
                this.lionsPrideBrawler = this.player2.findCardByName('lion-s-pride-brawler');
            });

            it('should trigger when Kakita Toshimoko is about to lose a conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.kakitaToshimoko],
                    defenders: [this.akodoToturi2],
                    type: 'military'
                });
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.kakitaToshimoko);
            });

            it('should prompt your opponent to choose a target to duel with', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.kakitaToshimoko],
                    defenders: [this.akodoToturi2, this.lionsPrideBrawler],
                    type: 'military'
                });
                this.noMoreActions();
                this.player1.clickCard(this.kakitaToshimoko);
                expect(this.player2).toHavePrompt('Choose a character');
                expect(this.player2).not.toBeAbleToSelect(this.kakitaToshimoko);
                expect(this.player2).toBeAbleToSelect(this.akodoToturi2);
                expect(this.player2).toBeAbleToSelect(this.lionsPrideBrawler);
            });

            it('should set both players to 0 total skill for the conflict when Tashimoko wins', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.kakitaToshimoko],
                    defenders: [this.akodoToturi2, this.lionsPrideBrawler],
                    type: 'military',
                    ring: 'air'
                });
                this.noMoreActions();
                this.player1.clickCard(this.kakitaToshimoko);
                this.player2.clickCard(this.lionsPrideBrawler);
                this.player1.clickPrompt('5');
                this.player2.clickPrompt('1');
                expect(this.player2.claimedRings.includes('air')).toBe(false);
                expect(this.player1).toHavePrompt('Action Window');
            });
        });

        describe('Kakita Toshimoko\'s ability with multiple Toshimoko\'s', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['kakita-toshimoko', 'ikoma-orator'],
                        hand: ['smuggling-deal'],
                        honor: 12
                    },
                    player2: {
                        inPlay: ['kakita-toshimoko'],
                        hand: ['ornate-fan'],
                        honor: 10
                    }
                });
                this.kakitaToshimoko1 = this.player1.findCardByName('kakita-toshimoko');
                this.ikomaOrator = this.player1.findCardByName('ikoma-orator');
                this.smugglingDeal = this.player1.findCardByName('smuggling-deal');

                this.kakitaToshimoko2 = this.player2.findCardByName('kakita-toshimoko');
                this.ornateFan = this.player2.findCardByName('ornate-fan');
            });

            it('should interact correctly with smuggling deal', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.kakitaToshimoko1, this.ikomaOrator],
                    defenders: [this.kakitaToshimoko2],
                    type: 'political',
                    ring: 'air'
                });
                this.player2.clickCard(this.ornateFan);
                this.player2.clickCard(this.kakitaToshimoko2);
                this.player1.clickCard(this.smugglingDeal);
                this.player1.clickCard(this.kakitaToshimoko1);
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.kakitaToshimoko1);
                this.player1.clickCard(this.kakitaToshimoko1);
                this.player2.clickCard(this.kakitaToshimoko2);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('2');
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.kakitaToshimoko2);
                this.player2.clickCard(this.kakitaToshimoko2);
                this.player1.clickCard(this.kakitaToshimoko1);
                this.player1.clickPrompt('2');
                this.player2.clickPrompt('1');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.kakitaToshimoko1);
                this.player1.clickCard(this.kakitaToshimoko1);
                this.player2.clickCard(this.kakitaToshimoko2);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('2');
                expect(this.player1).toHavePrompt('Air Ring');
                expect(this.getChatLogs(1)).toContain('player1 won a political conflict 6 vs 5');
            });
        });

        describe('Kakita Toshimoko\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['kakita-toshimoko']
                    },
                    player2: {
                        inPlay: ['akodo-toturi-2', 'shiba-yojimbo', 'adept-of-the-waves'],
                        hand: ['fallen-in-battle', 'kirei-ko', 'stay-your-hand']
                    }
                });
                this.kakitaToshimoko = this.player1.findCardByName('kakita-toshimoko');

                this.akodoToturi2 = this.player2.findCardByName('akodo-toturi-2');
                this.shibaYojimbo = this.player2.findCardByName('shiba-yojimbo');
                this.adeptOfTheWaves = this.player2.findCardByName('adept-of-the-waves');
                this.fallenInBattle = this.player2.findCardByName('fallen-in-battle');
                this.kireiKo = this.player2.findCardByName('kirei-ko');
                this.stayYourHand = this.player2.findCardByName('stay-your-hand');
            });

            it('should still recalculate conflict totals even if the duel is lost', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.kakitaToshimoko],
                    defenders: [this.akodoToturi2],
                    type: 'military'
                });
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.kakitaToshimoko);
                this.player1.clickCard(this.kakitaToshimoko);
                this.player2.clickCard(this.akodoToturi2);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                this.player2.clickPrompt('Pass'); //Stay Your Hand
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.kireiKo);
                this.player2.clickCard(this.kireiKo);
                expect(this.getChatLogs(1)).toContain('player2 won a military conflict 6 vs 0');
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.fallenInBattle);
                this.player2.clickCard(this.fallenInBattle);
                this.player2.clickCard(this.kakitaToshimoko);
                expect(this.kakitaToshimoko.location).toBe('dynasty discard pile');
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should still recalculate conflict totals even if the duel is canceled (stay your hand)', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.kakitaToshimoko],
                    defenders: [this.akodoToturi2],
                    type: 'military'
                });
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.kakitaToshimoko);
                this.player1.clickCard(this.kakitaToshimoko);
                this.player2.clickCard(this.akodoToturi2);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.stayYourHand);
                this.player2.clickCard(this.stayYourHand);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.kireiKo);
                this.player2.clickCard(this.kireiKo);
                expect(this.getChatLogs(1)).toContain('player2 won a military conflict 6 vs 0');
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.fallenInBattle);
                this.player2.clickCard(this.fallenInBattle);
                this.player2.clickCard(this.kakitaToshimoko);
                expect(this.kakitaToshimoko.location).toBe('dynasty discard pile');
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should still recalculate conflict totals even if the duel is canceled (Shiba Yojimbo)', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.kakitaToshimoko],
                    defenders: [this.akodoToturi2, this.adeptOfTheWaves],
                    type: 'military'
                });
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.kakitaToshimoko);
                this.player1.clickCard(this.kakitaToshimoko);
                this.player2.clickCard(this.adeptOfTheWaves);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.shibaYojimbo);
                this.player2.clickCard(this.shibaYojimbo);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.kireiKo);
                this.player2.clickCard(this.kireiKo);
                expect(this.getChatLogs(1)).toContain('player2 won a military conflict 8 vs 0');
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.fallenInBattle);
                this.player2.clickCard(this.fallenInBattle);
                this.player2.clickCard(this.kakitaToshimoko);
                expect(this.kakitaToshimoko.location).toBe('dynasty discard pile');
                expect(this.player1).toHavePrompt('Action Window');
            });
        });
    });
});
