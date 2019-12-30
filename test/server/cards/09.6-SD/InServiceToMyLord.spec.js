describe('In Service to My Lord', function() {
    integration(function() {
        describe('In Service to My Lord\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['brash-samurai', 'kakita-toshimoko', 'daidoji-uji', 'doji-challenger'],
                        hand: ['in-service-to-my-lord', 'sharpen-the-mind']
                    },
                    player2: {
                        inPlay: ['naive-student','doji-kuwanan'],
                        hand: ['voice-of-honor', 'way-of-the-crane']
                    }
                });
                this.brashSamurai = this.player1.findCardByName('brash-samurai');
                this.brashSamurai.bowed = false;
                this.kakitaToshimoko = this.player1.findCardByName('kakita-toshimoko');
                this.kakitaToshimoko.bowed = false;
                this.daidojiUji = this.player1.findCardByName('daidoji-uji');
                this.daidojiUji.bowed = true;
                this.dojiChallenger = this.player1.findCardByName('doji-challenger');
                this.dojiChallenger.bowed = true;

                this.service = this.player1.findCardByName('in-service-to-my-lord', 'hand');
                this.sharpenTheMind = this.player1.findCardByName('sharpen-the-mind');

                this.naiveStudent = this.player2.findCardByName('naive-student');
                this.naiveStudent.bowed = false;
                this.dojiKuwanan = this.player2.findCardByName('doji-kuwanan');
                this.dojiKuwanan.bowed = true;
            });

            it('should bow a non-unique to stand a unique and go to the bottom of the deck (should also allow you to choose an already standing unique)', function() {
                this.player1.clickCard(this.service);
                expect(this.player1).toHavePrompt('Choose a unique character');
                expect(this.player1).not.toBeAbleToSelect(this.brashSamurai);
                expect(this.player1).toBeAbleToSelect(this.kakitaToshimoko);
                expect(this.player1).toBeAbleToSelect(this.daidojiUji);
                expect(this.player1).not.toBeAbleToSelect(this.dojiChallenger);
                expect(this.player1).not.toBeAbleToSelect(this.naiveStudent);
                expect(this.player1).toBeAbleToSelect(this.dojiKuwanan);

                expect(this.daidojiUji.bowed).toBe(true);
                this.player1.clickCard(this.daidojiUji);

                expect(this.brashSamurai.bowed).toBe(false);
                expect(this.player1).toHavePrompt('Select card to bow');
                expect(this.player1).toBeAbleToSelect(this.brashSamurai);
                expect(this.player1).not.toBeAbleToSelect(this.kakitaToshimoko);
                expect(this.player1).not.toBeAbleToSelect(this.daidojiUji);
                expect(this.player1).not.toBeAbleToSelect(this.dojiChallenger);
                expect(this.player1).not.toBeAbleToSelect(this.naiveStudent);
                expect(this.player1).not.toBeAbleToSelect(this.dojiKuwanan);
                this.player1.clickCard(this.brashSamurai);
                expect(this.brashSamurai.bowed).toBe(true);
                expect(this.daidojiUji.bowed).toBe(false);
                expect(this.getChatLogs(1)).toContain('player1 plays In Service to My Lord, bowing Brash Samurai to ready Daidoji Uji.  In Service to My Lord is placed on the bottom of player1\'s conflict deck');
                expect(this.player1.player.conflictDeck.last()).toBe(this.service);
            });

            it('should go to the bottom of the deck even if you stand no one', function() {
                this.player1.clickCard(this.service);
                expect(this.player1).toHavePrompt('Choose a unique character');
                expect(this.kakitaToshimoko.bowed).toBe(false);
                this.player1.clickCard(this.kakitaToshimoko);
                expect(this.player1).toHavePrompt('Select card to bow');
                expect(this.player1).toBeAbleToSelect(this.brashSamurai);
                this.player1.clickCard(this.brashSamurai);
                expect(this.brashSamurai.bowed).toBe(true);
                expect(this.kakitaToshimoko.bowed).toBe(false);
                expect(this.getChatLogs(1)).toContain('player1 plays In Service to My Lord, bowing Brash Samurai to ready Kakita Toshimoko.  In Service to My Lord is placed on the bottom of player1\'s conflict deck');
                expect(this.player1.player.conflictDeck.last()).toBe(this.service);
            });

            it('should go to the discard pile if cancelled', function() {
                this.player1.pass();
                this.player2.clickCard('way-of-the-crane');
                this.player2.clickCard(this.dojiKuwanan);
                expect(this.dojiKuwanan.isHonored).toBe(true);
                this.player1.clickCard(this.service);
                this.player1.clickCard(this.daidojiUji);
                this.player1.clickCard(this.brashSamurai);

                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect('voice-of-honor');
                this.player2.clickCard('voice-of-honor');
                expect(this.player2).toHavePrompt('Action Window');
                expect(this.daidojiUji.bowed).toBe(true);
                expect(this.brashSamurai.bowed).toBe(true);
                expect(this.service.location).toBe('conflict discard pile');
            });

            it('should be playable from discard and go to bottom of deck', function() {
                this.player1.playAttachment(this.sharpenTheMind, this.brashSamurai);
                this.noMoreActions();

                this.initiateConflict({
                    type: 'military',
                    attackers: [this.brashSamurai],
                    defenders: []
                });

                this.player2.pass();

                this.player1.clickCard(this.sharpenTheMind);
                this.player1.clickCard(this.service);
                this.player2.pass();
                this.player1.clickCard(this.service);
                this.player1.clickCard(this.daidojiUji);
                this.player1.clickCard(this.brashSamurai);
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.daidojiUji.bowed).toBe(false);
                expect(this.brashSamurai.bowed).toBe(true);
                expect(this.player1.player.conflictDeck.last()).toBe(this.service);
            });

            it('same copy should be playable from discard if cancelled from hand', function() {
                this.noMoreActions();
                this.dojiChallenger.bowed = false;

                this.initiateConflict({
                    type: 'military',
                    attackers: [this.brashSamurai],
                    defenders: []
                });

                this.player2.clickCard('way-of-the-crane');
                this.player2.clickCard(this.dojiKuwanan);
                expect(this.dojiKuwanan.isHonored).toBe(true);

                this.player1.clickCard(this.service);
                this.player1.clickCard(this.daidojiUji);
                this.player1.clickCard(this.brashSamurai);

                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect('voice-of-honor');
                this.player2.clickCard('voice-of-honor');
                expect(this.player2).toHavePrompt('Conflict Action Window');

                expect(this.brashSamurai.bowed).toBe(true);
                expect(this.daidojiUji.bowed).toBe(true);
                expect(this.service.location).toBe('conflict discard pile');
                this.player2.pass();

                this.player1.clickCard(this.service);
                this.player1.clickCard(this.daidojiUji);
                this.player1.clickCard(this.dojiChallenger);
                expect(this.daidojiUji.bowed).toBe(false);
                expect(this.dojiChallenger.bowed).toBe(true);
                expect(this.player1.player.conflictDeck.last()).toBe(this.service);
            });

            it('same copy should be playable from discard if cancelled from discard', function() {
                this.player1.playAttachment(this.sharpenTheMind, this.dojiChallenger);
                this.noMoreActions();

                this.dojiChallenger.bowed = false;

                this.initiateConflict({
                    type: 'military',
                    attackers: [this.brashSamurai],
                    defenders: []
                });

                this.player2.pass();
                this.player1.clickCard(this.sharpenTheMind);
                this.player1.clickCard(this.service);

                this.player2.clickCard('way-of-the-crane');
                this.player2.clickCard(this.dojiKuwanan);
                expect(this.dojiKuwanan.isHonored).toBe(true);
                this.player1.clickCard(this.service);
                this.player1.clickCard(this.daidojiUji);
                this.player1.clickCard(this.brashSamurai);

                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect('voice-of-honor');
                this.player2.clickCard('voice-of-honor');
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.brashSamurai.bowed).toBe(true);
                expect(this.service.location).toBe('conflict discard pile');
                this.player2.pass();

                this.player1.clickCard(this.service);
                this.player1.clickCard(this.daidojiUji);
                this.player1.clickCard(this.dojiChallenger);
                expect(this.daidojiUji.bowed).toBe(false);
                expect(this.dojiChallenger.bowed).toBe(true);
                expect(this.player1.player.conflictDeck.last()).toBe(this.service);
            });
        });

        describe('Played by non-owner interaction', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['border-rider', 'doji-challenger'],
                        hand: ['voice-of-honor', 'way-of-the-crane', 'assassination', 'in-service-to-my-lord', 'censure', 'levy']
                    },
                    player2: {
                        inPlay: ['brash-samurai','doji-kuwanan'],
                        hand: ['stolen-secrets']
                    }
                });
                this.borderRider = this.player1.findCardByName('border-rider');
                this.dojiChallenger = this.player1.findCardByName('doji-challenger');
                this.brashSamurai = this.player2.findCardByName('brash-samurai');
                this.brashSamurai.fate = 2;
                this.dojiKuwanan = this.player2.findCardByName('doji-kuwanan');
                this.dojiKuwanan.bowed = true;

                this.service = this.player1.findCardByName('in-service-to-my-lord', 'hand');
                this.assassination = this.player1.findCardByName('assassination', 'hand');
                this.censure = this.player1.findCardByName('censure', 'hand');
                this.levy = this.player1.findCardByName('levy', 'hand');

                this.player1.player.moveCard(this.service, 'conflict deck');
                this.player1.player.moveCard(this.assassination, 'conflict deck');
                this.player1.player.moveCard(this.censure, 'conflict deck');
                this.player1.player.moveCard(this.levy, 'conflict deck');
                this.noMoreActions();

                this.initiateConflict({
                    type: 'political',
                    attackers: [this.borderRider],
                    defenders: [this.brashSamurai]
                });

                this.player2.clickCard('stolen-secrets');
                this.player2.clickCard(this.brashSamurai);
                this.player2.clickPrompt(this.service.name);
                this.player2.clickPrompt(this.assassination.name);
                this.player2.clickPrompt(this.censure.name);
            });

            it('should go to the bottom of owners deck if played by non-owner', function() {
                this.player1.pass();

                this.player2.clickCard(this.service);
                expect(this.player2).toHavePrompt('Choose a unique character');
                this.player2.clickCard(this.dojiKuwanan);
                this.player2.clickCard(this.brashSamurai);
                expect(this.dojiKuwanan.bowed).toBe(false);
                expect(this.brashSamurai.bowed).toBe(true);
                expect(this.player1.player.conflictDeck.last()).toBe(this.service);
                expect(this.getChatLogs(3)).toContain('player2 plays In Service to My Lord, bowing Brash Samurai to ready Doji Kuwanan.  In Service to My Lord is placed on the bottom of player1\'s conflict deck');
            });

            it('should go to the owners discard if played by non-owner and cancelled', function() {
                this.player1.clickCard('way-of-the-crane');
                this.player1.clickCard(this.dojiChallenger);
                expect(this.dojiChallenger.isHonored).toBe(true);

                this.player2.clickCard(this.service);
                this.player2.clickCard(this.dojiKuwanan);
                this.player2.clickCard(this.brashSamurai);

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect('voice-of-honor');
                this.player1.clickCard('voice-of-honor');
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.dojiKuwanan.bowed).toBe(true);
                expect(this.brashSamurai.bowed).toBe(true);
                expect(this.service.location).toBe('conflict discard pile');
                expect(this.player1.player.conflictDiscardPile.toArray()).toContain(this.service);
            });
        });

        describe('Special Interactions (From Hand)', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'draw',
                    player1: {
                        inPlay: ['guest-of-honor','master-of-gisei-toshi','utaku-tetsuko','akodo-toturi-2']
                    },
                    player2: {
                        fate: 30,
                        inPlay: ['doji-hotaru', 'doji-challenger'],
                        hand: ['in-service-to-my-lord']
                    }
                });
                this.hotaru = this.player2.findCardByName('doji-hotaru');
                this.dojiChallenger = this.player2.findCardByName('doji-challenger');
                this.service = this.player2.findCardByName('in-service-to-my-lord');
                this.hotaru.bowed = true;

                this.GoH = this.player1.findCardByName('guest-of-honor');
                this.MoGT = this.player1.findCardByName('master-of-gisei-toshi');
                this.tetsuko = this.player1.findCardByName('utaku-tetsuko');
                this.toturi = this.player1.findCardByName('akodo-toturi-2');
                this.player1.player.imperialFavor = 'political';

                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');

                this.noMoreActions();
                this.player1.clickCard(this.MoGT);
                this.player1.clickRing('fire');

                this.noMoreActions();
            });

            it('GoH - should not be playable from hand', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.GoH],
                    defenders: [this.dojiChallenger]
                });

                this.player2.clickCard(this.service);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('Tetsuko - should increase cost from hand', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.tetsuko],
                    defenders: [this.dojiChallenger]
                });

                this.player2.clickCard(this.service);
                this.player2.clickCard(this.hotaru);
                this.player2.clickCard(this.dojiChallenger);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.player2.fate).toBe(29);
            });

            it('Toturi2 - should not be playable from hand', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.toturi],
                    defenders: [this.dojiChallenger]
                });

                this.player2.pass();
                this.player1.clickCard(this.toturi);
                this.player2.clickCard(this.service);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('MoGT - should not be playable from hand', function() {
                this.initiateConflict({
                    type: 'military',
                    ring: 'fire',
                    attackers: [this.MoGT],
                    defenders: [this.dojiChallenger]
                });

                this.player2.clickCard(this.service);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });
        });

        describe('Special Interactions (From Discard)', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'draw',
                    player1: {
                        inPlay: ['guest-of-honor','master-of-gisei-toshi','utaku-tetsuko','akodo-toturi-2']
                    },
                    player2: {
                        fate: 30,
                        inPlay: ['doji-hotaru', 'doji-challenger'],
                        conflictDiscard: ['in-service-to-my-lord']
                    }
                });
                this.hotaru = this.player2.findCardByName('doji-hotaru');
                this.dojiChallenger = this.player2.findCardByName('doji-challenger');
                this.service = this.player2.findCardByName('in-service-to-my-lord');
                this.hotaru.bowed = true;

                this.GoH = this.player1.findCardByName('guest-of-honor');
                this.MoGT = this.player1.findCardByName('master-of-gisei-toshi');
                this.tetsuko = this.player1.findCardByName('utaku-tetsuko');
                this.toturi = this.player1.findCardByName('akodo-toturi-2');

                this.player1.player.imperialFavor = 'political';
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');

                this.noMoreActions();
                this.player1.clickCard(this.MoGT);
                this.player1.clickRing('fire');

                this.noMoreActions();
            });

            it('GoH - should not be playable from discard', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.GoH],
                    defenders: [this.dojiChallenger]
                });

                this.player2.clickCard(this.service);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('Tetsuko - should not increase cost from discard', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.tetsuko],
                    defenders: [this.dojiChallenger]
                });

                this.player2.clickCard(this.service);
                this.player2.clickCard(this.hotaru);
                this.player2.clickCard(this.dojiChallenger);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.player2.fate).toBe(30);
            });

            it('Toturi2 - should be playable from discard', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.toturi],
                    defenders: [this.dojiChallenger]
                });

                expect(this.hotaru.bowed).toBe(true);
                this.player2.pass();
                this.player1.clickCard(this.toturi);
                this.player2.clickCard(this.service);
                this.player2.clickCard(this.hotaru);
                this.player2.clickCard(this.dojiChallenger);
                expect(this.hotaru.bowed).toBe(false);
            });

            it('MoGT - should not be playable from discard', function() {
                this.initiateConflict({
                    type: 'military',
                    ring: 'fire',
                    attackers: [this.MoGT],
                    defenders: [this.dojiChallenger]
                });

                this.player2.clickCard(this.service);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });
        });
    });
});
