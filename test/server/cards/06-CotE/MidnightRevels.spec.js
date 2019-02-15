describe('Midnight Revels', function() {
    integration(function() {
        describe('Midnight Revels\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['akodo-gunso', 'akodo-kage']
                    },
                    player2: {
                        inPlay: ['adept-of-shadows', 'bayushi-aramoro'],
                        hand: ['bayushi-kachiko'],
                        provinces: ['midnight-revels'],
                        role: 'keeper-of-water'
                    }
                });
                this.akodoGunso = this.player1.findCardByName('akodo-gunso');
                this.akodoKage = this.player1.findCardByName('akodo-kage');

                this.bayushiAramoro = this.player2.findCardByName('bayushi-aramoro');
                this.bayushiKachiko = this.player2.findCardByName('bayushi-kachiko');
                this.midnightRevels = this.player2.findCardByName('midnight-revels');
            });

            it('should trigger when attackers are declared', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.akodoGunso],
                    type: 'political'
                });
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.midnightRevels);
            });

            it('should prompt the player to choose a card with the highest printed cost', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.akodoGunso],
                    type: 'political'
                });
                this.player2.clickCard(this.midnightRevels);
                expect(this.player2).toHavePrompt('Midnight Revels');
                expect(this.player2).not.toBeAbleToSelect(this.akodoGunso);
                expect(this.player2).toBeAbleToSelect(this.akodoKage);
                expect(this.player2).toBeAbleToSelect(this.bayushiAramoro);
            });

            it('should bow the chosen character', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.akodoGunso],
                    type: 'political'
                });
                this.player2.clickCard(this.midnightRevels);
                expect(this.akodoKage.bowed).toBe(false);
                this.player2.clickCard(this.akodoKage);
                expect(this.akodoKage.bowed).toBe(true);
            });

            it('should not be able to be triggered if the highest printed cost character is already bowed', function() {
                this.player1.pass();
                this.player2.clickCard(this.bayushiKachiko);
                this.player2.clickPrompt('0');
                this.bayushiKachiko.bowed = true;
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.akodoGunso],
                    type: 'political'
                });
                expect(this.player2).not.toHavePrompt('Triggered Abilities');
                expect(this.player2).toHavePrompt('Choose Defenders');
            });
        });
    });
});
