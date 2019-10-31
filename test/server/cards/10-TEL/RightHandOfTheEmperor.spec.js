describe('Right Hand of the Emperor', function() {
    integration(function() {
        describe('Right Hand of the Emperor\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['brash-samurai', 'border-rider', 'doji-whisperer', 'daidoji-uji', 'doji-challenger', 'guest-of-honor', 'moto-youth', 'kakita-toshimoko'],
                        hand: ['right-hand-of-the-emperor', 'sharpen-the-mind']
                    },
                    player2: {
                        inPlay: ['naive-student','doji-kuwanan'],
                        hand: ['voice-of-honor', 'way-of-the-crane']
                    }
                });
                this.player1.fate = 30;
                this.brashSamurai = this.player1.findCardByName('brash-samurai');
                this.brashSamurai.bowed = true;
                this.borderRider = this.player1.findCardByName('border-rider');
                this.borderRider.fate = 1;
                this.borderRider.bowed = true;
                this.dojiWhisperer = this.player1.findCardByName('doji-whisperer');
                this.daidojiUji = this.player1.findCardByName('daidoji-uji');
                this.daidojiUji.bowed = true;
                this.dojiChallenger = this.player1.findCardByName('doji-challenger');
                this.dojiChallenger.bowed = true;
                this.guestOfHonor = this.player1.findCardByName('guest-of-honor');
                this.guestOfHonor.bowed = true;
                this.motoYouth = this.player1.findCardByName('moto-youth');
                this.motoYouth.bowed = true;
                this.kakitaToshimoko = this.player1.findCardByName('kakita-toshimoko');
                this.kakitaToshimoko.bowed = false;
                this.rightHandOfTheEmperor = this.player1.findCardByName('right-hand-of-the-emperor', 'hand');
                this.sharpenTheMind = this.player1.findCardByName('sharpen-the-mind');

                this.naiveStudent = this.player2.findCardByName('naive-student');
                this.naiveStudent.bowed = true;
                this.dojiKuwanan = this.player2.findCardByName('doji-kuwanan');
                this.dojiKuwanan.bowed = true;
            });

            it('should be playable from hand if less honorable', function() {
                this.player1.player.honor = 5;
                this.player2.player.honor = 11;
                this.player1.playAttachment(this.sharpenTheMind, this.dojiChallenger);
                this.player2.pass();
                this.player1.clickCard(this.rightHandOfTheEmperor);
                expect(this.player1).toHavePrompt('Choose characters');
            });

            it('should be playable from hand if equally honorable', function() {
                this.player1.player.honor = 11;
                this.player2.player.honor = 11;
                this.player1.playAttachment(this.sharpenTheMind, this.dojiChallenger);
                this.player2.pass();
                this.player1.clickCard(this.rightHandOfTheEmperor);
                expect(this.player1).toHavePrompt('Choose characters');
            });

            it('should be playable from hand if more honorable', function() {
                this.player1.player.honor = 11;
                this.player2.player.honor = 5;
                this.player1.playAttachment(this.sharpenTheMind, this.dojiChallenger);
                this.player2.pass();
                this.player1.clickCard(this.rightHandOfTheEmperor);
                expect(this.player1).toHavePrompt('Choose characters');
            });

            it('should prompt you to target bowed bushi characters you control', function() {
                this.player1.clickCard(this.rightHandOfTheEmperor);
                expect(this.player1).toHavePrompt('Choose characters');
                expect(this.player1).toBeAbleToSelect(this.brashSamurai);
                expect(this.player1).toBeAbleToSelect(this.borderRider);
                expect(this.player1).not.toBeAbleToSelect(this.dojiWhisperer);
                expect(this.player1).toBeAbleToSelect(this.daidojiUji);
                expect(this.player1).toBeAbleToSelect(this.dojiChallenger);
                expect(this.player1).not.toBeAbleToSelect(this.guestOfHonor);
                expect(this.player1).not.toBeAbleToSelect(this.naiveStudent);
                expect(this.player1).toBeAbleToSelect(this.motoYouth);
                expect(this.player1).not.toBeAbleToSelect(this.dojiKuwanan);
                expect(this.player1).not.toBeAbleToSelect(this.kakitaToshimoko);
            });

            it('should allow you to select zero characters', function() {
                this.player1.clickCard(this.rightHandOfTheEmperor);
                expect(this.player1).toHavePrompt('Choose characters');
                expect(this.player1).toHavePromptButton('Done');
            });

            it('should allow you to select zero characters and go to the bottom of the deck', function() {
                this.player1.clickCard(this.rightHandOfTheEmperor);
                expect(this.player1).toHavePrompt('Choose characters');
                expect(this.player1).toHavePromptButton('Done');
                this.player1.clickPrompt('Done');
                expect(this.getChatLogs(1)).toContain('player1 plays Right Hand of the Emperor to ready no one.  Right Hand of the Emperor is placed on the bottom of player1\'s conflict deck');
                expect(this.player1.player.conflictDeck.last()).toBe(this.rightHandOfTheEmperor);
            });

            it('should not allow you to target characters greater than a total of 6 fate cost', function() {
                this.player1.clickCard(this.rightHandOfTheEmperor);
                this.player1.clickCard(this.daidojiUji);
                this.player1.clickCard(this.dojiChallenger);
                expect(this.player1.player.promptState.selectedCards).toContain(this.daidojiUji);
                expect(this.player1.player.promptState.selectedCards).not.toContain(this.dojiChallenger);
            });

            it('should allow you to target characters with a total of 6 fate cost or fewer', function() {
                this.player1.clickCard(this.rightHandOfTheEmperor);
                this.player1.clickCard(this.dojiChallenger);
                expect(this.player1).toHavePromptButton('Done');
                this.player1.clickCard(this.brashSamurai);
                expect(this.player1).toHavePromptButton('Done');
                this.player1.clickCard(this.motoYouth);
                expect(this.player1).toHavePromptButton('Done');
            });

            it('should ready the chosen characters', function() {
                this.player1.clickCard(this.rightHandOfTheEmperor);
                this.player1.clickCard(this.dojiChallenger);
                this.player1.clickCard(this.brashSamurai);
                this.player1.clickCard(this.motoYouth);
                this.player1.clickPrompt('Done');
                expect(this.dojiChallenger.bowed).toBe(false);
                expect(this.brashSamurai.bowed).toBe(false);
                expect(this.motoYouth.bowed).toBe(false);
                expect(this.getChatLogs(1)).toContain('player1 plays Right Hand of the Emperor to ready Doji Challenger, Brash Samurai and Moto Youth.  Right Hand of the Emperor is placed on the bottom of player1\'s conflict deck');
            });

            it('should go to bottom of the deck rather than discard', function() {
                this.player1.clickCard(this.rightHandOfTheEmperor);
                this.player1.clickCard(this.dojiChallenger);
                this.player1.clickCard(this.brashSamurai);
                this.player1.clickCard(this.motoYouth);
                this.player1.clickPrompt('Done');
                expect(this.dojiChallenger.bowed).toBe(false);
                expect(this.brashSamurai.bowed).toBe(false);
                expect(this.motoYouth.bowed).toBe(false);
                expect(this.getChatLogs(1)).toContain('player1 plays Right Hand of the Emperor to ready Doji Challenger, Brash Samurai and Moto Youth.  Right Hand of the Emperor is placed on the bottom of player1\'s conflict deck');
                expect(this.player1.player.conflictDeck.last()).toBe(this.rightHandOfTheEmperor);
            });

            it('should go to the discard pile if cancelled', function() {
                this.player1.pass();
                this.player2.clickCard('way-of-the-crane');
                this.player2.clickCard(this.dojiKuwanan);
                expect(this.dojiKuwanan.isHonored).toBe(true);
                this.player1.clickCard(this.rightHandOfTheEmperor);
                expect(this.player1).toHavePrompt('Choose characters');
                this.player1.clickCard(this.dojiChallenger);
                expect(this.player1).toHavePromptButton('Done');
                this.player1.clickPrompt('Done');
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect('voice-of-honor');
                this.player2.clickCard('voice-of-honor');
                expect(this.player2).toHavePrompt('Action Window');
                expect(this.dojiChallenger.bowed).toBe(true);
                expect(this.rightHandOfTheEmperor.location).toBe('conflict discard pile');
            });

            it('should be playable from discard if more honorable and go to bottom of deck', function() {
                this.player1.player.honor = 11;
                this.player2.player.honor = 5;
                this.player1.playAttachment(this.sharpenTheMind, this.dojiChallenger);
                this.noMoreActions();

                this.dojiChallenger.bowed = false;

                this.initiateConflict({
                    type: 'military',
                    attackers: [this.dojiChallenger],
                    defenders: []
                });

                this.player2.pass();

                this.player1.clickCard(this.sharpenTheMind);
                this.player1.clickCard(this.rightHandOfTheEmperor);
                this.player2.pass();
                this.player1.clickCard(this.rightHandOfTheEmperor);
                expect(this.player1).toHavePrompt('Choose characters');
                this.player1.clickCard(this.brashSamurai);
                expect(this.player1).toHavePromptButton('Done');
                this.player1.clickPrompt('Done');
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.brashSamurai.bowed).toBe(false);
                expect(this.player1.player.conflictDeck.last()).toBe(this.rightHandOfTheEmperor);
            });

            it('should not be playable from discard if equally honorable', function() {
                this.player1.player.honor = 5;
                this.player2.player.honor = 5;

                this.player1.playAttachment(this.sharpenTheMind, this.dojiChallenger);
                this.noMoreActions();

                this.dojiChallenger.bowed = false;

                this.initiateConflict({
                    type: 'military',
                    attackers: [this.dojiChallenger],
                    defenders: []
                });

                this.player2.pass();
                this.player1.clickCard(this.sharpenTheMind);
                this.player1.clickCard(this.rightHandOfTheEmperor);
                this.player2.pass();

                this.player1.clickCard(this.rightHandOfTheEmperor);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not be playable from discard if less honorable', function() {
                this.player1.player.honor = 5;
                this.player2.player.honor = 11;
                this.player1.playAttachment(this.sharpenTheMind, this.dojiChallenger);
                this.noMoreActions();

                this.dojiChallenger.bowed = false;

                this.initiateConflict({
                    type: 'military',
                    attackers: [this.dojiChallenger],
                    defenders: []
                });

                this.player2.pass();
                this.player1.clickCard(this.sharpenTheMind);
                this.player1.clickCard(this.rightHandOfTheEmperor);
                this.player2.pass();

                this.player1.clickCard(this.rightHandOfTheEmperor);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });


            it('same copy should be playable from discard if cancelled from hand', function() {
                this.player1.player.honor = 11;
                this.player2.player.honor = 5;

                this.player1.playAttachment(this.sharpenTheMind, this.dojiChallenger);
                this.noMoreActions();

                this.dojiChallenger.bowed = false;

                this.initiateConflict({
                    type: 'military',
                    attackers: [this.dojiChallenger],
                    defenders: []
                });

                this.player2.clickCard('way-of-the-crane');
                this.player2.clickCard(this.dojiKuwanan);
                expect(this.dojiKuwanan.isHonored).toBe(true);
                this.player1.clickCard(this.rightHandOfTheEmperor);
                expect(this.player1).toHavePrompt('Choose characters');
                this.player1.clickCard(this.brashSamurai);
                expect(this.player1).toHavePromptButton('Done');
                this.player1.clickPrompt('Done');
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect('voice-of-honor');
                this.player2.clickCard('voice-of-honor');
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.brashSamurai.bowed).toBe(true);
                expect(this.rightHandOfTheEmperor.location).toBe('conflict discard pile');
                this.player2.pass();

                this.player1.clickCard(this.rightHandOfTheEmperor);
                expect(this.player1).toHavePrompt('Choose characters');
                this.player1.clickCard(this.brashSamurai);
                expect(this.player1).toHavePromptButton('Done');
                this.player1.clickPrompt('Done');
                expect(this.brashSamurai.bowed).toBe(false);
                expect(this.player1.player.conflictDeck.last()).toBe(this.rightHandOfTheEmperor);
            });

            it('same copy should be playable from discard if cancelled from discard', function() {
                this.player1.player.honor = 11;
                this.player2.player.honor = 5;

                this.player1.playAttachment(this.sharpenTheMind, this.dojiChallenger);
                this.noMoreActions();

                this.dojiChallenger.bowed = false;

                this.initiateConflict({
                    type: 'military',
                    attackers: [this.dojiChallenger],
                    defenders: []
                });

                this.player2.pass();
                this.player1.clickCard(this.sharpenTheMind);
                this.player1.clickCard(this.rightHandOfTheEmperor);

                this.player2.clickCard('way-of-the-crane');
                this.player2.clickCard(this.dojiKuwanan);
                expect(this.dojiKuwanan.isHonored).toBe(true);
                this.player1.clickCard(this.rightHandOfTheEmperor);
                expect(this.player1).toHavePrompt('Choose characters');
                this.player1.clickCard(this.brashSamurai);
                expect(this.player1).toHavePromptButton('Done');
                this.player1.clickPrompt('Done');
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect('voice-of-honor');
                this.player2.clickCard('voice-of-honor');
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.brashSamurai.bowed).toBe(true);
                expect(this.rightHandOfTheEmperor.location).toBe('conflict discard pile');
                this.player2.pass();

                this.player1.clickCard(this.rightHandOfTheEmperor);
                expect(this.player1).toHavePrompt('Choose characters');
                this.player1.clickCard(this.brashSamurai);
                expect(this.player1).toHavePromptButton('Done');
                this.player1.clickPrompt('Done');
                expect(this.brashSamurai.bowed).toBe(false);
                expect(this.player1.player.conflictDeck.last()).toBe(this.rightHandOfTheEmperor);
            });
        });

        describe('Right Hand of the Emperor played by non-owner interaction', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['border-rider', 'doji-challenger'],
                        hand: ['voice-of-honor', 'way-of-the-crane', 'assassination', 'right-hand-of-the-emperor', 'censure', 'levy']
                    },
                    player2: {
                        inPlay: ['brash-samurai','doji-kuwanan'],
                        hand: ['stolen-secrets']
                    }
                });
                this.player1.fate = 30;
                this.player2.fate = 30;
                this.borderRider = this.player1.findCardByName('border-rider');
                this.dojiChallenger = this.player1.findCardByName('doji-challenger');
                this.brashSamurai = this.player2.findCardByName('brash-samurai');
                this.brashSamurai.fate = 2;
                this.dojiKuwanan = this.player2.findCardByName('doji-kuwanan');
                this.dojiKuwanan.bowed = true;

                this.rightHandOfTheEmperor = this.player1.findCardByName('right-hand-of-the-emperor', 'hand');
                this.assassination = this.player1.findCardByName('assassination', 'hand');
                this.censure = this.player1.findCardByName('censure', 'hand');
                this.levy = this.player1.findCardByName('levy', 'hand');

                this.player1.player.moveCard(this.rightHandOfTheEmperor, 'conflict deck');
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
                this.player2.clickPrompt(this.rightHandOfTheEmperor.name);
                this.player2.clickPrompt(this.assassination.name);
                this.player2.clickPrompt(this.censure.name);
            });

            it('should go to the bottom of owners deck if played by non-owner', function() {
                this.player1.pass();

                this.player2.clickCard(this.rightHandOfTheEmperor);
                expect(this.player2).toHavePrompt('Choose characters');
                this.player2.clickCard(this.dojiKuwanan);
                expect(this.player2).toHavePromptButton('Done');
                this.player2.clickPrompt('Done');
                expect(this.dojiKuwanan.bowed).toBe(false);
                expect(this.player1.player.conflictDeck.last()).toBe(this.rightHandOfTheEmperor);
                expect(this.getChatLogs(3)).toContain('player2 plays Right Hand of the Emperor to ready Doji Kuwanan.  Right Hand of the Emperor is placed on the bottom of player1\'s conflict deck');
            });

            it('should go to the owners discard if played by non-owner and cancelled', function() {

                this.player1.clickCard('way-of-the-crane');
                this.player1.clickCard(this.dojiChallenger);
                expect(this.dojiChallenger.isHonored).toBe(true);

                this.player2.clickCard(this.rightHandOfTheEmperor);
                expect(this.player2).toHavePrompt('Choose characters');
                this.player2.clickCard(this.dojiKuwanan);
                expect(this.player2).toHavePromptButton('Done');
                this.player2.clickPrompt('Done');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect('voice-of-honor');
                this.player1.clickCard('voice-of-honor');
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.dojiKuwanan.bowed).toBe(true);
                expect(this.rightHandOfTheEmperor.location).toBe('conflict discard pile');
                expect(this.player1.player.conflictDiscardPile.toArray()).toContain(this.rightHandOfTheEmperor);
            });
        });

        describe('Right Hand of the Emperor <-> Special Interactions (From Hand)', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'draw',
                    player1: {
                        honor: 5,
                        inPlay: ['guest-of-honor','master-of-gisei-toshi','utaku-tetsuko','akodo-toturi-2']
                    },
                    player2: {
                        honor: 11,
                        fate: 30,
                        inPlay: ['brash-samurai', 'doji-challenger'],
                        hand: ['right-hand-of-the-emperor']
                    }
                });
                this.brashSamurai = this.player2.findCardByName('brash-samurai');
                this.dojiChallenger = this.player2.findCardByName('doji-challenger');
                this.rightHandOfTheEmperor = this.player2.findCardByName('right-hand-of-the-emperor');
                this.brashSamurai.bowed = true;

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

                this.player2.clickCard(this.rightHandOfTheEmperor);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('Tetsuko - should increase cost from hand', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.tetsuko],
                    defenders: [this.dojiChallenger]
                });

                this.player2.clickCard(this.rightHandOfTheEmperor);
                this.player2.clickCard(this.brashSamurai);
                this.player2.clickPrompt('Done');
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.player2.fate).toBe(26);
            });

            it('Toturi2 - should not be playable from hand', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.toturi],
                    defenders: [this.dojiChallenger]
                });

                this.player2.pass();
                this.player1.clickCard(this.toturi);
                this.player2.clickCard(this.rightHandOfTheEmperor);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('MoGT - should not be playable from hand', function() {
                this.initiateConflict({
                    type: 'military',
                    ring: 'fire',
                    attackers: [this.MoGT],
                    defenders: [this.dojiChallenger]
                });

                this.player2.clickCard(this.rightHandOfTheEmperor);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });
        });

        describe('Right Hand of the Emperor <-> Special Interactions (From Discard)', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'draw',
                    player1: {
                        honor: 5,
                        inPlay: ['guest-of-honor','master-of-gisei-toshi','utaku-tetsuko','akodo-toturi-2']
                    },
                    player2: {
                        honor: 11,
                        fate: 30,
                        inPlay: ['brash-samurai', 'doji-challenger'],
                        conflictDiscard: ['right-hand-of-the-emperor']
                    }
                });
                this.brashSamurai = this.player2.findCardByName('brash-samurai');
                this.dojiChallenger = this.player2.findCardByName('doji-challenger');
                this.rightHandOfTheEmperor = this.player2.findCardByName('right-hand-of-the-emperor');
                this.brashSamurai.bowed = true;

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

                this.player2.clickCard(this.rightHandOfTheEmperor);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('Tetsuko - should not increase cost from discard', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.tetsuko],
                    defenders: [this.dojiChallenger]
                });

                this.player2.clickCard(this.rightHandOfTheEmperor);
                this.player2.clickCard(this.brashSamurai);
                this.player2.clickPrompt('Done');
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.player2.fate).toBe(27);
            });

            it('Toturi2 - should be playable from discard', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.toturi],
                    defenders: [this.dojiChallenger]
                });

                this.player2.pass();
                this.player1.clickCard(this.toturi);
                this.player2.clickCard(this.rightHandOfTheEmperor);
                expect(this.player2).toHavePrompt('Choose characters');
            });

            it('MoGT - should not be playable from discard', function() {
                this.initiateConflict({
                    type: 'military',
                    ring: 'fire',
                    attackers: [this.MoGT],
                    defenders: [this.dojiChallenger]
                });

                this.player2.clickCard(this.rightHandOfTheEmperor);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });
        });
    });
});
