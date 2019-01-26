describe('Akodo Toturi 2', function() {
    integration(function() {
        describe('Akodo Toturi 2\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['akodo-toturi-2', 'matsu-berserker'],
                        hand: ['banzai', 'fine-katana','kami-unleashed','feral-ningyo', 'assassination']
                    },
                    player2: {
                        inPlay: ['togashi-mitsu','sinister-soshi'],
                        hand: ['banzai', 'fine-katana', 'kami-unleashed'],
                        dynastyDiscard: ['hidden-moon-dojo', 'bayushi-liar','back-alley-hideaway','artisan-academy'],
                        conflictDiscard: ['hurricane-punch']
                    }
                });
                this.player1.player.imperialFavor = 'political';

                this.akodoToturi2 = this.player1.findCardByName('akodo-toturi-2');
                this.matsuBerserker = this.player1.findCardByName('matsu-berserker');

                this.togashiMitsu = this.player2.findCardByName('togashi-mitsu');
                this.sinisterSoshi = this.player2.findCardByName('sinister-soshi');

                this.banzai1 = this.player1.findCardByName('banzai');
                this.fineKatana1 = this.player1.findCardByName('fine-katana');
                this.kamiUnleashed1 = this.player1.findCardByName('kami-unleashed');
                this.feralNingyo = this.player1.findCardByName('feral-ningyo');
                this.assassination = this.player1.findCardByName('assassination');

                this.banzai2 = this.player2.findCardByName('banzai');
                this.fineKatana2 = this.player2.findCardByName('fine-katana');
                this.kamiUnleashed2 = this.player2.findCardByName('kami-unleashed');
                this.hurricanePunch = this.player2.findCardByName('hurricane-punch');

                this.hiddenMoonDojo = this.player2.placeCardInProvince('hidden-moon-dojo', 'province 2');
                this.bayushiLiar = this.player2.placeCardInProvince('bayushi-liar', 'province 1');
                this.backAlleyHideaway = this.player2.placeCardInProvince('back-alley-hideaway', 'province 3');
                this.artisanAcademy = this.player2.placeCardInProvince('artisan-academy', 'province 4');
            });

            it('should not be able to be triggered outside of a conflict', function() {
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.akodoToturi2);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should not be able to be triggered during a conflict if he is not participating', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.matsuBerserker],
                    defenders: []
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.akodoToturi2);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            describe('during a conflict where he is participating', function() {
                beforeEach(function() {
                    this.noMoreActions();
                    this.initiateConflict({
                        attackers: [this.akodoToturi2],
                        defenders: [this.togashiMitsu],
                        ring: 'water'
                    });

                    //setup back alley hideaway
                    this.player2.pass();
                    this.player1.clickCard(this.assassination);
                    this.player1.clickCard(this.sinisterSoshi);
                    this.player2.clickCard(this.backAlleyHideaway);
                });

                it('should not be able to be triggered if you do not have favor', function() {
                    this.player1.player.imperialFavor = '';
                    this.player2.pass();
                    expect(this.player1.player.imperialFavor).toBe('');
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                    this.player1.clickCard(this.akodoToturi2);
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                });

                it('should be able to be triggered if you have favor', function() {
                    this.player2.pass();
                    expect(this.player1.player.imperialFavor).not.toBe('');
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                    this.player1.clickCard(this.akodoToturi2);
                    expect(this.player2).toHavePrompt('Conflict Action Window');
                });

                describe('if it resolves', function() {
                    beforeEach(function() {
                        this.player2.pass();
                        this.player1.clickCard(this.akodoToturi2);
                    });

                    it('should prevent his controller from playing cards from hand', function() {
                        this.player2.pass();
                        expect(this.player1).toHavePrompt('Conflict Action Window');
                        this.player1.clickCard(this.banzai1);
                        expect(this.player1).toHavePrompt('Conflict Action Window');
                        this.player1.clickCard(this.fineKatana1);
                        expect(this.player1).toHavePrompt('Conflict Action Window');
                        this.player1.clickCard(this.kamiUnleashed1);
                        expect(this.player1).toHavePrompt('Conflict Action Window');
                    });

                    it('should prevent the opponent from playing cards from hand', function() {
                        expect(this.player2).toHavePrompt('Conflict Action Window');
                        this.player2.clickCard(this.banzai2);
                        expect(this.player2).toHavePrompt('Conflict Action Window');
                        this.player2.clickCard(this.fineKatana2);
                        expect(this.player2).toHavePrompt('Conflict Action Window');
                        this.player2.clickCard(this.kamiUnleashed2);
                        expect(this.player2).toHavePrompt('Conflict Action Window');
                    });

                    it('should prevent playing cards from Hidden Moon Dojo', function() {
                        expect(this.player2).toHavePrompt('Conflict Action Window');
                        this.player2.clickCard(this.bayushiLiar);
                        expect(this.player2).toHavePrompt('Conflict Action Window');
                    });

                    it('should prevent triggering Togashi Mitsu', function() {
                        expect(this.player2).toHavePrompt('Conflict Action Window');
                        this.player2.clickCard(this.togashiMitsu);
                        expect(this.player2).toHavePrompt('Conflict Action Window');
                    });

                    it('should not prevent triggering a Feral Ningyo from hand', function() {
                        this.player2.pass();
                        expect(this.player1).toHavePrompt('Conflict Action Window');
                        expect(this.feralNingyo.location).toBe('hand');
                        this.player1.clickCard(this.feralNingyo);
                        expect(this.feralNingyo.location).toBe('play area');
                        expect(this.player1).not.toHavePrompt('Conflict Action Window');
                    });
                    /*
                    it('should not prevent playing a character from back-alley hideaway', function() {
                        expect(this.sinisterSoshi.location).toBe('backalley hideaway');
                        this.player2.clickCard(this.sinisterSoshi);
                        expect(this.player2).toHavePrompt('Sinister Soshi');
                        this.player2.clickPrompt('0');
                        expect(this.sinisterSoshi.location).toBe('play area');
                    });
                    */
                    it('should prevent playing a card from Artisan Academy ', function() {
                        this.player2.moveCard(this.fineKatana2, 'conflict deck');
                        this.player2.clickCard(this.artisanAcademy);
                        expect(this.player2.player.isTopConflictCardShown()).toBe(true);
                        this.player1.pass();
                        expect(this.player2).toHavePrompt('Conflict Action Window');
                        this.player2.clickCard(this.fineKatana2);
                        expect(this.player2).toHavePrompt('Conflict Action Window');
                    });

                    it('should last until the end of the conflict', function() {
                        this.noMoreActions();
                        this.player1.clickPrompt('Don\'t Resolve');
                        expect(this.player1).toHavePrompt('Action Window');
                        this.player1.clickCard(this.fineKatana1);
                        expect(this.player1).toHavePrompt('Choose a Card');
                    });
                });
            });
        });
    });
});

