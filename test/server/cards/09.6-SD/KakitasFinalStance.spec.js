describe('Kakitas Final Stance', function() {
    integration(function() {
        describe('Kakitas Final Stance\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-kuwanan', 'doji-whisperer'],
                        hand: ['game-of-sadane', 'kakita-s-final-stance', 'mirumoto-s-fury']
                    },
                    player2: {
                        inPlay: ['bayushi-collector'],
                        hand: ['game-of-sadane', 'for-shame'],
                        provinces: ['kuroi-mori']
                    }
                });
                this.kuwanan = this.player1.findCardByName('doji-kuwanan');
                this.whisperer = this.player1.findCardByName('doji-whisperer');
                this.sadane1 = this.player1.findCardByName('game-of-sadane');
                this.stance = this.player1.findCardByName('kakita-s-final-stance');
                this.bayushiCollector = this.player2.findCardByName('bayushi-collector');
                this.fury = this.player1.findCardByName('mirumoto-s-fury');
                this.shame = this.player2.findCardByName('for-shame');
                this.sadane2 = this.player2.findCardByName('game-of-sadane');
                this.km = this.player2.findCardByName('kuroi-mori');
            });

            it('should not be triggerable outside of a conflict', function() {
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.stance);
                expect(this.player1).toHavePrompt('Action Window');
            });

            describe('during a political conflict', function() {
                beforeEach(function() {
                    this.noMoreActions();
                    this.initiateConflict({
                        attackers: [this.kuwanan],
                        defenders: [this.bayushiCollector],
                        type: 'political'
                    });
                });

                it('should not be triggerable in a political conflict', function() {
                    this.player2.pass();
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                    this.player1.clickCard(this.stance);
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                });
            });

            describe('during a military conflict', function() {
                beforeEach(function() {
                    this.noMoreActions();
                    this.initiateConflict({
                        attackers: [this.kuwanan],
                        defenders: [this.bayushiCollector],
                        type: 'military',
                        province: this.km
                    });
                });

                it('should allow you to choose a participating character', function() {
                    this.player2.pass();
                    this.player1.clickCard(this.stance);
                    expect(this.player1).toBeAbleToSelect(this.kuwanan);
                    expect(this.player1).toBeAbleToSelect(this.bayushiCollector);
                    expect(this.player1).not.toBeAbleToSelect(this.whisperer);
                });

                it('should prevent opponents\' card effects from bowing', function() {
                    this.kuwanan.dishonor();
                    this.player2.pass();
                    this.player1.clickCard(this.stance);
                    this.player1.clickCard(this.kuwanan);
                    expect(this.player2).toHavePrompt('Conflict Action Window');
                    this.player2.clickCard(this.shame);
                    expect(this.player2).toHavePrompt('Conflict Action Window');
                    expect(this.kuwanan.bowed).toBe(false);
                });

                it('should allow own card effects to bow', function() {
                    this.kuwanan.dishonor();
                    this.player2.pass();
                    this.player1.clickCard(this.stance);
                    this.player1.clickCard(this.kuwanan);
                    this.player2.pass();
                    this.player1.clickCard(this.fury);
                    this.player1.clickCard(this.kuwanan);
                    expect(this.kuwanan.bowed).toBe(true);
                });

                it('should not prevent bowing as a result of conflict resolution (no duel)', function() {
                    this.player2.pass();
                    this.player1.clickCard(this.stance);
                    this.player1.clickCard(this.kuwanan);

                    this.player2.pass();
                    this.player1.pass();

                    this.player1.clickPrompt('No');
                    this.player1.clickPrompt('Don\'t Resolve');
                    expect(this.kuwanan.bowed).toBe(true);
                    expect(this.bayushiCollector.bowed).toBe(true);
                });

                it('should prevent bowing as a result of conflict resolution (duel before playing stance)', function() {
                    this.player2.pass();
                    this.player1.clickCard(this.sadane1);
                    this.player1.clickCard(this.kuwanan);
                    this.player1.clickCard(this.bayushiCollector);

                    this.player1.clickPrompt('1');
                    this.player2.clickPrompt('1');

                    this.player2.pass();
                    this.player1.clickCard(this.stance);
                    this.player1.clickCard(this.kuwanan);

                    this.player2.pass();
                    this.player1.pass();

                    this.player1.clickPrompt('No');
                    this.player1.clickPrompt('Don\'t Resolve');
                    expect(this.kuwanan.bowed).toBe(false);
                    expect(this.bayushiCollector.bowed).toBe(true);
                });

                it('should prevent bowing as a result of conflict resolution (duel after playing stance)', function() {
                    this.player2.pass();
                    this.player1.clickCard(this.stance);
                    this.player1.clickCard(this.kuwanan);

                    this.player2.pass();
                    this.player1.clickCard(this.sadane1);
                    this.player1.clickCard(this.kuwanan);
                    this.player1.clickCard(this.bayushiCollector);

                    this.player1.clickPrompt('1');
                    this.player2.clickPrompt('1');

                    this.player2.pass();
                    this.player1.pass();

                    this.player1.clickPrompt('No');
                    this.player1.clickPrompt('Don\'t Resolve');
                    expect(this.kuwanan.bowed).toBe(false);
                    expect(this.bayushiCollector.bowed).toBe(true);
                });

                it('should prevent bowing as a result of conflict resolution (losing duel)', function() {
                    this.player2.pass();
                    this.player1.clickCard(this.stance);
                    this.player1.clickCard(this.kuwanan);

                    this.player2.pass();
                    this.player1.clickCard(this.sadane1);
                    this.player1.clickCard(this.kuwanan);
                    this.player1.clickCard(this.bayushiCollector);

                    this.player1.clickPrompt('1');
                    this.player2.clickPrompt('5');

                    this.player2.pass();
                    this.player1.pass();

                    this.player1.clickPrompt('Don\'t Resolve');
                    expect(this.kuwanan.bowed).toBe(false);
                    expect(this.bayushiCollector.bowed).toBe(true);
                });

                it('should prevent bowing as a result of conflict resolution (opponent duel)', function() {
                    this.player2.pass();
                    this.player1.clickCard(this.stance);
                    this.player1.clickCard(this.kuwanan);

                    this.player2.clickCard(this.sadane2);
                    this.player2.clickCard(this.bayushiCollector);
                    this.player2.clickCard(this.kuwanan);

                    this.player1.clickPrompt('1');
                    this.player2.clickPrompt('1');

                    this.player1.pass();
                    this.player2.pass();

                    this.player1.clickPrompt('No');
                    this.player1.clickPrompt('Don\'t Resolve');
                    expect(this.kuwanan.bowed).toBe(false);
                    expect(this.bayushiCollector.bowed).toBe(true);
                });

                it('should prevent bowing as a result of conflict resolution (conflict switched to pol)', function() {
                    this.player2.pass();
                    this.player1.clickCard(this.sadane1);
                    this.player1.clickCard(this.kuwanan);
                    this.player1.clickCard(this.bayushiCollector);

                    this.player1.clickPrompt('1');
                    this.player2.clickPrompt('1');

                    this.player2.pass();
                    this.player1.clickCard(this.stance);
                    this.player1.clickCard(this.kuwanan);

                    this.player2.clickCard(this.km);
                    this.player2.clickPrompt('Switch the conflict type');
                    expect(this.game.currentConflict.conflictType).toBe('political');

                    this.player1.pass();
                    this.player2.pass();

                    this.player1.clickPrompt('No');
                    this.player1.clickPrompt('Don\'t Resolve');
                    expect(this.kuwanan.bowed).toBe(false);
                    expect(this.bayushiCollector.bowed).toBe(true);
                });
            });
        });
    });
});
