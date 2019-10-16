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
                        provinces: ['smuggler-s-cove']
                    }
                });
                this.akodoGunso = this.player1.findCardByName('akodo-gunso');
                this.akodoKage = this.player1.findCardByName('akodo-kage');

                this.bayushiAramoro = this.player2.findCardByName('bayushi-aramoro');
                this.maiden = this.player2.findCardByName('shrine-maiden');
                this.smugglersCove = this.player2.findCardByName('smuggler-s-cove');

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.akodoGunso],
                    defenders: [this.bayushiAramoro]
                });
            });

            it('should trigger when attackers are declared', function() {
                this.player2.clickCard(this.smugglersCove);
                expect(this.player2).toHavePromptTitle('Smuggler\'s Cove');
                expect(this.player2).toBeAbleToSelect(this.bayushiAramoro);
                expect(this.player2).toBeAbleToSelect(this.maiden);
                expect(this.player2).not.toBeAbleToSelect(this.akodoGunso);
                expect(this.player2).not.toBeAbleToSelect(this.akodoKage);
            });
        });
    });
});
