describe('Embrace the Void', function() {
    integration(function() {
        describe('Embrace the Void/Karmic Twist interaction', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 1,
                        inPlay: ['miya-mystic', 'seppun-guardsman'],
                        hand: ['embrace-the-void', 'karmic-twist']
                    }
                });
                this.miyaMystic = this.player1.findCardByName('miya-mystic');
                this.miyaMystic.fate = 2;
                this.embraceTheVoid = this.player1.playAttachment('embrace-the-void', this.miyaMystic);
                this.player2.pass();
                this.karmicTwist = this.player1.clickCard('karmic-twist');
            });

            it('should give the fate to the player, not transfer it', function() {
                expect(this.player1).toHavePrompt('Karmic Twist');
                this.player1.clickCard(this.miyaMystic);
                expect(this.player1).toHavePrompt('Karmic Twist');
                this.seppunGuardsman = this.player1.clickCard('seppun-guardsman');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.embraceTheVoid);
                this.player1.clickCard(this.embraceTheVoid);
                expect(this.player1.fate).toBe(2);
                expect(this.miyaMystic.fate).toBe(0);
                expect(this.seppunGuardsman.fate).toBe(0);
                expect(this.karmicTwist.location).toBe('conflict discard pile');
            });
        });

        describe('Embrace the Void/Feast or Famine interaction', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 1,
                        inPlay: ['prodigy-of-the-waves'],
                        hand: ['embrace-the-void']
                    },
                    player2: {
                        provinces: ['feast-or-famine'],
                        inPlay: ['adept-of-the-waves']
                    }
                });
                this.prodigyOfTheWaves = this.player1.findCardByName('prodigy-of-the-waves');
                this.prodigyOfTheWaves.fate = 2;
                this.embraceTheVoid = this.player1.findCardByName('embrace-the-void');

                this.adeptOfTheWaves = this.player2.findCardByName('adept-of-the-waves');
                this.feastOrFamine = this.player2.findCardByName('feast-or-famine');

                this.player1.playAttachment(this.embraceTheVoid, this.prodigyOfTheWaves);
                this.player2.pass();
                this.player1.pass();
                this.initiateConflict({
                    attackers: [this.prodigyOfTheWaves],
                    defenders: []
                });
                this.player2.pass();
                this.player1.pass();
            });

            it('should give the fate to the player, not transfer it', function() {
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.feastOrFamine);
                this.player2.clickCard(this.feastOrFamine);
                expect(this.player2).toHavePrompt('Feast or Famine');
                expect(this.player2).toBeAbleToSelect(this.prodigyOfTheWaves);
                this.player2.clickCard(this.prodigyOfTheWaves);
                expect(this.player2).toHavePrompt('Feast or Famine');
                expect(this.player2).toBeAbleToSelect(this.adeptOfTheWaves);
                this.player2.clickCard(this.adeptOfTheWaves);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.embraceTheVoid);
                this.player1.clickCard(this.embraceTheVoid);
                expect(this.player1.fate).toBe(2);
                expect(this.prodigyOfTheWaves.fate).toBe(1);
                expect(this.adeptOfTheWaves.fate).toBe(0);
            });
        });

        describe('Embrace the Void/Assassination interaction', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate:1,
                        inPlay: ['adept-of-the-waves'],
                        hand: ['embrace-the-void']
                    },
                    player2: {
                        hand: ['assassination']
                    }
                });
                this.adeptOfTheWaves = this.player1.findCardByName('adept-of-the-waves');
                this.adeptOfTheWaves.fate = 3;
                this.embraceTheVoid = this.player1.playAttachment('embrace-the-void', this.adeptOfTheWaves);
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.adeptOfTheWaves],
                    defenders: []
                });
            });

            it('should give Embrace the Void\'s controller all fate when the character is assassinated', function() {
                this.player2.clickCard('assassination');
                this.player2.clickCard(this.adeptOfTheWaves);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.embraceTheVoid);
                this.player1.clickCard(this.embraceTheVoid);
                expect(this.player1.fate).toBe(4);
                expect(this.adeptOfTheWaves.location).toBe('dynasty discard pile');
                expect(this.embraceTheVoid.location).toBe('conflict discard pile');
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });
        });

        describe('Embrace the Void/A Legion of One interaction', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate:1,
                        inPlay: ['adept-of-the-waves'],
                        hand: ['a-legion-of-one']
                    },
                    player2: {
                        inPlay: ['adept-of-the-waves'],
                        hand: ['embrace-the-void']
                    }
                });
                this.legion = this.player1.findCardByName('a-legion-of-one');
                this.adept = this.player1.findCardByName('adept-of-the-waves');
                this.adept.fate = 2;
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.adept],
                    defenders: []
                });
            });

            it('should give Embrace the Void\'s controller the fate but still let A Legion Of One trigger a second time', function() {
                this.milStat = this.adept.getMilitarySkill();
                this.polStat = this.adept.getMilitarySkill();
                this.fateStat = this.adept.fate;
                this.player2Fate = this.player2.fate;
                this.player2.playAttachment('embrace-the-void', this.adept);
                this.player1.clickCard(this.legion);
                this.player1.clickCard(this.adept);
                this.player1.clickPrompt('Remove 1 fate to resolve this ability again');
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect('embrace-the-void');
                this.player2.clickCard('embrace-the-void');
                expect(this.adept.fate).toBe(this.fateStat - 1);
                expect(this.player2.fate).toBe(this.player2Fate + 1);
                expect(this.player1).toHavePrompt('Choose a character');
                expect(this.player1).toBeAbleToSelect(this.adept);
                this.player1.clickCard(this.adept);
                this.player1.clickPrompt('Done');
                expect(this.adept.getMilitarySkill()).toBe(this.milStat + 6);
                expect(this.adept.getPoliticalSkill()).toBe(this.polStat);
            });
        });

        describe('Embrace the Void/I Am Ready interaction', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate:1,
                        inPlay: ['wandering-ronin', 'shinjo-outrider'],
                        hand: ['i-am-ready']
                    },
                    player2: {
                        fate: 1,
                        inPlay: ['adept-of-the-waves'],
                        hand: ['embrace-the-void']
                    }
                });
                this.ronin = this.player1.findCardByName('wandering-ronin');
                this.shinjo = this.player1.findCardByName('shinjo-outrider');
                this.shinjo.fate = 2;
                this.ronin.fate = 2;
                this.shinjo.bowed = true;
                this.game.checkGameState(true);
                this.player1.pass();
                this.embrace = this.player2.playAttachment('embrace-the-void', this.shinjo);
            });

            it('should not cancel the effects of the event', function() {
                this.fateStat = this.shinjo.fate;
                this.player1.clickCard('i-am-ready');
                this.player1.clickCard(this.shinjo);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect('embrace-the-void');
                this.player2.clickCard('embrace-the-void');
                expect(this.shinjo.bowed).toBe(false);
                expect(this.shinjo.fate).toBe(this.fateStat - 1);
                expect(this.player2.fate).toBe(2);
            });
        });
    });
});
