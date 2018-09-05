describe('Restored Heirloom', function() {
    integration(function() {
        describe('Restored Heirloom\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 2,
                        inPlay: ['matsu-berserker', 'shiba-tsukune'],
                        conflictDiscard: ['restored-heirloom']
                    }
                });
                this.berserker = this.player1.findCardByName('matsu-berserker');
                this.heirloom = this.player1.findCardByName('restored-heirloom');
                this.noMoreActions();
            });

            it('should trigger when the water ring is resolved', function() {
                this.initiateConflict({
                    ring: 'water',
                    attackers: ['matsu-berserker'],
                    defenders: []
                });
                this.noMoreActions();
                //break province prompt
                this.player1.clickPrompt('no');

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.heirloom);
            });

            it('should put the heirloom into play for free', function() {
                this.initiateConflict({
                    ring: 'water',
                    attackers: ['matsu-berserker'],
                    defenders: []
                });
                this.noMoreActions();
                //break province prompt
                this.player1.clickPrompt('no');

                this.player1.clickCard(this.heirloom);
                expect(this.player1).toBeAbleToSelect(this.berserker);
                this.player1.clickCard(this.berserker);
                expect(this.heirloom.location).toBe('play area');
                expect(this.player1.fate).toBe(2);
            });

            it('should trigger when the water ring is resolved by Shiba Tsukune', function() {
                this.player1.clickPrompt('Pass Conflict');
                this.player1.clickPrompt('Yes');
                this.berserker.bowed = true;
                this.shibaTsukune = this.player1.findCardByName('shiba-tsukune');
                this.shibaTsukune.bowed = true;
                this.noMoreActions();
                this.noMoreActions();
                this.noMoreActions();
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.shibaTsukune);
                this.player1.clickCard(this.shibaTsukune);
                this.player1.clickRing('water');
                this.player1.clickPrompt('Done');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.heirloom);
            });
        });
    });
});
