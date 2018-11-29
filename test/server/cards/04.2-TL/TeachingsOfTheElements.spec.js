describe('Teachings of the Elements', function() {
    integration(function() {
        describe('Teachings of the Elements\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-whisperer', 'doji-hotaru', 'savvy-politician']
                    },
                    player2: {
                        provinces: ['teachings-of-the-elements'],
                        inPlay: ['radiant-orator']
                    }
                });
                this.dojiWhisperer = this.player1.findCardByName('doji-whisperer');
                this.dojiHotaru = this.player1.findCardByName('doji-hotaru');
                this.savvyPolitician = this.player1.findCardByName('savvy-politician');
                this.teachingsOfTheElements = this.player2.findCardByName('teachings-of-the-elements');
                this.radiantOrator = this.player2.findCardByName('radiant-orator');
                this.noMoreActions();
            });

            it('should have +1 strength for each claimed ring', function() {
                expect(this.teachingsOfTheElements.getStrength()).toBe(5);
                this.initiateConflict({
                    attackers: [this.dojiWhisperer],
                    defenders: [],
                    ring: 'air',
                    type: 'political',
                    jumpTo: 'afterConflict'
                });
                this.player1.clickPrompt('Take 1 honor from opponent');
                expect(this.game.rings.air.claimed).toBe(true);
                expect(this.teachingsOfTheElements.getStrength()).toBe(6);
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.radiantOrator],
                    defenders: [],
                    ring: 'earth',
                    type: 'military',
                    jumpTo: 'afterConflict'
                });
                this.player2.clickPrompt('Draw a card and opponent discards');
                expect(this.game.rings.earth.claimed).toBe(true);
                expect(this.teachingsOfTheElements.getStrength()).toBe(7);
            });
        });
    });
});
