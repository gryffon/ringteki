describe('A New Name', function() {
    integration(function() {
        describe('A New Name', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['asahina-artisan', 'doji-challenger'],
                        hand: ['a-new-name']
                    },
                    player2: {
                        inPlay: ['adept-of-the-waves', 'miya-mystic']
                    }
                });

                this.player1.playAttachment('a-new-name', 'asahina-artisan');
                this.artisan = this.player1.findCardByName('asahina-artisan');
                this.noMoreActions();
            });

            it('should have bushi trait', function() {
                expect(this.artisan.getTraits()).toContain('bushi');
            });

            it('should have courtier trait', function() {
                expect(this.artisan.getTraits()).toContain('courtier');
            });

            it('should have +1/+1', function() {
                expect(this.artisan.getMilitarySkill()).toBe(1);
                expect(this.artisan.getPoliticalSkill()).toBe(1);
            });
        });
    });
});
