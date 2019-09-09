describe('Starry Heaven Sanctuary', function() {
    integration(function() {
        describe('Starry Heaven Sanctuary\'s ability', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['hida-guardian', 'borderlands-defender', 'akodo-kaede'],
                        dynastyDeck: ['starry-heaven-sanctuary', 'jurojin-s-curse'],
                        fate: 6
                    },
                    player2: {
                        inPlay: ['bayushi-aramoro', 'shrine-maiden'],
                        hand: ['fiery-madness', 'i-can-swim']
                    }
                });
                this.hidaGuardian = this.player1.findCardByName('hida-guardian');
                this.borderlandsDefender = this.player1.findCardByName('borderlands-defender');
                this.akodoKaede = this.player1.findCardByName('akodo-kaede');
                this.bayushiAramoro = this.player2.findCardByName('bayushi-aramoro');
                this.shrineMaiden = this.player2.findCardByName('shrine-maiden');

                this.jurojinsCurse = this.player1.findCardByName('jurojin-s-curse');
                this.starryHeavenSanctuary = this.player1.placeCardInProvince('starry-heaven-sanctuary', 'province 1');

                this.shrineMaiden.fate = 1;
                this.hidaGuardian.fate = 1;
                this.borderlandsDefender.fate = 1;
                this.bayushiAramoro.fate = 1;
                this.akodoKaede.fate = 1;
            });

            it('should give be able to trigger if 4 fate was removed during the fate phase', function () {
                this.flow.finishConflictPhase();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.starryHeavenSanctuary);

                this.player1.clickCard(this.starryHeavenSanctuary);
                this.player1.clickPrompt('onMoveFate');
                expect(this.player1.fate).toBe(8);
            });

            it('should give be able to trigger if 4 fate was removed during the fate phase, even if it was moved by another effect', function () {
                this.hidaGuardian.fate = 0;
                this.akodoKaede.fate = 1;

                this.flow.finishConflictPhase();
                this.player1.clickCard(this.hidaGuardian);
                this.player1.clickCard(this.akodoKaede);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.starryHeavenSanctuary);

                this.player1.clickCard(this.starryHeavenSanctuary);
                this.player1.clickPrompt('onMoveFate');
                expect(this.player1.fate).toBe(8);
            });

            it('should not be able to trigger if 3 or less fate was removed', function () {
                this.hidaGuardian.fate = 0;
                this.akodoKaede.fate = 0;

                this.flow.finishConflictPhase();
                this.player1.clickCard(this.hidaGuardian);
                this.player1.clickCard(this.akodoKaede);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1.fate).toBe(6);
            });

            it('should see an additional fate phase as a seperate fate phase', function () {
                this.hidaGuardian.fate = 0;
                this.akodoKaede.fate = 0;
                this.shrineMaiden.fate = 0;
                this.bayushiAramoro.fate = 2;
                this.borderlandsDefender.fate = 2;
                this.player1.playAttachment(this.jurojinsCurse, this.borderlandsDefender);

                this.flow.finishConflictPhase();
                this.player1.clickCard(this.hidaGuardian);
                this.player1.clickCard(this.akodoKaede);
                this.player2.clickCard(this.shrineMaiden);

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.jurojinsCurse);
                this.player1.clickCard(this.jurojinsCurse)

                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1.fate).toBe(6);
            });
        });
    });
});

