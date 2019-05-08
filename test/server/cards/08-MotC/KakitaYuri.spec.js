describe('Kakita Yuri', function() {
    integration(function() {
        describe('Kakita Yuri\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['kakita-yuri'],
                        provinces: ['shameful-display']
                    },
                    player2: {
                        inPlay: ['border-rider', 'iuchi-farseer','moto-youth','ivory-kingdoms-unicorn']
                    }
                });
                this.kakitaYuri = this.player1.findCardByName('kakita-yuri');
                this.shamefulDisplay = this.player1.provinces['province 1'].provinceCard;
                this.borderRider = this.player2.findCardByName('border-rider');
                this.iuchiFarseer = this.player2.findCardByName('iuchi-farseer');
                this.motoYouth = this.player2.findCardByName('moto-youth');
                this.ivoryKingdomsUnicorn = this.player2.findCardByName('ivory-kingdoms-unicorn');
                this.noMoreActions();
            });

            it('should let the opponent select his own character to duel', function() {
                this.initiateConflict({
                    attackers: [this.kakitaYuri],
                    defenders: [this.borderRider, this.iuchiFarseer]
                });
                this.player2.pass();
                this.player1.clickCard(this.kakitaYuri);
                expect(this.player2).toHavePrompt('Choose a character');
                expect(this.player2).toBeAbleToSelect(this.borderRider);
                expect(this.player2).toBeAbleToSelect(this.iuchiFarseer);
                expect(this.player2).not.toBeAbleToSelect(this.motoYouth);
            });

            it('should remove military conflicts opportunies for the loser of the duel', function() {
                this.initiateConflict({
                    attackers: [this.kakitaYuri],
                    defenders: [this.borderRider, this.iuchiFarseer]
                });
                this.player2.pass();
                this.player1.clickCard(this.kakitaYuri);
                this.player2.clickCard(this.iuchiFarseer);
                this.player1.clickPrompt('5');
                this.player2.clickPrompt('1');
                this.noMoreActions();
                this.noMoreActions();
                expect(this.player2).toHavePrompt('Initiate Conflict');
                expect(this.game.rings.earth.claimed).toBe(false);
                this.player2.clickRing('earth');
                expect(this.game.rings['earth'].conflictType).toBe('political');
                this.player2.clickRing('earth');
                expect(this.game.rings['earth'].conflictType).toBe('political');
                this.player2.clickCard(this.motoYouth);
                this.player2.clickCard(this.shamefulDisplay);
                this.player2.clickPrompt('Initiate Conflict');
                expect(this.game.currentConflict).toBeDefined();
                expect(this.game.currentConflict.conflictType).toBe('political');
            });

            it('should prevent Ivory Kingdoms Unicorn from triggering', function() {
                this.player1.clickPrompt('Pass Conflict');
                this.player1.clickPrompt('Yes');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.borderRider, this.ivoryKingdomsUnicorn],
                    defenders: [this.kakitaYuri]
                });
                this.player1.clickCard(this.kakitaYuri);
                this.player2.clickCard(this.borderRider);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                this.player2.pass();
                this.player1.pass();
                this.player2.clickPrompt('No');
                this.player2.clickPrompt('Don\'t Resolve');
                expect(this.player2).not.toHavePrompt('Triggered Abilities');
                expect(this.player2).not.toBeAbleToSelect(this.ivoryKingdomsUnicorn);
            });

            fit('should not resolve the effect if the duel is a draw', function() {
                this.initiateConflict({
                    attackers: [this.kakitaYuri],
                    defenders: [this.borderRider, this.iuchiFarseer]
                });
                this.player2.pass();
                this.player1.clickCard(this.kakitaYuri);
                this.player2.clickCard(this.iuchiFarseer);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                expect(this.getChatLogs(4)).toContain('The duel has no effect');
                expect(this.getChatLogs(4)).toContain('The duel ends in a draw');
            });
        });
    });
});
