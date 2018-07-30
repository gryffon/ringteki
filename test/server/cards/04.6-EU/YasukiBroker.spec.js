describe('Yasuki Broker', function() {
    integration(function() {
        describe('Yasuki Broker\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 3,
                        inPlay: ['yasuki-broker', 'hida-guardian'],
                        hand: []
                    },
                    player2: {
                        inPlay: ['border-rider']
                    }
                });

                this.yasukiBroker = this.player1.findCardByName('yasuki-broker');
                this.hidaGuardian = this.player1.findCardByName('hida-guardian');

                this.borderRider = this.player2.findCardByName('border-rider');

                this.noMoreActions();
            });

            it('should give all characters courtesy and sincerity while participating', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.yasukiBroker],
                    defenders: [this.borderRider]
                });
                expect(this.yasukiBroker).toBe(true);
                expect(this.yasukiBroker).toBe(true);
                expect(this.hidaGuardian).toBe(true);
                expect(this.hidaGuardian).toBe(true);
                expect(this.borderRider).toBe(false);
                expect(this.borderRider).toBe(false);
            });

            it('should not give all characters courtesy and sincerity when not participating', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.hidaGuardian],
                    defenders: [this.borderRider]
                });
                expect(this.yasukiBroker).toBe(false);
                expect(this.yasukiBroker).toBe(false);
                expect(this.hidaGuardian).toBe(false);
                expect(this.hidaGuardian).toBe(false);
                expect(this.borderRider).toBe(false);
                expect(this.borderRider).toBe(false);
            });
        });
    });
});
