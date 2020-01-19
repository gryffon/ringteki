describe('Asako Togama', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['asako-togama', 'doji-challenger']
                },
                player2: {
                    inPlay: []
                }
            });

            this.togama = this.player1.findCardByName('asako-togama');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.game.rings.earth.fate = 1;
            this.game.rings.void.fate = 2;
            this.game.rings.water.fate = 0;
        });

        it('should allow returning a ring & claiming the fate', function() {
            this.player1.claimRing('air');
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.togama],
                defenders: [],
                type: 'military',
                ring: 'water'
            });

            let fate = this.player1.fate;
            let ringFate = this.game.rings.void.fate;

            this.player2.pass();
            this.player1.clickCard(this.togama);
            expect(this.player1).toHavePrompt('Choose a ring to return');
            expect(this.player1).toBeAbleToSelectRing('air');
            expect(this.player1).not.toBeAbleToSelectRing('earth');
            expect(this.player1).not.toBeAbleToSelectRing('fire');
            expect(this.player1).not.toBeAbleToSelectRing('void');
            expect(this.player1).not.toBeAbleToSelectRing('water');

            this.player1.clickRing('air');
            expect(this.player1).toHavePrompt('Choose a ring to take');
            expect(this.player1).not.toBeAbleToSelectRing('air');
            expect(this.player1).toBeAbleToSelectRing('earth');
            expect(this.player1).toBeAbleToSelectRing('fire');
            expect(this.player1).toBeAbleToSelectRing('void');
            expect(this.player1).not.toBeAbleToSelectRing('water');

            this.player1.clickRing('void');
            expect(this.player1.fate).toBe(fate + ringFate);
            expect(this.game.rings.air.isUnclaimed()).toBe(true);
            expect(this.game.rings.void.isUnclaimed()).toBe(false);

            expect(this.getChatLogs(6)).toContain('player1 uses Asako Togama to switch a claimed ring with an unclaimed one');
            expect(this.getChatLogs(5)).toContain('player1 returns the Air Ring');
            expect(this.getChatLogs(4)).toContain('player1 takes the Void Ring');
            expect(this.getChatLogs(3)).toContain('player1 takes 2 fate from Void Ring');
        });

        it('should not work while not participating', function() {
            this.player1.claimRing('air');
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [],
                type: 'military',
                ring: 'water'
            });

            this.player2.pass();
            this.player1.clickCard(this.togama);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });

        it('should not work if there is no ring to return', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.togama],
                defenders: [],
                type: 'military'
            });

            this.player2.pass();
            this.player1.clickCard(this.togama);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });
    });
});
