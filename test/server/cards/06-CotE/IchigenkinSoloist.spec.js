describe('Ichigenkin Soloist', function() {
    integration(function() {
        describe('Ichigenkin Soloist, if controller has composure,', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'draw',
                    player1: {
                        inPlay: ['ichigenkin-soloist', 'wandering-ronin', 'guardian-kami']
                    },
                    player2: {
                        inPlay: ['miya-mystic', 'hida-tomonatsu'],
                        hand: ['assassination', 'hiruma-skirmisher']
                    }
                });
                this.ichigenkinSoloist = this.player1.findCardByName('ichigenkin-soloist');
                this.wanderingRonin = this.player1.findCardByName('wandering-ronin');
                this.guardianKami = this.player1.findCardByName('guardian-kami');
                this.shamefulDisplay1 = this.player1.findCardByName('shameful-display', 'province 1');

                this.miyaMystic = this.player2.findCardByName('miya-mystic');
                this.assassination = this.player2.findCardByName('assassination');
                this.hirumaSkirmisher = this.player2.findCardByName('hiruma-skirmisher');
                this.hidaTomonatsu = this.player2.findCardByName('hida-tomonatsu');
                this.shamefulDisplay2 = this.player2.findCardByName('shameful-display', 'province 1');

                this.player1.clickPrompt('1');
                this.player2.clickPrompt('2');
                this.noMoreActions();
            });

            it('should not be able to be targeted by events', function() {
                expect(this.player1.player.hasComposure()).toBe(true);
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.ichigenkinSoloist],
                    defenders: []
                });
                this.player2.clickCard(this.assassination);
                expect(this.player2).toHavePrompt('Choose a character');
                expect(this.player2).not.toBeAbleToSelect(this.ichigenkinSoloist);
                expect(this.player2).toBeAbleToSelect(this.guardianKami);
            });

            it('should still be able to be targeted by covert', function() {
                expect(this.player1.player.hasComposure()).toBe(true);
                this.noMoreActions();
                this.player1.passConflict();
                this.player1.pass();
                this.player2.clickCard(this.hirumaSkirmisher);
                this.player2.clickPrompt('0');
                this.player2.clickCard(this.hirumaSkirmisher);
                this.noMoreActions();
                this.player2.clickRing('air');
                this.player2.clickCard(this.shamefulDisplay1);
                this.player2.clickCard(this.hirumaSkirmisher);
                expect(this.player2).toHavePrompt('Choose defenders to Covert');
                this.player2.clickCard(this.ichigenkinSoloist);
                this.player2.clickPrompt('Initiate Conflict');
                this.player1.clickCard(this.ichigenkinSoloist);
                this.player1.clickPrompt('Done');
                expect(this.ichigenkinSoloist.isParticipating()).toBe(false);
            });

            it('should not be able to be targeted by an action from a province)', function() {
                expect(this.player1.player.hasComposure()).toBe(true);
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.ichigenkinSoloist, this.wanderingRonin],
                    defenders: [this.miyaMystic],
                    province: this.shamefulDisplay2
                });
                this.player2.clickCard(this.shamefulDisplay2);
                expect(this.player2).not.toBeAbleToSelect(this.ichigenkinSoloist);
                expect(this.player2).toBeAbleToSelect(this.wanderingRonin);
                expect(this.player2).toBeAbleToSelect(this.miyaMystic);
            });

            it('should not be able to be targeted by a reaction (from a character)', function() {
                expect(this.player1.player.hasComposure()).toBe(true);
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.ichigenkinSoloist, this.wanderingRonin],
                    defenders: [this.hidaTomonatsu]
                });
                this.noMoreActions();
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.hidaTomonatsu);
                this.player2.clickCard(this.hidaTomonatsu);
                expect(this.player2).toHavePrompt('Choose a character');
                expect(this.player2).not.toBeAbleToSelect(this.ichigenkinSoloist);
                expect(this.player2).toBeAbleToSelect(this.wanderingRonin);
            });
        });
    });
});
