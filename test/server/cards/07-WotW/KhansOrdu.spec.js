describe('Khan\'s Ordu', function() {
    integration(function() {
        describe('Khan\'s Ordu ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['akodo-gunso', 'akodo-kage']
                    },
                    player2: {
                        inPlay: ['border-rider', 'moto-horde'],
                        provinces: ['khan-s-ordu']
                    }
                });
                this.akodoGunso = this.player1.findCardByName('akodo-gunso');
                this.akodoKage = this.player1.findCardByName('akodo-kage');

                this.borderRider = this.player2.findCardByName('border-rider');
                this.motoHorde = this.player2.findCardByName('moto-horde');
                this.khansOrdu = this.player2.findCardByName('khan-s-ordu');
            });

            it('should trigger when revealed', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.akodoGunso],
                    type: 'political'
                });
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.khansOrdu);
            });

            it('should switch the conflict type if it is a political conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.akodoGunso],
                    type: 'political'
                });
                expect(this.game.currentConflict.conflictType).toBe('political');
                this.player2.clickCard(this.khansOrdu);
                expect(this.getChatLogs(1)).toContain('player1 has initiated a military conflict with skill 2');
                expect(this.game.currentConflict.conflictType).toBe('military');
            });

            it('should not switch the conflict type if it is already a military conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.akodoGunso],
                    type: 'military'
                });
                expect(this.game.currentConflict.conflictType).toBe('military');
                this.player2.clickCard(this.khansOrdu);
                expect(this.game.currentConflict.conflictType).toBe('military');
            });

            it('should set all future conflicts to be military', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.akodoGunso],
                    type: 'military'
                });
                this.player2.clickCard(this.khansOrdu);
                expect(this.player1.player.getConflictOpportunities('military')).toBe(1);
                expect(this.player1.player.getConflictOpportunities('political')).toBe(0);
                expect(this.player1.player.getConflictOpportunities('total')).toBe(1);
                expect(this.player2.player.getConflictOpportunities('military')).toBe(2);
                expect(this.player2.player.getConflictOpportunities('political')).toBe(0);
                expect(this.player2.player.getConflictOpportunities('total')).toBe(2);
            });
        });
    });
});
