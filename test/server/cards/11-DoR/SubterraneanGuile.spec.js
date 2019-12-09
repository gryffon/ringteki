describe('Subterranean Guile', function() {
    integration(function() {
        describe('Subterranean Guile\'s constant ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['hida-guardian', 'ikoma-ikehata'],
                        hand: ['subterranean-guile', 'subterranean-guile'],
                        dynastyDiscard: ['imperial-storehouse']
                    },
                    player2: {
                        inPlay: ['steward-of-law']
                    }
                });
                this.hidaGuardian = this.player1.findCardByName('hida-guardian');
                this.ikehata = this.player1.findCardByName('ikoma-ikehata');
                this.guile1 = this.player1.filterCardsByName('subterranean-guile')[0];
                this.guile2 = this.player1.filterCardsByName('subterranean-guile')[1];

                this.p1 = this.player1.findCardByName('shameful-display', 'province 1');
                this.storehouse = this.player1.placeCardInProvince('imperial-storehouse', 'province 1');
                this.player1.playAttachment(this.guile1, this.hidaGuardian);
                this.player1.playAttachment(this.guile1, this.ikehata);
            });

            it('should give covert during military conflicts with a holding on an unbroken province', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.hidaGuardian]
                });
                expect(this.player1).toHavePrompt('Choose covert target for Hida Guardian');
            });

            it('should not give covert during pol conflicts', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.hidaGuardian]
                });
                expect(this.player2).toHavePrompt('Choose defenders');
            });

            it('should not remove covert when character has it natively', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.ikehata]
                });
                expect(this.player1).toHavePrompt('Choose covert target for Ikoma Ikehata');
            });

            it('should not give covert without a holding', function() {
                this.player1.moveCard(this.storehouse, 'dynasty discard pile');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.hidaGuardian]
                });
                expect(this.player2).toHavePrompt('Choose defenders');
            });

            it('should not give covert if only holding is on a broken province', function() {
                this.p1.isBroken = true;
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.hidaGuardian]
                });
                expect(this.player2).toHavePrompt('Choose defenders');
            });
        });
    });
});
