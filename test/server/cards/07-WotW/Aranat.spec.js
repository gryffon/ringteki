describe('Aranat', function() {
    integration(function() {
        describe('Aranat\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        dynastyDiscard: ['aranat']
                    },
                    player2: {
                        provinces: ['rally-to-the-cause', 'fertile-fields', 'entrenched-position', 'pilgrimage']
                    }
                });

                this.aranat = this.player1.placeCardInProvince('aranat');

                this.rallyToTheCause = this.player2.findCardByName('rally-to-the-cause');
                this.fertileFields = this.player2.findCardByName('fertile-fields');
                this.entrenchedPosition = this.player2.findCardByName('entrenched-position');
                this.pilgrimage = this.player2.findCardByName('pilgrimage');
                this.shamefulDisplay = this.player2.findCardByName('shameful-display');

                this.player1.clickCard(this.aranat);
                this.player1.clickPrompt('1');
            });

            it('should trigger when Aranat is played', function() {
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.aranat);
            });

            it('should prompt the opponent to flip provinces', function() {
                this.player1.clickCard(this.aranat);
                expect(this.player2).toHavePrompt('Aranat');
            });

            it('should place fate on Aranat equal to the number of facedown provinces', function() {
                expect(this.fertileFields.facedown).toBe(true);
                expect(this.aranat.fate).toBe(1);
                this.player1.clickCard(this.aranat);
                this.player2.clickCard(this.fertileFields);
                this.player2.clickPrompt('Done');
                expect(this.player2).toHavePrompt('Play cards from provinces');
                expect(this.fertileFields.facedown).toBe(false);
                expect(this.aranat.fate).toBe(5);
            });

            it('should not allow revealing the SH province', function() {
                expect(this.fertileFields.facedown).toBe(true);
                expect(this.shamefulDisplay.facedown).toBe(true);
                expect(this.aranat.fate).toBe(1);
                this.player1.clickCard(this.aranat);
                this.player2.clickCard(this.fertileFields);
                this.player2.clickCard(this.shamefulDisplay);
                this.player2.clickPrompt('Done');
                expect(this.player2).toHavePrompt('Play cards from provinces');
                expect(this.fertileFields.facedown).toBe(false);
                expect(this.shamefulDisplay.facedown).toBe(true);
                expect(this.aranat.fate).toBe(5);
            });

            it('should not give any fate when all provinces are revealed', function() {
                this.shamefulDisplay.facedown = false;
                let player2Fate = this.player2.fate;
                expect(this.aranat.fate).toBe(1);
                this.player1.clickCard(this.aranat);
                this.player2.clickCard(this.fertileFields);
                this.player2.clickCard(this.entrenchedPosition);
                this.player2.clickCard(this.rallyToTheCause);
                this.player2.clickCard(this.pilgrimage);
                this.player2.clickPrompt('Done');
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect('seeker-of-water');
                this.player2.clickCard('seeker-of-water');
                expect(this.player2.fate).toBe(player2Fate + 1);
                expect(this.player2).toHavePrompt('Play cards from provinces');
                expect(this.aranat.fate).toBe(1);
            });

            it('should not prompt the opponent when all non-SH provinces are revealed', function() {
                expect(this.aranat.fate).toBe(1);
                this.fertileFields.facedown = false;
                this.entrenchedPosition.facedown = false;
                this.pilgrimage.facedown = false;
                this.rallyToTheCause.facedown = false;
                this.player1.clickCard(this.aranat);
                expect(this.aranat.fate).toBe(2);
                expect(this.player2).toHavePrompt('Play cards from provinces');
            });
        });
    });
});
