describe('Ofushikai', function() {
    integration(function() {
        describe('Ofushikai attachment', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 3,
                        inPlay: ['shiba-tsukune', 'asako-tsuki', 'fearsome-mystic', 'yoritomo'],
                        hand: ['ofushikai', 'seal-of-the-phoenix']
                    },
                    player2: {
                        inPlay: ['crisis-breaker']
                    }
                });
                this.shibaTsukune = this.player1.findCardByName('shiba-tsukune');
                this.askaoTsuki = this.player1.findCardByName('asako-tsuki');
                this.fearsomeMysic = this.player1.findCardByName('fearsome-mystic');
                this.yoritomo = this.player1.findCardByName('yoritomo');

                this.ofushikaiMilitaryBonus = 2;
                this.ofushikaiPoliticalBonus = 3;
            });

            it('should increase the attached characters military an political skills when attached', function() {
                this.player1.playAttachment('ofushikai', 'shiba-tsukune');
                expect(this.player2).toHavePrompt('Action Window');
                expect(this.shibaTsukune.getMilitarySkill()).toBe(this.shibaTsukune.getBaseMilitarySkill() + this.ofushikaiMilitaryBonus);
                expect(this.shibaTsukune.getPoliticalSkill()).toBe(this.shibaTsukune.getBasePoliticalSkill() + this.ofushikaiPoliticalBonus);
            });

            it('should grant the ability to a character that is a phoenix champion when attached', function() {
                let shibaTsukuneActionCount = this.shibaTsukune.getActions().length;
                this.player1.playAttachment('ofushikai', 'shiba-tsukune');
                expect(this.player2).toHavePrompt('Action Window');
                expect(this.shibaTsukune.getActions().length).toBe(shibaTsukuneActionCount + 1);
            });

            it('should not attach to a non-unique character', function() {
                this.player1.clickCard('ofushikai');
                expect(this.player1).not.toBeAbleToSelect(this.fearsomeMysic);
            });

            it('should not grant an ability to a character that is not a champion when attached', function() {
                let tsukiActionCount = this.askaoTsuki.getActions().length;
                this.player1.playAttachment('ofushikai', 'asako-tsuki');
                expect(this.player2).toHavePrompt('Action Window');
                expect(this.askaoTsuki.getActions().length).toBe(tsukiActionCount);
            });

            describe('unique non-phoenix character with the seal of the phoenix attached', function() {
                beforeEach(function () {
                    this.player1.playAttachment('seal-of-the-phoenix', 'yoritomo');
                    this.player2.pass();
                    this.sealOfThePhoenixMilitaryBonus = 0;
                    this.sealOfThePhoenixPoliticalBonus = 1;
                });

                it('should attach', function() {
                    this.player1.clickCard('ofushikai');
                    expect(this.player1).toBeAbleToSelect(this.yoritomo);
                });

                it('should attach and increase the characters skills by +2/+3', function() {
                    this.player1.clickCard('ofushikai');
                    this.player1.clickCard(this.yoritomo);
                    expect(this.yoritomo.getMilitarySkill()).toBe(this.yoritomo.getBaseMilitarySkill() + this.player1.fate + this.sealOfThePhoenixMilitaryBonus + this.ofushikaiMilitaryBonus);
                    expect(this.yoritomo.getPoliticalSkill()).toBe(this.yoritomo.getBasePoliticalSkill() + this.player1.fate + this.sealOfThePhoenixPoliticalBonus + this.ofushikaiPoliticalBonus);
                    expect(this.player2).toHavePrompt('Action Window');
                });

                it('should grant the ability if the character is a champion', function() {
                    let yoritomoActionCount = this.yoritomo.getActions().length;
                    this.player1.clickCard('ofushikai');
                    this.player1.clickCard(this.yoritomo);
                    expect(this.yoritomo.getActions().length).toBe(yoritomoActionCount + 1);
                    expect(this.player2).toHavePrompt('Action Window');
                });
            });

            describe('during a conflict', function () {
                beforeEach(function () {
                    this.ofushikai = this.player1.playAttachment('ofushikai', 'shiba-tsukune');
                    this.crisisBreaker = this.player2.findCardByName('crisis-breaker');
                    this.noMoreActions();
                });

                it('should send a participating character home from the conflict if champion it is attached to is participating', function() {
                    this.initiateConflict({
                        type: 'military',
                        attackers: [this.shibaTsukune],
                        defenders: [this.crisisBreaker]
                    });
                    this.player2.pass();
                    this.player1.clickCard(this.shibaTsukune);
                    expect(this.player1).toHavePrompt('Choose a character');
                    this.player1.clickCard(this.crisisBreaker);
                    expect(this.getChatLogs(3)).toContain('player1 uses Shiba Tsukune\'s gained ability from Ofushikai to send Crisis Breaker home');
                    expect(this.player2).toHavePrompt('Conflict Action Window');
                    expect(this.crisisBreaker.inConflict).toBe(false);
                    let cannotParticipateAsAttackerEffects = this.crisisBreaker.effects.filter(effect => effect.type === 'cannotParticipateAsAttacker' && effect.duration === 'untilEndOfPhase');
                    expect(cannotParticipateAsAttackerEffects.length).toBeGreaterThan(0);
                });

                it('should not trigger action if champion it is attached to is not participating', function() {
                    this.initiateConflict({
                        type: 'military',
                        attackers: [this.askaoTsuki],
                        defenders: [this.crisisBreaker]
                    });
                    this.player2.pass();
                    this.player1.clickCard(this.shibaTsukune);
                    expect(this.player1).not.toHavePrompt('Choose a character');
                });
            });
        });
    });
});
