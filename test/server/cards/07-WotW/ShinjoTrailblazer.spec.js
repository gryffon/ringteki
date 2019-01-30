describe('Shinjo Trailblazer', function() {
    integration(function() {
        describe('Shinjo Trailblazer\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shinjo-trailblazer']
                    },
                    player2: {
                    }
                });

                this.shinjoTrailblazer = this.player1.findCardByName('shinjo-trailblazer');

                this.noMoreActions();
            });

            it('should trigger when a province is revealed', function() {
                this.player1.declareConflict('military', null, [this.shinjoTrailblazer], 'air');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.shinjoTrailblazer);
            });

            it('should give +2/+2', function() {
                let militarySkill = this.shinjoTrailblazer.getMilitarySkill();
                let politicalSkill = this.shinjoTrailblazer.getPoliticalSkill();
                this.player1.declareConflict('military', null, [this.shinjoTrailblazer], 'air');
                this.player1.clickCard(this.shinjoTrailblazer);
                expect(this.shinjoTrailblazer.getMilitarySkill()).toBe(militarySkill + 2);
                expect(this.shinjoTrailblazer.getPoliticalSkill()).toBe(politicalSkill + 2);
            });

            it('should expire at the end of the conflict', function() {
                let militarySkill = this.shinjoTrailblazer.getMilitarySkill();
                let politicalSkill = this.shinjoTrailblazer.getPoliticalSkill();
                this.player1.declareConflict('military', null, [this.shinjoTrailblazer], 'air');
                this.player1.clickCard(this.shinjoTrailblazer);
                expect(this.shinjoTrailblazer.getMilitarySkill()).toBe(militarySkill + 2);
                expect(this.shinjoTrailblazer.getPoliticalSkill()).toBe(politicalSkill + 2);
                this.player2.assignDefenders([]);
                this.player2.pass();
                this.player1.pass();
                this.player1.clickPrompt('No');
                this.player1.clickPrompt('Don\'t Resolve');
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.shinjoTrailblazer.getMilitarySkill()).toBe(militarySkill);
                expect(this.shinjoTrailblazer.getPoliticalSkill()).toBe(politicalSkill);
            });
        });
    });
});

