describe('Time For War', function() {
    integration(function() {
        describe('Time For War\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['steward-of-law']
                    },
                    player2: {
                        inPlay: ['matsu-berserker'],
                        hand: ['kamayari', 'time-for-war']
                    }
                });
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: ['steward-of-law'],
                    defenders: []
                });
            });

            it('should trigger after losing a political conflict', function() {
                this.noMoreActions();
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect('time-for-war');
                this.player2.clickCard('time-for-war');
                expect(this.player2).toHavePrompt('Choose a character');
                expect(this.player2).toBeAbleToSelect('matsu-berserker');
                this.matsuBerserker = this.player2.clickCard('matsu-berserker');
                expect(this.player2).toHavePrompt('Choose an attachment');
                expect(this.player2).toBeAbleToSelect('kamayari');
                this.kamayari = this.player2.clickCard('kamayari');
                expect(this.matsuBerserker.attachments.toArray()).toContain(this.kamayari);
            });

            it('should not trigger under ABC circumstances', function() {

            });

            it('should have DEF effect on GHI', function() {

            });
        });
    });
});
