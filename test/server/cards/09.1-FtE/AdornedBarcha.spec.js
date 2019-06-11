describe('Adorned Barcha', function() {
    integration(function() {
        describe('Adorned Barcha', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['iuchi-shahai', 'moto-youth'],
                        hand: ['adorned-barcha']
                    },
                    player2: {
                        inPlay: ['miya-mystic']
                    }
                });
                this.motoyouth = this.player1.findCardByName('moto-youth');
                this.iuchishahai = this.player1.findCardByName('iuchi-shahai');
                this.miyamystic = this.player2.findCardByName('miya-mystic');
                this.noMoreActions();
            });

            it('ability should bow participating character', function() {
                this.initiateConflict({
                    attackers: ['moto-youth'],
                    defenders: [],
                    type: 'military'
                });
                this.player2.pass();
                this.player1.playAttachment('adorned-barcha', 'iuchi-shahai');
                this.player2.pass();
                this.player1.clickCard('adorned-barcha');
                expect(this.player1).toBeAbleToSelect(this.motoyouth);
                this.player1.clickCard(this.motoyouth);
                expect(this.motoyouth.bowed).toBe(true);
            });

            it('ability should move character to conflict', function() {
                this.initiateConflict({
                    attackers: ['moto-youth'],
                    defenders: [],
                    type: 'military'
                });
                this.player2.pass();
                this.player1.playAttachment('adorned-barcha', 'iuchi-shahai');
                this.player2.pass();
                this.player1.clickCard('adorned-barcha');
                this.player1.clickCard(this.motoyouth);
                expect(this.iuchishahai.isParticipating()).toBe(true);
            });

            it('abililty should not work in political conflict', function() {
                this.initiateConflict({
                    attackers: ['moto-youth'],
                    defenders: [],
                    type: 'political'
                });
                this.player2.pass();
                this.player1.playAttachment('adorned-barcha', 'iuchi-shahai');
                this.player2.pass();
                this.player1.clickCard('adorned-barcha');
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should only attach to unique characters you control', function() {
                this.initiateConflict({
                    attackers: ['moto-youth'],
                    defenders: [],
                    type: 'military'
                });
                this.player2.pass();
                this.player1.clickCard('adorned-barcha');
                expect(this.player1).not.toBeAbleToSelect(this.motoyouth);
                expect(this.player1).toBeAbleToSelect(this.iuchishahai);
                expect(this.player1).not.toBeAbleToSelect(this.miyamystic);
            });

            it('should give +3 military/+0 political', function() {
                this.initiateConflict({
                    attackers: ['moto-youth'],
                    defenders: [],
                    type: 'military'
                });
                this.player2.pass();
                this.player1.playAttachment('adorned-barcha', 'iuchi-shahai');
                expect(this.iuchishahai.getMilitarySkill()).toBe(this.iuchishahai.getBaseMilitarySkill() + 3);
                expect(this.iuchishahai.getPoliticalSkill()).toBe(this.iuchishahai.getBasePoliticalSkill());
            });
        });
    });
});
