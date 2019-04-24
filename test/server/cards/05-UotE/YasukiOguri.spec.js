describe('Yasuki Oguri', function() {
    integration(function() {
        describe('Yasuki Oguri\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shinjo-outrider'],
                        hand: ['banzai']
                    },
                    player2: {
                        inPlay: ['yasuki-oguri']
                    }
                });
                this.oguri = this.player2.findCardByName('yasuki-oguri');
                this.outrider = this.player1.findCardByName('shinjo-outrider');

                this.noMoreActions();
            });

            it('should trigger when the opponent plays event during a conflict while Oguri is defending', function() {
                this.initiateConflict({
                    attackers: [this.outrider],
                    defenders: [this.oguri]
                });

                this.player2.pass();
                this.player1.clickCard('banzai', 'hand');
                this.player1.clickCard(this.outrider);
                this.player1.clickPrompt('Done');
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.oguri);
            });

            it('should not trigger if Oguri is not defending', function() {
                this.initiateConflict({
                    attackers: [this.outrider],
                    defenders: []
                });

                this.player2.pass();
                this.player1.clickCard('banzai', 'hand');
                this.player1.clickCard(this.outrider);
                this.player1.clickPrompt('Done');
                expect(this.player2).not.toHavePrompt('Triggered Abilities');
                expect(this.player2).not.toBeAbleToSelect(this.oguri);
            });

            it('should give him +1/+1', function() {
                this.mil = this.oguri.getMilitarySkill();
                this.pol = this.oguri.getPoliticalSkill();

                this.initiateConflict({
                    attackers: [this.outrider],
                    defenders: [this.oguri]
                });

                this.player2.pass();
                this.player1.clickCard('banzai', 'hand');
                this.player1.clickCard(this.outrider);
                this.player1.clickPrompt('Done');
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.oguri);
                this.player2.clickCard(this.oguri);
                expect(this.oguri.getMilitarySkill()).toBe(this.mil + 1);
                expect(this.oguri.getPoliticalSkill()).toBe(this.pol + 1);
            });
        });
    });
});
