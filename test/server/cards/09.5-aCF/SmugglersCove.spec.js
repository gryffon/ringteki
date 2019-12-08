describe('Smuggler\'s Cove', function() {
    integration(function() {
        describe('Smuggler\'s Cove\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['akodo-gunso', 'akodo-kage']
                    },
                    player2: {
                        inPlay: ['bayushi-aramoro', 'shrine-maiden'],
                        provinces: ['smuggler-s-cove'],
                        role: 'seeker-of-air'
                    }
                });
                this.akodoGunso = this.player1.findCardByName('akodo-gunso');
                this.akodoKage = this.player1.findCardByName('akodo-kage');

                this.bayushiAramoro = this.player2.findCardByName('bayushi-aramoro');
                this.maiden = this.player2.findCardByName('shrine-maiden');
                this.smugglersCove = this.player2.findCardByName('smuggler-s-cove');

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.akodoGunso],
                    provinces: this.smugglersCove,
                    defenders: [this.bayushiAramoro]
                });
                this.player2.clickCard(this.smugglersCove);
            });

            it('should trigger when attackers are declared', function() {
                expect(this.player2).toHavePrompt('Smuggler\'s Cove');
                expect(this.player2).toBeAbleToSelect(this.bayushiAramoro);
                expect(this.player2).toBeAbleToSelect(this.maiden);
                expect(this.player2).not.toBeAbleToSelect(this.akodoGunso);
                expect(this.player2).not.toBeAbleToSelect(this.akodoKage);
            });

            it('should move a character into the conflict if its at home', function() {
                expect(this.maiden.isParticipating()).toBe(false);
                this.player2.clickCard(this.maiden);
                expect(this.maiden.isParticipating()).toBe(true);
            });

            it('should move a character home if they are in the conflict', function() {
                expect(this.bayushiAramoro.isParticipating()).toBe(true);
                this.player2.clickCard(this.bayushiAramoro);
                expect(this.bayushiAramoro.isParticipating()).toBe(false);
            });
        });
    });
});
