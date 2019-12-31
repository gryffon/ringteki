describe('Starry Heaven Sanctuary', function() {
    integration(function() {
        describe('Starry Heaven Sanctuary\'s ability', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['hida-guardian', 'borderlands-defender', 'akodo-kaede'],
                        dynastyDeck: ['starry-heaven-sanctuary'],
                        hand: ['jurojin-s-curse', 'consumed-by-five-fires', 'karmic-twist'],
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
                expect(this.player1.fate).toBe(8);
            });

            it('should not be able to trigger if 4 fate was not remove simultaneously', function () {
                this.hidaGuardian.fate = 0;
                this.akodoKaede.fate = 1;

                this.flow.finishConflictPhase();
                this.player1.clickCard(this.hidaGuardian);
                this.player1.clickCard(this.akodoKaede);
                expect(this.player1).toHavePrompt('Discard Dynasty Cards');
                expect(this.player1.fate).toBe(6);
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

            it('should trigger from events which move or remove fate also', function() {
                this.player1.player.promptedActionWindows.fate = true;

                this.bayushiAramoro.fate = 4;
                this.shrineMaiden.fate = 3;
                this.borderlandsDefender.fate = 1;
                this.hidaGuardian.fate = 5;
                this.flow.finishConflictPhase();

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.starryHeavenSanctuary);
                this.player1.clickPrompt('Pass');
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard('consumed-by-five-fires');
                expect(this.player1).toHavePrompt('Consumed By Five Fires');
                this.player1.clickCard(this.bayushiAramoro);
                this.player1.clickPrompt('3');
                this.player1.clickCard(this.shrineMaiden);
                this.player1.clickPrompt('2');
                expect(this.bayushiAramoro.fate).toBe(0);
                expect(this.shrineMaiden.fate).toBe(0);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.starryHeavenSanctuary);
                this.player1.clickPrompt('Pass');
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard('karmic-twist');
                expect(this.player1).toHavePrompt('Karmic Twist');
                this.player1.clickCard(this.hidaGuardian);
                this.player1.clickCard(this.borderlandsDefender);
                expect(this.hidaGuardian.fate).toBe(0);
                expect(this.borderlandsDefender.fate).toBe(4);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.starryHeavenSanctuary);

            });

            it('should see an additional fate phase as a seperate fate phase', function () {
                this.hidaGuardian.fate = 0;
                this.akodoKaede.fate = 0;
                this.shrineMaiden.fate = 0;
                this.bayushiAramoro.fate = 2;
                this.borderlandsDefender.fate = 2;
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.playAttachment(this.jurojinsCurse, this.borderlandsDefender);
                expect(this.jurojinsCurse.location).toBe('play area');

                this.flow.finishConflictPhase();
                this.player1.clickCard(this.hidaGuardian);
                this.player1.clickCard(this.akodoKaede);
                this.player2.clickCard(this.shrineMaiden);

                expect(this.player1).toHavePrompt('Discard Dynasty Cards');
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');

                expect(this.player1.fate).toBe(6);
                expect(this.borderlandsDefender.fate).toBe(0);
                expect(this.bayushiAramoro.fate).toBe(0);

                expect(this.player2).toHavePrompt('Discard Dynasty Cards');
            });
        });
    });
});

