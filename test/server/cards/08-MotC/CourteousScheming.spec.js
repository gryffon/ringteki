describe('Courteous Scheming', function() {
    integration(function() {
        describe('Courteous Scheming\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['iuchi-daiyu', 'moto-youth'],
                        hand: ['courteous-scheming', 'courteous-scheming']
                    },
                    player2: {
                        inPlay: ['border-rider', 'aranat']
                    }
                });
                this.iuchiDaiyu = this.player1.findCardByName('iuchi-daiyu');
                this.motoYouth = this.player1.findCardByName('moto-youth');
                const courteousSchemings = this.player1.filterCardsByName(
                    'courteous-scheming'
                );
                this.courteousScheming = courteousSchemings[0];
                this.courteousScheming2 = courteousSchemings[1];
                this.borderRider = this.player2.findCardByName('border-rider');
                this.aranat = this.player2.findCardByName('aranat');
            });

            it('should not be able to be triggered outside of a conflict', function() {
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.courteousScheming);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should not be able to be triggered in a military conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.iuchiDaiyu],
                    defenders: [this.borderRider],
                    type: 'military'
                });
                this.player2.pass();
                this.player1.clickCard(this.courteousScheming);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should initiate a duel with your opponent choosing the duel target', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.iuchiDaiyu],
                    defenders: [this.borderRider],
                    type: 'political'
                });
                this.player2.pass();
                this.player1.clickCard(this.courteousScheming);
                expect(this.player1).toHavePrompt('Choose a character');
                expect(this.player1).toBeAbleToSelect(this.iuchiDaiyu);
                expect(this.player1).not.toBeAbleToSelect(this.motoYouth);
                expect(this.player1).not.toBeAbleToSelect(this.borderRider);
                this.player1.clickCard(this.iuchiDaiyu);
                expect(this.player2).toHavePrompt('Choose a character');
                expect(this.player2).not.toBeAbleToSelect(this.iuchiDaiyu);
                expect(this.player2).not.toBeAbleToSelect(this.motoYouth);
                expect(this.player2).toBeAbleToSelect(this.borderRider);
                expect(this.player2).not.toBeAbleToSelect(this.aranat);
                this.player2.clickCard(this.borderRider);
            });

            it('should give an extra political conflict to you if you win the duel', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.iuchiDaiyu],
                    defenders: [this.borderRider],
                    type: 'political'
                });
                this.player2.pass();
                this.player1.clickCard(this.courteousScheming);
                this.player1.clickCard(this.iuchiDaiyu);
                this.player2.clickCard(this.borderRider);
                this.player1.clickPrompt('5');
                this.player2.clickPrompt('1');
                expect(
                    this.player1.player.getConflictOpportunities('political')
                ).toBe(1);
            });

            it('should give an extra political conflict to the opponent if they win the duel', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.iuchiDaiyu],
                    defenders: [this.borderRider],
                    type: 'political'
                });
                this.player2.pass();
                this.player1.clickCard(this.courteousScheming);
                this.player1.clickCard(this.iuchiDaiyu);
                this.player2.clickCard(this.borderRider);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('5');
                expect(
                    this.player2.player.getConflictOpportunities('political')
                ).toBe(2);
            });

            it('should give no extra political conflict if there is no winner', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.iuchiDaiyu],
                    defenders: [this.borderRider],
                    type: 'political'
                });
                this.player2.pass();
                this.player1.clickCard(this.courteousScheming);
                this.player1.clickCard(this.iuchiDaiyu);
                this.player2.clickCard(this.borderRider);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('3');
                expect(
                    this.player1.player.getConflictOpportunities('political')
                ).toBe(0);
            });

            it('should be max 1 per round', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.iuchiDaiyu],
                    defenders: [this.borderRider],
                    type: 'political'
                });
                this.player2.pass();
                this.player1.clickCard(this.courteousScheming);
                this.player1.clickCard(this.iuchiDaiyu);
                this.player2.clickCard(this.borderRider);
                this.player1.clickPrompt('5');
                this.player2.clickPrompt('1');
                this.noMoreActions();
                this.player1.clickPrompt('Don\'t resolve');
                this.noMoreActions();
                this.player2.clickPrompt('Pass Conflict');
                this.player2.clickPrompt('Yes');
                this.noMoreActions();
                this.initiateConflict({
                    ring: 'earth',
                    attackers: [this.motoYouth],
                    defenders: [this.aranat],
                    type: 'political'
                });
                this.player2.pass();
                this.player1.clickCard(this.courteousScheming2);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });
        });
    });
});
